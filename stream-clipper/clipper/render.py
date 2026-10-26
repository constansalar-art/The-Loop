"""Detección de layout (facecam+juego vs full cam) y render vertical 1080x1920 con ffmpeg."""
from pathlib import Path

from .subtitles import H, W, build_ass
from .util import log, run, slugify


def _even(v: float) -> int:
    return int(v) // 2 * 2


def _rect_px(rect: list, vw: int, vh: int) -> tuple[int, int, int, int]:
    x, y, w, h = rect
    pw, ph = _even(w * vw), _even(h * vh)
    px = min(_even(x * vw), vw - pw)
    py = min(_even(y * vh), vh - ph)
    return pw, ph, max(px, 0), max(py, 0)


def detect_layout(video: Path, start: float, end: float, cfg: dict) -> tuple[str, float]:
    """Mira unos frames del clip: si hay una cara grande es full cam. Devuelve (modo, centro_x)."""
    import cv2

    cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    cap = cv2.VideoCapture(str(video))
    threshold = cfg["layout"]["fullcam_face_min_height"]
    big, centers, samples = 0, [], 6
    for i in range(samples):
        t = start + (end - start) * (i + 0.5) / samples
        cap.set(cv2.CAP_PROP_POS_MSEC, t * 1000)
        ok, frame = cap.read()
        if not ok:
            continue
        fh, fw = frame.shape[:2]
        scale = 640 / fw
        gray = cv2.cvtColor(cv2.resize(frame, None, fx=scale, fy=scale), cv2.COLOR_BGR2GRAY)
        faces = cascade.detectMultiScale(gray, 1.1, 6, minSize=(30, 30))
        if len(faces):
            x, y, w, h = max(faces, key=lambda f: f[3])
            if h / gray.shape[0] >= threshold:
                big += 1
                centers.append((x + w / 2) / gray.shape[1])
    cap.release()
    if big >= samples // 2:
        centers.sort()
        return "fullcam", centers[len(centers) // 2]
    return "split", 0.5


def _filter_split(vw: int, vh: int, cfg: dict) -> tuple[str, int]:
    lay = cfg["layout"]
    top = _even(H * lay["facecam_height"])
    bot = H - top
    cw, ch, cx, cy = _rect_px(lay["facecam"], vw, vh)
    gw, gh, gx, gy = _rect_px(lay["gameplay"], vw, vh)
    cam = (f"[0:v]crop={cw}:{ch}:{cx}:{cy},scale={W}:{top}:force_original_aspect_ratio=increase,"
           f"crop={W}:{top},setsar=1[cam]")
    if lay["gameplay_fit"] == "fit":
        game = (f"[0:v]crop={gw}:{gh}:{gx}:{gy},split[g1][g2];"
                f"[g1]scale={W}:{bot}:force_original_aspect_ratio=increase,crop={W}:{bot},"
                f"boxblur=25:3[bg];[g2]scale={W}:{bot}:force_original_aspect_ratio=decrease[fg];"
                f"[bg][fg]overlay=(W-w)/2:(H-h)/2,setsar=1[game]")
    else:
        game = (f"[0:v]crop={gw}:{gh}:{gx}:{gy},scale={W}:{bot}:force_original_aspect_ratio=increase,"
                f"crop={W}:{bot},setsar=1[game]")
    return f"{cam};{game};[cam][game]vstack=inputs=2[base]", top


def _filter_fullcam(vw: int, vh: int, center_x: float) -> str:
    cw = min(_even(vh * 9 / 16), _even(vw))
    cx = min(max(_even(center_x * vw - cw / 2), 0), vw - cw)
    return f"[0:v]crop={cw}:{vh}:{cx}:0,scale={W}:{H},setsar=1[base]"


def render_clip(video: Path, info: dict, clip: dict, words: list, out_dir: Path,
                cfg: dict, force_layout: str | None = None) -> Path:
    start, end = clip["start"], clip["end"]
    mode = force_layout or (clip.get("layout") if clip.get("layout") in ("split", "fullcam") else None)
    if not mode and cfg["layout"]["mode"] in ("split", "fullcam"):
        mode = cfg["layout"]["mode"]
    center = 0.5
    if mode != "split":
        detected, center = detect_layout(video, start, end, cfg)
        mode = mode or detected

    vw, vh = info["width"], info["height"]
    if mode == "fullcam":
        graph = _filter_fullcam(vw, vh, center)
        sub_y, title_y = int(H * 0.66), 230
    else:
        graph, top = _filter_split(vw, vh, cfg)
        # subtítulos en la unión cam/juego, título debajo para no tapar la cara
        sub_y, title_y = top, top + 130

    tmp = out_dir / "_tmp"
    tmp.mkdir(exist_ok=True)
    ass_name = f"clip_{clip['id']:02d}.ass"
    (tmp / ass_name).write_text(build_ass(words, start, end, clip["title"], sub_y, title_y, cfg),
                                encoding="utf-8")
    graph += f";[base]ass={ass_name}[v]"

    out = out_dir / f"{clip['id']:02d}_{slugify(clip['title'])}.mp4"
    r = cfg["render"]
    if r["encoder"] == "h264_nvenc":
        venc = ["-c:v", "h264_nvenc", "-preset", "p5", "-cq", str(r["crf"] + 1), "-b:v", "0"]
    else:
        venc = ["-c:v", "libx264", "-preset", "medium", "-crf", str(r["crf"])]
    log(f"Renderizando clip {clip['id']} ({mode}): {clip['title']}")
    # cwd = carpeta temporal para pasarle a 'ass' un nombre sin ruta (evita problemas con C:\ en Windows)
    run(["ffmpeg", "-y", "-v", "error", "-ss", f"{start:.3f}", "-i", video.resolve(),
         "-t", f"{end - start:.3f}", "-filter_complex", graph, "-map", "[v]", "-map", "0:a:0?",
         *venc, "-pix_fmt", "yuv420p", "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
         "-c:a", "aac", "-b:a", "160k", "-ar", "48000", "-movflags", "+faststart",
         out.resolve()], cwd=tmp)
    clip["file"] = out.name
    clip["rendered_layout"] = mode
    return out
