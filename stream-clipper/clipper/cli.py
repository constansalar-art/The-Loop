import argparse
import shutil
from pathlib import Path

from . import highlights, media, render
from .util import fmt_ts, load_config, log, parse_ts, read_json, slugify, write_json

ROOT = Path(__file__).resolve().parent.parent


def _workdir(source: str, output: Path) -> Path:
    if media.is_url(source):
        name = media.kick_vod_id(source) or slugify(source.rstrip("/").split("/")[-1])
    else:
        name = slugify(Path(source).stem)
    wd = output / name
    wd.mkdir(parents=True, exist_ok=True)
    return wd


def _video_for(wd: Path) -> Path:
    meta = read_json(wd / "meta.json")
    return Path(meta["video"])


def cmd_run(args, cfg):
    g = cfg["general"]
    if args.clips:
        g["num_clips"] = args.clips
    wd = _workdir(args.source, Path(args.output))
    log(f"Carpeta de trabajo: {wd}")

    if media.is_url(args.source):
        video = media.download_vod(args.source, wd, cfg["render"]["max_height"])
    else:
        video = Path(args.source).resolve()
        if not video.exists():
            raise SystemExit(f"No existe el archivo: {video}")
    info = media.probe(video)
    write_json(wd / "meta.json", {"source": args.source, "video": str(video), **info})
    log(f"Video: {info['width']}x{info['height']}, duración {fmt_ts(info['duration'])}")

    wav = wd / "audio.wav"
    media.extract_audio(video, wav)

    loud_path = wd / "loudness.json"
    if not loud_path.exists():
        log("Analizando volumen...")
        write_json(loud_path, media.loudness_profile(wav))

    tr_path = wd / "transcript.json"
    if not tr_path.exists():
        from .transcribe import transcribe
        transcribe(wav, tr_path, cfg["whisper"], g["language"])

    chat = None
    chat_path = wd / "chat.json"
    vod_id = media.kick_vod_id(args.source) if media.is_url(args.source) else None
    if g["use_chat"] and not args.no_chat and vod_id:
        if not chat_path.exists():
            from .kick_chat import fetch_chat
            fetch_chat(vod_id, info["duration"], chat_path)
    if chat_path.exists() and not args.no_chat:
        chat = read_json(chat_path)["messages"]

    sel_path = wd / "selection.json"
    if args.reselect or not sel_path.exists():
        clips = highlights.select_highlights(
            read_json(tr_path), read_json(loud_path), chat, info["duration"], cfg,
            wd / "prompt.txt", dry_run=args.dry_run,
        )
        if clips is None:
            return
        write_json(sel_path, {"clips": clips})
        log(f"{len(clips)} clips elegidos -> {sel_path}")
    if args.no_render:
        log("Listo. Revisá/editá selection.json y después corré el comando 'render'.")
        return
    _render_all(wd, cfg, only=None, layout=None)


def _render_all(wd: Path, cfg: dict, only: set | None, layout: str | None):
    meta = read_json(wd / "meta.json")
    # la fuente puede ser un archivo o un link (HLS) para no bajar la VOD entera
    video = meta["video"] if media.is_url(meta["video"]) else Path(meta["video"])
    sel_path = wd / "selection.json"
    clips = read_json(sel_path)["clips"]
    words = []
    for seg in read_json(wd / "transcript.json")["segments"]:
        if seg["words"]:
            seg["words"][-1]["eos"] = True  # fin de frase: ahí se puede cortar
        words += seg["words"]
    out_dir = wd / "clips"
    out_dir.mkdir(exist_ok=True)

    for clip in clips:
        if only and clip["id"] not in only:
            continue
        old = clip.get("file")
        if old and (out_dir / old).exists():
            (out_dir / old).unlink()
        render.render_clip(video, meta, clip, words, out_dir, cfg, force_layout=layout)
    write_json(sel_path, {"clips": clips})
    shutil.rmtree(out_dir / "_tmp", ignore_errors=True)

    lines = []
    for c in clips:
        if not c.get("file"):
            continue
        tags = " ".join("#" + h.lstrip("#") for h in c["hashtags"])
        lines.append(
            f"[{c['id']:02d}] {c['file']}  (score {c['score']}/10, VOD {c.get('vod_time', '')}, "
            f"{c.get('rendered_layout', '')})\n"
            f"Título: {c['title']}\nDescripción: {c['caption']} {tags}\n"
            f"Por qué: {c.get('reason', '')}\n"
        )
    (out_dir / "LEEME_clips.txt").write_text("\n".join(lines), encoding="utf-8")
    log(f"Clips listos en {out_dir}  (textos para TikTok en LEEME_clips.txt)")


