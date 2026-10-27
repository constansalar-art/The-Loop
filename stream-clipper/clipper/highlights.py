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
                    "hook_start_seconds": {"type": "number"},
                    "hook_end_seconds": {"type": "number"},
                    "title": {"type": "string"},
                    "caption": {"type": "string"},
                    "hashtags": {"type": "array", "items": {"type": "string"}},
                    "reason": {"type": "string"},
                    "score": {"type": "integer"},
                    "layout_hint": {"type": "string", "enum": ["auto", "split", "fullcam"]},
                },
                "required": ["start_seconds", "end_seconds", "hook_start_seconds", "hook_end_seconds", "title", "caption", "hashtags",
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

Objetivo: que alguien que no conoce al streamer lo descubra en TikTok y quiera ir a verlo \
en vivo. Priorizá momentos que muestren su personalidad y la dinámica con amigos e invitados, lo \
que solo pasa en vivo (retos, castigos, ruletas, apuestas entre amigos, el chat metiéndose), \
humor que se entiende solo y cosas que alguien le mandaría a un amigo. Variá los tipos de clip.

Cómo elegir:
- Priorizá gritos, enojos y bronca, festejos de ganancias, humor, momentos inesperados, \
remates de historias e interacción graciosa con el chat. Un clip tiene que entenderse solo, sin haber visto el stream.
- [GRITO +N dB] marca cuánto más fuerte que su voz normal habla en esa frase (gritos, \
bronca, festejos). [CHAT xN] marca cuánto se acelera el chat respecto de lo normal. Son pistas, no \
verdades: un pico sin nada interesante en la transcripción no sirve, y un buen remate \
tranquilo sí puede servir.
- La transcripción es automática y tiene errores; interpretá la intención.
- Cada clip dura entre {min_s} y {max_s} segundos EN TOTAL, contando el gancho. Es un \
límite duro: si el momento es más largo, quedate con la parte más fuerte.
- GANCHO (cold open): los primeros 2 segundos deciden si la gente se queda. Elegí con \
hook_start_seconds/hook_end_seconds un fragmento de 1.5 a 3 segundos con la frase o \
reacción más fuerte del momento (normalmente el remate). Se muestra primero, con el título \
encima, y después arranca el clip desde start_seconds. El gancho tiene que generar \
curiosidad ("¿cómo llegó a esto?") sin spoilear todo el chiste.
- El cuerpo (start_seconds a end_seconds) empieza justo donde arranca la situación, sin \
saludos ni relleno, y termina apenas después del remate o la reacción.
- Las malas palabras NO son motivo para descartar un momento: se censuran solas con un \
pitido. Lo que sí hay que descartar es otra cosa:
- NO elijas momentos con insultos racistas, xenófobos u homofóbicos, comentarios sobre \
menores de edad, acusaciones a terceros, amenazas ni datos personales, aunque sean "fuertes". \
Si un buen momento tiene una frase así en el medio, descartalo o cortalo para que quede \
afuera. Esto baja la cuenta en TikTok y no vale la pena.
- Los clips no se pueden superponer. Ordenalos de mejor a peor (score 1-10, sé exigente).

Textos (en español rioplatense, natural, sin sonar a marketing, sin malas palabras):
- title: texto del gancho que se ve en los primeros segundos, máximo 7 palabras. Que genere \
curiosidad o tensión (ej: "Nadie esperaba esta llamada"), no que describa todo.
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


def _shout_scores(segments: list, db: np.ndarray, window: float = 300) -> list[float]:
    """Cuánto más fuerte es cada frase respecto de cómo habla el streamer en esos minutos.

    Comparar contra la voz (y no contra todo el audio) evita que la música del slot o los
    silencios hagan que todo parezca un grito."""
    peaks = []
    for seg in segments:
        a, b = int(seg["start"]), int(seg["end"]) + 1
        peaks.append(float(db[a:b].max()) if a < len(db) and b > a else -100.0)
    peaks = np.array(peaks)
    starts = np.array([seg["start"] for seg in segments])
    scores = []
    for i, seg in enumerate(segments):
        near = np.abs(starts - seg["start"]) <= window
        scores.append(float(peaks[i] - np.median(peaks[near])))
    return scores


def build_prompt(transcript: dict, loudness: dict, chat: list | None, duration: float) -> str:
    db = np.array(loudness["db"])
    segments = transcript["segments"]
    shout = _shout_scores(segments, db)
    rate = _chat_rate(chat, int(duration))
    lines = []
    prev_end = 0.0
    for seg, sc in zip(segments, shout):
        s, e = seg["start"], seg["end"]
        if s - prev_end > 20:
            lines.append(f"[{fmt_ts(prev_end)}] (sin habla {s - prev_end:.0f} s)")
        tags = f" [GRITO +{sc:.0f} dB]" if sc >= 6 else ""
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
    """Ajusta los cortes a palabras: arranca en la primera palabra desde el inicio pedido y
    termina en la última que cierra antes del final pedido (sin arrastrar frases vecinas)."""
    start, end = clip["start_seconds"], clip["end_seconds"]
    first = next((w for w in words if w["start"] >= start - 0.3), None)
    if first and first["start"] - start < 2.0:
        start = first["start"] - 0.25
    last = None
    for w in words:
        if w["end"] > end + 0.3:
            break
        last = w
    if last and end - last["end"] < 2.0:
        end = last["end"] + 0.6
    start = max(0.0, start)
    end = min(duration, end)
    if end - start < min_s:
        end = min(duration, start + min_s)
    if end - start > max_s:
        end = start + max_s
    return round(start, 2), round(end, 2)


def select_highlights(transcript: dict, loudness: dict, chat: list | None, duration: float,
                      cfg: dict, prompt_out: Path, dry_run: bool = False) -> list | None:
    g = cfg["general"]
    system = SYSTEM.format(context=g["channel_context"].strip() or "(sin contexto)",
                           min_s=g["min_clip_seconds"], max_s=g["max_clip_seconds"])
    user = build_prompt(transcript, loudness, chat, duration)
    user += (f"\n\nElegí los {g['num_clips']} mejores clips. Si no hay tantos momentos buenos, "
             "devolvé menos, pero no descartes momentos buenos por ser parecidos en calidad: el streamer elige después cuáles subir.")
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
        hs, he = c["hook_start_seconds"], c["hook_end_seconds"]
        hook = he - hs if 0.5 <= he - hs <= 4 else 0.0
        body_max = g["max_clip_seconds"] - hook
        start, end = _snap(c, words, max(g["min_clip_seconds"] - hook, 5), body_max, duration)
        if end <= start or any(start < o["end"] and end > o["start"] for o in clips):
            continue
        clips.append({
            "id": len(clips) + 1,
            "start": start,
            "end": end,
            "hook_start": round(hs, 2) if hook else None,
            "hook_end": round(he, 2) if hook else None,
            "vod_time": f"{fmt_ts(start)} - {fmt_ts(end)}",
            "score": c["score"],
            "title": c["title"],
            "caption": c["caption"],
            "hashtags": c["hashtags"],
            "reason": c["reason"],
            "layout": c["layout_hint"],
        })
    return clips
