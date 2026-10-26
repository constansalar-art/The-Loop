"""Elige los mejores momentos: arma un resumen del stream con señales y se lo pasa a Claude."""
import json
from pathlib import Path

import numpy as np

from .util import fmt_ts, log

SCHEMA = {
    "type": "object",
    "properties": {
        "clips": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "start_seconds": {"type": "number"},
                    "end_seconds": {"type": "number"},
                    "title": {"type": "string"},
                    "caption": {"type": "string"},
                    "hashtags": {"type": "array", "items": {"type": "string"}},
                    "reason": {"type": "string"},
                    "score": {"type": "integer"},
                    "layout_hint": {"type": "string", "enum": ["auto", "split", "fullcam"]},
                },
                "required": ["start_seconds", "end_seconds", "title", "caption", "hashtags",
                             "reason", "score", "layout_hint"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["clips"],
    "additionalProperties": False,
}

SYSTEM = """Sos editor/a de clips para TikTok de un streamer. Recibís la transcripción \
completa de una VOD con marcas de tiempo y señales automáticas, y elegís los momentos con más \
potencial viral.

Contexto del canal:
{context}

Cómo elegir:
- Priorizá reacciones fuertes, humor, momentos inesperados, bronca, remates de historias y \
interacción graciosa con el chat. Un clip tiene que entenderse solo, sin haber visto el stream.
- [VOL +N dB] marca cuánto sube el volumen respecto de los minutos alrededor (gritos, \
festejos). [CHAT xN] marca cuánto se acelera el chat respecto de lo normal. Son pistas, no \
verdades: un pico sin nada interesante en la transcripción no sirve, y un buen remate \
tranquilo sí puede servir.
- La transcripción es automática y tiene errores; interpretá la intención.
- Empezá el clip 1-3 segundos antes de que arranque la situación (que se entienda el \
contexto, pero sin relleno: los primeros 2 segundos tienen que enganchar). Terminá justo \
después del remate o la reacción. Duración entre {min_s} y {max_s} segundos.
- Los clips no se pueden superponer. Ordenalos de mejor a peor (score 1-10, sé exigente).

Textos (en español rioplatense, natural, sin sonar a marketing):
- title: gancho corto que se muestra sobre el video al inicio, máximo 7 palabras.
- caption: una línea para la descripción de TikTok.
- hashtags: 3 a 5, sin el #.

IMPORTANTE: TikTok restringe el contenido que promociona apuestas. En title, caption y \
hashtags NO incluyas nombres de casinos, códigos, links, montos de depósito ni invitaciones \
a apostar o registrarse; nada de #casino, #slots ni #apuestas. Enfocá los textos en la \
reacción, la emoción o la situación graciosa.

layout_hint: "fullcam" si en ese momento claramente está solo la cámara (just chatting), \
"split" si está jugando, "auto" si no se puede saber."""


def _chat_rate(chat: list | None, duration: int) -> np.ndarray | None:
    if not chat:
        return None
    counts = np.zeros(duration + 1)
    for t, _ in chat:
        if 0 <= t <= duration:
            counts[int(t)] += 1
    # mensajes en los 20 s siguientes / mediana del stream
    window = np.convolve(counts, np.ones(20), mode="full")[: len(counts)]
    base = max(np.median(window[window > 0]) if np.any(window > 0) else 1, 1)
    return window / base


def build_prompt(transcript: dict, loudness: dict, chat: list | None, duration: float) -> str:
    rel = np.array(loudness["relative"])
    rate = _chat_rate(chat, int(duration))
    lines = []
    prev_end = 0.0
    for seg in transcript["segments"]:
        s, e = seg["start"], seg["end"]
        if s - prev_end > 20:
            gap_vol = rel[int(prev_end): int(s)].max() if int(s) > int(prev_end) else 0
            mark = f" [VOL +{gap_vol:.0f} dB]" if gap_vol >= 8 else ""
            lines.append(f"[{fmt_ts(prev_end)}] (sin habla {s - prev_end:.0f} s){mark}")
        tags = ""
        vol = rel[int(s): int(e) + 1].max() if int(e) + 1 > int(s) and int(s) < len(rel) else 0
        if vol >= 6:
            tags += f" [VOL +{vol:.0f} dB]"
        if rate is not None:
            r = rate[int(s): int(e) + 10].max() if int(s) < len(rate) else 0
            if r >= 2:
                tags += f" [CHAT x{r:.1f}]"
        lines.append(f"[{fmt_ts(s)}] {seg['text']}{tags}")
        prev_end = e

    extra = ""
    if chat:
        # Muestra de mensajes en los picos de chat, para que Claude vea de qué se ríe la gente.
        peaks = []
        order = np.argsort(rate)[::-1]
        for i in order:
            if len(peaks) >= 25:
                break
            if all(abs(i - p) > 60 for p in peaks):
                peaks.append(int(i))
        samples = []
        for p in sorted(peaks):
            msgs = [m for t, m in chat if p <= t <= p + 20][:8]
            samples.append(f"[{fmt_ts(p)}] x{rate[p]:.1f}: " + " | ".join(msgs))
        extra = "\n\nPicos de chat (con mensajes de ejemplo):\n" + "\n".join(samples)

    return (f"Duración de la VOD: {fmt_ts(duration)}.{extra}\n\n"
            "Transcripción:\n" + "\n".join(lines))


def _snap(clip: dict, words: list, min_s: float, max_s: float, duration: float) -> tuple[float, float]:
    start, end = clip["start_seconds"], clip["end_seconds"]
    near_s = [w for w in words if abs(w["start"] - start) < 2.0]
    if near_s:
        start = min(near_s, key=lambda w: abs(w["start"] - start))["start"] - 0.25
    near_e = [w for w in words if abs(w["end"] - end) < 2.0]
    if near_e:
        end = min(near_e, key=lambda w: abs(w["end"] - end))["end"] + 0.6
    start = max(0.0, start)
    end = min(duration, end)
    if end - start < min_s:
        end = min(duration, start + min_s)
    if end - start > max_s + 5:
        end = start + max_s + 5
    return round(start, 2), round(end, 2)


def select_highlights(transcript: dict, loudness: dict, chat: list | None, duration: float,
                      cfg: dict, prompt_out: Path, dry_run: bool = False) -> list | None:
    g = cfg["general"]
    system = SYSTEM.format(context=g["channel_context"].strip() or "(sin contexto)",
                           min_s=g["min_clip_seconds"], max_s=g["max_clip_seconds"])
    user = build_prompt(transcript, loudness, chat, duration)
    user += (f"\n\nElegí los {g['num_clips']} mejores clips. Si no hay tantos momentos buenos, "
             "devolvé menos: prefiero pocos buenos que relleno.")
    prompt_out.write_text(f"=== SYSTEM ===\n{system}\n\n=== USER ===\n{user}", encoding="utf-8")
    if dry_run:
        log(f"Prompt guardado en {prompt_out} (modo prueba, no se llamó a Claude).")
        return None

    import anthropic

    model = cfg["claude"]["model"]
    log(f"Pidiéndole a Claude ({model}) que elija los mejores momentos...")
    client = anthropic.Anthropic()
    with client.beta.messages.stream(
        model=model,
        max_tokens=32000,
        betas=["server-side-fallback-2026-07-01"],
        fallbacks="default",
        output_config={"effort": cfg["claude"]["effort"],
                       "format": {"type": "json_schema", "schema": SCHEMA}},
        system=system,
        messages=[{"role": "user", "content": user}],
    ) as stream:
        msg = stream.get_final_message()

    if msg.stop_reason == "refusal":
        raise SystemExit(f"Claude rechazó el pedido: {msg.stop_details}")
    if msg.stop_reason == "max_tokens":
        raise SystemExit("La respuesta de Claude se cortó (max_tokens). Bajá num_clips.")
    texts = [b.text for b in msg.content if b.type == "text"]
    data = json.loads(texts[-1])
    u = msg.usage
    log(f"Tokens: {u.input_tokens:,} de entrada, {u.output_tokens:,} de salida.")

    words = [w for seg in transcript["segments"] for w in seg["words"]]
    clips = []
    for c in sorted(data["clips"], key=lambda c: -c["score"]):
        start, end = _snap(c, words, g["min_clip_seconds"], g["max_clip_seconds"], duration)
        if end <= start or any(start < o["end"] and end > o["start"] for o in clips):
            continue
        clips.append({
            "id": len(clips) + 1,
            "start": start,
            "end": end,
            "vod_time": f"{fmt_ts(start)} - {fmt_ts(end)}",
            "score": c["score"],
            "title": c["title"],
            "caption": c["caption"],
            "hashtags": c["hashtags"],
            "reason": c["reason"],
            "layout": c["layout_hint"],
        })
    return clips