def cmd_render(args, cfg):
    wd = Path(args.workdir)
    only = {int(x) for x in args.only.split(",")} if args.only else None
    _render_all(wd, cfg, only, args.layout)


def cmd_frame(args, cfg):
    import cv2

    src = Path(args.source)
    if src.is_dir():
        video = _video_for(src)
    elif media.is_url(args.source):
        video = media.download_vod(args.source, _workdir(args.source, Path(args.output)),
                                   cfg["render"]["max_height"])
    else:
        video = src
    out = Path(args.out or f"calibracion_{int(parse_ts(args.at))}.png")
    media.extract_frame(video, parse_ts(args.at), out)
    img = cv2.imread(str(out))
    h, w = img.shape[:2]
    for i in range(1, 20):
        x, y = int(w * i / 20), int(h * i / 20)
        color = (200, 200, 200) if i % 2 else (255, 255, 255)
        cv2.line(img, (x, 0), (x, h), color, 1)
        cv2.line(img, (0, y), (w, y), color, 1)
        if i % 2 == 0:
            cv2.putText(img, f"{i / 20:.1f}", (x + 3, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            cv2.putText(img, f"{i / 20:.1f}", (3, y - 4), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
    for key, color in (("facecam", (0, 220, 0)), ("gameplay", (255, 120, 0))):
        x, y, rw, rh = cfg["layout"][key]
        cv2.rectangle(img, (int(x * w), int(y * h)), (int((x + rw) * w), int((y + rh) * h)), color, 4)
        cv2.putText(img, key, (int(x * w) + 8, int(y * h) + 40), cv2.FONT_HERSHEY_SIMPLEX, 1.1, color, 3)
    cv2.imwrite(str(out), img)
    log(f"Guardado {out}. Verde = facecam, azul = gameplay (según config.toml). "
        "Ajustá los números hasta que los rectángulos encajen.")


def cmd_escena(args, cfg):
    src = Path(args.source)
    video = _video_for(src) if src.is_dir() else src
    folder = Path(cfg["_root"]) / "escenas"
    folder.mkdir(exist_ok=True)
    n = len(list(folder.glob(f"{args.tipo}_*.png"))) + 1
    out = folder / f"{args.tipo}_{n}.png"
    media.extract_frame(video, parse_ts(args.at), out)
    log(f"Guardado {out}. Guardá al menos un ejemplo de cada escena que uses (split y fullcam).")


def main():
    p = argparse.ArgumentParser(prog="clipper", description="VOD -> clips verticales para TikTok")
    p.add_argument("--config", default=str(ROOT / "config.toml"))
    p.add_argument("--output", default=str(ROOT / "output"))
    sub = p.add_subparsers(dest="cmd", required=True)

    r = sub.add_parser("run", help="procesar una VOD completa (link de Kick o archivo local)")
    r.add_argument("source")
    r.add_argument("--clips", type=int, help="cantidad de clips a proponer")
    r.add_argument("--no-chat", action="store_true", help="no usar el chat de Kick")
    r.add_argument("--reselect", action="store_true", help="volver a pedirle los clips a Claude")
    r.add_argument("--no-render", action="store_true", help="solo elegir clips, sin renderizar")
    r.add_argument("--dry-run", action="store_true", help="armar el prompt sin llamar a Claude")

    rd = sub.add_parser("render", help="re-renderizar después de editar selection.json")
    rd.add_argument("workdir")
    rd.add_argument("--only", help="ids separados por coma, ej: 2,5")
    rd.add_argument("--layout", choices=["split", "fullcam"], help="forzar layout")

    f = sub.add_parser("frame", help="sacar un frame con grilla para calibrar facecam/gameplay")
    f.add_argument("source", help="video, link o carpeta de trabajo")
    f.add_argument("--at", default="00:10:00", help="momento del video, ej 01:23:45")
    f.add_argument("--out")

    e = sub.add_parser("escena", help="guardar un ejemplo de escena para detectar el layout solo")
    e.add_argument("source", help="video o carpeta de trabajo")
    e.add_argument("--at", required=True, help="momento donde se ve esa escena, ej 01:40:00")
    e.add_argument("--tipo", required=True, choices=["split", "fullcam"],
                   help="split = facecam + juego, fullcam = cámara completa")

    args = p.parse_args()
    cfg = load_config(Path(args.config))
    {"run": cmd_run, "render": cmd_render, "frame": cmd_frame, "escena": cmd_escena}[args.cmd](args, cfg)
