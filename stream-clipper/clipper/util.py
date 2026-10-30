import json
import re
import subprocess
import sys
import tomllib
import unicodedata
from pathlib import Path

DEFAULTS = {
    "general": {
        "channel_context": "",
        "language": "es",
        "num_clips": 10,
        "min_clip_seconds": 15,
        "max_clip_seconds": 30,
        "use_chat": False,
    },
    "whisper": {"model": "auto", "device": "auto"},
    "claude": {"model": "claude-opus-5-5", "effort": "high"},
    "layout": {
        "mode": "auto",
        "facecam": [0.72, 0.62, 0.28, 0.38],
        "gameplay": [0.18, 0.0, 0.54, 1.0],
        "facecam_height": 0.38,
        "gameplay_fit": "cover",
        "fullcam_face_min_height": 0.16,
    },
    "subtitles": {
        "font": "Arial Black",
        "size": 82,
        "words_per_chunk": 3,
        "uppercase": True,
        "title_seconds": 3,
        "title_size": 96,
        "title_font": "Luckiest Guy",
        "title_color": "&H00000000",
        "title_outline": "&H0000D7FF",
        "title_outline_width": 12,
    },
    "censor": {"enabled": True, "audio": "beep"},
    "brand": {"enabled": True, "text": "kick.com/dramacer0", "color": "#53FC18",
              "icon": "assets/kick-icon.png", "font_file": "Anton.ttf", "height": 64,
              "stroke": 3, "band_height": 96, "band_color": "0x0b0b0b"},
    "render": {"encoder": "libx264", "crf": 20, "max_height": 1080, "cut_silences": 2.5},
    "style": {"mode": "classic"},
}


def load_config(path: Path) -> dict:
    cfg = {k: dict(v) for k, v in DEFAULTS.items()}
    if path.exists():
        with open(path, "rb") as f:
            user = tomllib.load(f)
        for section, values in user.items():
            cfg.setdefault(section, {}).update(values)
    cfg["_root"] = str(path.resolve().parent)
    return cfg


def log(msg: str) -> None:
    print(f"» {msg}", flush=True)


def run(cmd: list, cwd: Path | None = None) -> str:
    proc = subprocess.run(
        [str(c) for c in cmd], cwd=cwd, capture_output=True, text=True,
        encoding="utf-8", errors="replace",
    )
    if proc.returncode != 0:
        tail = "\n".join(proc.stderr.strip().splitlines()[-25:])
        sys.exit(f"Falló el comando: {' '.join(map(str, cmd[:3]))} ...\n{tail}")
    return proc.stdout


def fmt_ts(seconds: float) -> str:
    s = int(seconds)
    return f"{s // 3600:02d}:{s % 3600 // 60:02d}:{s % 60:02d}"


def parse_ts(value: str) -> float:
    parts = [float(p) for p in value.split(":")]
    total = 0.0
    for p in parts:
        total = total * 60 + p
    return total


def slugify(text: str, max_len: int = 40) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text[:max_len].strip("-") or "clip"


def read_json(path: Path):
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
