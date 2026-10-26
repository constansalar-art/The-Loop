import time
import wave
from pathlib import Path

import numpy as np

from .util import fmt_ts, log, write_json

# Frases que Whisper "alucina" en silencios o música.
HALLUCINATIONS = (
    "subtítulos realizados por",
    "amara.org",
    "gracias por ver",
    "suscríbete",
    "suscribete",
)


def _resolve(cfg: dict) -> tuple[str, str, str]:
    device = cfg["device"]
    if device == "auto":
        try:
            import ctranslate2
            device = "cuda" if ctranslate2.get_cuda_device_count() > 0 else "cpu"
        except Exception:
            device = "cpu"
    model = cfg["model"]
    if model == "auto":
        model = "large-v3-turbo" if device == "cuda" else "small"
    compute = "float16" if device == "cuda" else "int8"
    return model, device, compute


def _run(wav: Path, model_name: str, device: str, compute: str, language: str) -> list:
    from faster_whisper import WhisperModel

    # Leemos el WAV nosotros (16 kHz mono): evita depender de PyAV, que cambia su API seguido.
    with wave.open(str(wav), "rb") as w:
        audio = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
    audio = audio.astype(np.float32) / 32768.0

    model = WhisperModel(model_name, device=device, compute_type=compute)
    segments, info = model.transcribe(
        audio, language=language, vad_filter=True, word_timestamps=True,
        beam_size=5 if device == "cuda" else 1, condition_on_previous_text=False,
    )
    result = []
    t0 = last_report = time.time()
    for seg in segments:  # la transcripción real ocurre mientras se itera
        text = seg.text.strip()
        if not text or any(h in text.lower() for h in HALLUCINATIONS):
            continue
        result.append({
            "start": round(seg.start, 2),
            "end": round(seg.end, 2),
            "text": text,
            "words": [
                {"start": round(w.start, 2), "end": round(w.end, 2), "word": w.word.strip()}
                for w in (seg.words or []) if w.word.strip()
            ],
        })
        if time.time() - last_report > 30:
            last_report = time.time()
            pct = 100 * seg.end / max(info.duration, 1)
            log(f"  {fmt_ts(seg.end)} / {fmt_ts(info.duration)} ({pct:.0f}%) "
                f"- {(time.time() - t0) / 60:.1f} min")
    return result


def transcribe(wav: Path, out_json: Path, cfg: dict, language: str) -> None:
    model_name, device, compute = _resolve(cfg)
    log(f"Transcribiendo con Whisper '{model_name}' en {device.upper()}...")
    t0 = time.time()
    try:
        result = _run(wav, model_name, device, compute, language)
    except Exception as e:  # típico en Windows: faltan las DLL de CUDA/cuDNN
        if device != "cuda":
            raise
        log(f"No se pudo usar la GPU ({e}). Sigo en CPU con el modelo 'small'.")
        model_name = "small"
        result = _run(wav, model_name, "cpu", "int8", language)
    write_json(out_json, {"model": model_name, "segments": result})
    log(f"Transcripción lista: {len(result)} segmentos en {(time.time() - t0) / 60:.1f} min.")
