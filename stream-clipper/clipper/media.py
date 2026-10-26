import json
import re
import sys
import subprocess
import wave
from pathlib import Path

import numpy as np

from .util import log, run


def is_url(source: str) -> bool:
    return source.startswith(("http://", "https://"))


def download_vod(url: str, workdir: Path, max_height: int) -> Path:
    existing = sorted(workdir.glob("video.*"))
    existing = [p for p in existing if p.suffix in (".mp4", ".mkv", ".webm")]
    if existing:
        return existing[0]
    log("Descargando la VOD (puede tardar bastante, es el paso más lento)...")
    base = [
        sys.executable, "-m", "yt_dlp",
        "-f", f"bv*[height<={max_height}]+ba/b[height<={max_height}]/b",
        "--merge-output-format", "mp4",
        "-o", str(workdir / "video.%(ext)s"),
        url,
    ]
    # Kick está detrás de Cloudflare: si falla, reintentamos imitando un navegador.
    for extra in ([], ["--impersonate", "chrome"]):
        proc = subprocess.run(base[:3] + extra + base[3:])
        if proc.returncode == 0:
            break
    else:
        sys.exit("No se pudo descargar la VOD. Probá actualizar yt-dlp: pip install -U yt-dlp")
    return next(p for p in workdir.glob("video.*") if p.suffix in (".mp4", ".mkv", ".webm"))


def probe(video: Path) -> dict:
    out = run([
        "ffprobe", "-v", "error", "-select_streams", "v:0",
        "-show_entries", "stream=width,height:format=duration", "-of", "json", video,
    ])
    data = json.loads(out)
    stream = data["streams"][0]
    return {
        "width": int(stream["width"]),
        "height": int(stream["height"]),
        "duration": float(data["format"]["duration"]),
    }


def extract_audio(video: Path, wav: Path) -> None:
    if wav.exists():
        return
    log("Extrayendo audio...")
    tmp = wav.with_suffix(".tmp.wav")
    run(["ffmpeg", "-y", "-v", "error", "-i", video, "-vn", "-ac", "1", "-ar", "16000",
         "-c:a", "pcm_s16le", tmp])
    tmp.replace(wav)


def loudness_profile(wav: Path) -> dict:
    """Volumen por segundo (dB) y cuánto sobresale respecto de los 5 minutos alrededor."""
    db = []
    with wave.open(str(wav), "rb") as w:
        rate = w.getframerate()
        while True:
            frames = w.readframes(rate)
            if not frames:
                break
            x = np.frombuffer(frames, dtype=np.int16).astype(np.float32) / 32768.0
            rms = float(np.sqrt(np.mean(x * x))) if len(x) else 0.0
            db.append(20 * np.log10(max(rms, 1e-5)))
    db = np.array(db)
    half = 150
    rel = np.empty_like(db)
    for i in range(len(db)):
        rel[i] = db[i] - np.median(db[max(0, i - half): i + half])
    return {"db": np.round(db, 1).tolist(), "relative": np.round(rel, 1).tolist()}


def extract_frame(video: Path, at: float, out_png: Path) -> None:
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{at:.2f}", "-i", video, "-frames:v", "1", out_png])


def kick_vod_id(url: str) -> str | None:
    m = re.search(r"kick\.com/[^/]+/videos/([0-9a-fA-F-]{36})", url)
    return m.group(1) if m else None
