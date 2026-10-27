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


SECTION_PAD = 2.0  # margen que se baja de más a cada lado; el render lo recorta


def _streams(path: Path) -> dict:
    """{"video": (inicio, duración), "audio": (inicio, duración)} dentro del archivo."""
    out = run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,start_time,duration",
               "-of", "json", path])
    info = {}
    for st in json.loads(out).get("streams", []):
        try:
            info[st["codec_type"]] = (float(st.get("start_time", 0)), float(st.get("duration", 0)))
        except (TypeError, ValueError):
            continue
    return info


def _audio_16k(path: Path, seconds: float) -> np.ndarray:
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-t", f"{seconds:.2f}", "-vn",
                          "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32)


def _section_start(part: Path, guess: float, vod_wav: Path) -> float:
    """En qué segundo de la VOD arranca realmente el archivo: correlación de audio contra el
    audio completo de la VOD (yt-dlp no siempre corta exactamente donde se le pide)."""
    x = _audio_16k(part, 6.0)
    with wave.open(str(vod_wav), "rb") as w:
        sr = w.getframerate()
        t0 = max(0.0, guess - 8.0)
        w.setpos(int(t0 * sr))
        y = np.frombuffer(w.readframes(int(22 * sr)), dtype=np.int16).astype(np.float32)
    if len(x) < sr or len(y) < len(x):
        return guess
    n = 1 << (len(y) + len(x)).bit_length()
    corr = np.fft.irfft(np.fft.rfft(y, n) * np.conj(np.fft.rfft(x, n)), n)[: len(y) - len(x) + 1]
    return t0 + int(np.argmax(corr)) / sr


def fetch_section(page_url: str, start: float, end: float, cache_dir: Path, max_height: int,
                  vod_wav: Path | None = None) -> tuple[Path, float]:
    """Baja solo un tramo de la VOD y devuelve (archivo, segundo de la VOD donde arranca).

    Leer el HLS directo con ffmpeg -ss no es preciso: arranca en el segmento anterior y
    desfasa los subtítulos. Esto baja el tramo con margen y, si está el audio completo de la
    VOD, mide el inicio real por correlación de audio. yt-dlp a veces entrega el audio
    empezando más tarde que el video: si al tramo le falta video o audio, reintenta con más
    margen."""
    cache_dir.mkdir(parents=True, exist_ok=True)
    for pad in (SECTION_PAD, SECTION_PAD + 4, SECTION_PAD + 10):
        a, b = max(0.0, start - pad), end + pad
        out = cache_dir / f"{a:.2f}_{b:.2f}.mp4"
        if not out.exists():
            tmp = cache_dir / f"{a:.2f}_{b:.2f}.part"
            run([sys.executable, "-m", "yt_dlp", "-q", "--no-warnings",
                 "-f", f"bv*[height<={max_height}]+ba/b[height<={max_height}]/b",
                 "--download-sections", f"*{a:.2f}-{b:.2f}", "--force-keyframes-at-cuts",
                 "--merge-output-format", "mp4", "-o", f"{tmp}.%(ext)s", page_url])
            Path(f"{tmp}.mp4").replace(out)
        st = _streams(out)
        if "audio" not in st or "video" not in st:
            log(f"  el tramo {a:.1f}-{b:.1f} vino sin audio, reintento con más margen")
            continue
        a_start, a_dur = st["audio"]
        v_start, v_dur = st["video"]
        # inicio real del archivo en la VOD: el audio se ubica por correlación
        real = a
        if vod_wav and vod_wav.exists():
            real = _section_start(out, a + a_start, vod_wav) - a_start
        covers = (real + max(a_start, v_start) <= start + 0.05
                  and real + min(a_start + a_dur, v_start + v_dur) >= end - 0.05)
        if covers:
            return out, real
        log(f"  el tramo {a:.1f}-{b:.1f} no cubre todo el audio/video, reintento con más margen")
    raise SystemExit(f"No se pudo bajar bien el tramo {start:.1f}-{end:.1f}")
