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

CHUNK_SECONDS = 1800


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

    model = WhisperModel(model_name, device=device, compute_type=compute)
    result = []
    t0 = last_report = time.time()
    # Leemos el WAV nosotros (16 kHz mono): evita depender de PyAV, que cambia su API seguido.
    # Por partes de 30 min: una VOD de 4-5 h entera (con VAD y timestamps por palabra) supera
    # los 12 GB de RAM.
    with wave.open(str(wav), "rb") as w:
        sr = w.getframerate()
        total = w.getnframes() / sr
        offset = 0.0
        while offset < total:
            w.setpos(int(offset * sr))
            audio = np.frombuffer(w.readframes(int(CHUNK_SECONDS * sr)), dtype=np.int16)
            audio = audio.astype(np.float32) / 32768.0
            segments, _ = model.transcribe(
                audio, language=language, vad_filter=True, word_timestamps=True,
                beam_size=5 if device == "cuda" else 1, condition_on_previous_text=False,
            )
            for seg in segments:  # la transcripción real ocurre mientras se itera
                text = seg.text.strip()
                if not text or any(h in text.lower() for h in HALLUCINATIONS):
                    continue
                result.append({
                    "start": round(offset + seg.start, 2),
                    "end": round(offset + seg.end, 2),
                    "text": text,
                    "words": [
                        {"start": round(offset + x.start, 2), "end": round(offset + x.end, 2),
                         "word": x.word.strip()}
                        for x in (seg.words or []) if x.word.strip()
                    ],
                })
                if time.time() - last_report > 30:
                    last_report = time.time()
                    done = offset + seg.end
                    log(f"  {fmt_ts(done)} / {fmt_ts(total)} ({100 * done / max(total, 1):.0f}%) "
                        f"- {(time.time() - t0) / 60:.1f} min")
            offset += CHUNK_SECONDS
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
