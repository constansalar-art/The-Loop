"""Subtítulos estilo TikTok (palabra activa resaltada) + título-gancho, en formato ASS."""
import re

W, H = 1080, 1920


def _ts(t: float) -> str:
    t = max(t, 0)
    cs = int(round(t * 100))
    return f"{cs // 360000}:{cs // 6000 % 60:02d}:{cs // 100 % 60:02d}.{cs % 100:02d}"


def _clean(text: str) -> str:
    return re.sub(r"[{}\\]", "", text)


def _chunks(words: list, size: int) -> list:
    chunks, cur = [], []
    for i, w in enumerate(words):
        cur.append(w)
        nxt = words[i + 1] if i + 1 < len(words) else None
        pause = nxt is not None and nxt["start"] - w["end"] > 0.6
        if len(cur) >= size or pause or w["word"][-1:] in ".?!" or nxt is None:
            chunks.append(cur)
            cur = []
    return chunks


def build_ass(words: list, clip_start: float, clip_end: float, title: str,
              sub_y: int, title_y: int, cfg: dict, title_dur: float | None = None) -> str:
    s = cfg["subtitles"]
    dur = clip_end - clip_start
    header = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,{s['font']},{s['size']},&H00FFFFFF,&H00FFFFFF,&H00000000,&H90000000,-1,0,0,0,100,100,0,0,1,7,3,5,70,70,0,1
Style: Title,{s['title_font']},{s['title_size']},{s['title_color']},&H00000000,{s['title_outline']},&H5A000000,0,0,0,0,100,100,1,0,1,{s['title_outline_width']},7,8,80,80,230,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    events = []
    if title:
        # dura lo mismo que el gancho; si no hay gancho, title_seconds (0 = todo el clip)
        t_end = title_dur or (min(dur, s["title_seconds"]) if s["title_seconds"] else dur)
        text = _clean(title.upper() if s["uppercase"] else title)
        # "pop" de entrada: crece rápido, rebota apenas y queda levemente inclinado
        anim = ("\\fscx40\\fscy40\\t(0,170,\\fscx110\\fscy110)"
                "\\t(170,280,\\fscx100\\fscy100)\\frz-2")
        events.append(f"Dialogue: 1,{_ts(0)},{_ts(t_end)},Title,,0,0,0,,"
                      f"{{\\an8\\pos({W // 2},{title_y}){anim}}}{text}")

    inside = [w for w in words if w["end"] > clip_start and w["start"] < clip_end]
    chunks = _chunks(inside, s["words_per_chunk"])
    for ci, chunk in enumerate(chunks):
        chunk_end = chunk[-1]["end"] + 0.3
        if ci + 1 < len(chunks):
            chunk_end = min(chunk_end, chunks[ci + 1][0]["start"])
        tokens = [_clean(w["word"].upper() if s["uppercase"] else w["word"]) for w in chunk]
        for wi, w in enumerate(chunk):
            start = w["start"]
            end = chunk[wi + 1]["start"] if wi + 1 < len(chunk) else chunk_end
            start, end = max(start, clip_start) - clip_start, min(end, clip_end) - clip_start
            if end - start < 0.04:
                continue
            parts = [
                "{\\c&H00E5FF&\\fscx112\\fscy112}" + t + "{\\c&HFFFFFF&\\fscx100\\fscy100}"
                if j == wi else t
                for j, t in enumerate(tokens)
            ]
            events.append(f"Dialogue: 0,{_ts(start)},{_ts(end)},Sub,,0,0,0,,"
                          f"{{\\pos({W // 2},{sub_y})}}" + " ".join(parts))
    return header + "\n".join(events) + "\n"
