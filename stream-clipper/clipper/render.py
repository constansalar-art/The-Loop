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


def _filter_split(vw: int, vh: int, cfg: dict, src: str, out: str) -> tuple[str, int]:
    lay = cfg["layout"]
    top = _even(H * lay["facecam_height"])
    bot = H - top
    cw, ch, cx, cy = _rect_px(lay["facecam"], vw, vh)
    gw, gh, gx, gy = _rect_px(lay["gameplay"], vw, vh)
    n = out  # sufijo para que las etiquetas no choquen entre segmentos
    cam = (f"[{src}]split[s{n}a][s{n}b];[s{n}a]crop={cw}:{ch}:{cx}:{cy},"
           f"scale={W}:{top}:force_original_aspect_ratio=increase,crop={W}:{top},setsar=1[cam{n}]")
    if lay["gameplay_fit"] == "fit":
        game = (f"[s{n}b]crop={gw}:{gh}:{gx}:{gy},split[g1{n}][g2{n}];"
                f"[g1{n}]scale={W}:{bot}:force_original_aspect_ratio=increase,crop={W}:{bot},"
                f"boxblur=25:3[bg{n}];[g2{n}]scale={W}:{bot}:force_original_aspect_ratio=decrease[fg{n}];"
                f"[bg{n}][fg{n}]overlay=(W-w)/2:(H-h)/2,setsar=1[game{n}]")
    else:
        game = (f"[s{n}b]crop={gw}:{gh}:{gx}:{gy},scale={W}:{bot}:force_original_aspect_ratio=increase,"
                f"crop={W}:{bot},setsar=1[game{n}]")
    return f"{cam};{game};[cam{n}][game{n}]vstack=inputs=2[{out}]", top


def _filter_fullcam(vw: int, vh: int, center_x: float, src: str, out: str) -> str:
    cw = min(_even(vh * 9 / 16), _even(vw))
    cx = min(max(_even(center_x * vw - cw / 2), 0), vw - cw)
    return f"[{src}]crop={cw}:{vh}:{cx}:0,scale={W}:{H},setsar=1[{out}]"


def clip_segments(clip: dict, words: list, max_gap: float) -> list[tuple[float, float]]:
    """Gancho (cold open) primero, si hay, y después el momento, sin silencios largos."""
    segs = []
    hs, he = clip.get("hook_start"), clip.get("hook_end")
    if hs is not None and he is not None and he - hs >= 0.5:
        segs.append((hs, he))
    start, end = clip["start"], clip["end"]
    inside = [w for w in words if w["end"] > start and w["start"] < end]
    if not max_gap or len(inside) < 2:
        return segs + [(start, end)]
    # jump cuts: cortamos los huecos sin habla más largos que max_gap
    cur = start
    for prev, nxt in zip(inside, inside[1:]):
        if nxt["start"] - prev["end"] > max_gap:
            segs.append((cur, prev["end"] + 0.3))
            cur = nxt["start"] - 0.2
    segs.append((cur, end))
    return segs


def remap_words(words: list, segs: list) -> list:
    """Pasa las palabras de cada segmento a la línea de tiempo del clip final."""
    out, offset = [], 0.0
    for s, e in segs:
        for w in words:
            if w["end"] > s and w["start"] < e:
                out.append({"word": w["word"],
                            "start": max(w["start"], s) - s + offset,
                            "end": min(w["end"], e) - s + offset})
        offset += e - s
    return out


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

    segs = clip_segments(clip, words, clip.get("cut_silences", cfg["render"].get("cut_silences", 0)))
    total = sum(e - s for s, e in segs)
    vw, vh = info["width"], info["height"]
    parts, inputs = [], []
    for i, (s, e) in enumerate(segs):
        inputs += ["-ss", f"{s:.3f}", "-t", f"{e - s:.3f}", "-i", video.resolve()]
        if mode == "fullcam":
            g = _filter_fullcam(vw, vh, center, f"{i}:v", f"v{i}")
            sub_y, title_y = int(H * 0.66), 230
        else:
            g, top = _filter_split(vw, vh, cfg, f"{i}:v", f"v{i}")
            # subtítulos en la unión cam/juego, título debajo para no tapar la cara
            sub_y, title_y = top, top + 130
        # mismo fps en todos los segmentos para que concat no falle
        parts.append(g + f";[v{i}]fps=30[v{i}f]")
    concat_in = "".join(f"[v{i}f][{i}:a]" for i in range(len(segs)))
    graph = ";".join(parts) + f";{concat_in}concat=n={len(segs)}:v=1:a=1[base][acat]"

    tmp = out_dir / "_tmp"
    tmp.mkdir(exist_ok=True)
    ass_name = f"clip_{clip['id']:02d}.ass"
    ass = build_ass(remap_words(words, segs), 0.0, total, clip["title"], sub_y, title_y, cfg)
    (tmp / ass_name).write_text(ass, encoding="utf-8")
    graph += f";[base]ass={ass_name}[v];[acat]loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[a]"

    out = out_dir / f"{clip['id']:02d}_{slugify(clip['title'])}.mp4"
    r = cfg["render"]
    if r["encoder"] == "h264_nvenc":
        venc = ["-c:v", "h264_nvenc", "-preset", "p5", "-cq", str(r["crf"] + 1), "-b:v", "0"]
    else:
        venc = ["-c:v", "libx264", "-preset", "medium", "-crf", str(r["crf"])]
    log(f"Renderizando clip {clip['id']} ({mode}, {total:.0f} s): {clip['title']}")
    # cwd = carpeta temporal para pasarle a 'ass' un nombre sin ruta (evita problemas con C:\ en Windows)
    run(["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", graph,
         "-map", "[v]", "-map", "[a]", *venc, "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-movflags", "+faststart", out.resolve()], cwd=tmp)
    clip["file"] = out.name
    clip["rendered_layout"] = mode
    return out
