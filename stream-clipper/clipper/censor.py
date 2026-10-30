"""Censura de malas palabras: pitido en el audio y la palabra tapada en los subtítulos."""
import re
import unicodedata

# Raíces que se comparan contra cada palabra entera (sin tildes ni puntuación).
DEFAULT_WORDS = [
    r"put[oa]s?", r"putit[oa]s?", r"mierdas?", r"conchas?", r"pij[ao]s?", r"vergas?",
    r"forr[oa]s?", r"pelotud[oa]s?", r"bolud[oa]s?", r"culiad[oa]s?", r"carajo",
    r"ort[oa]", r"cag(o|a|ar|ue|aste|ado|ada|on|ona)", r"pajer[oa]s?", r"chot[ao]s?",
    r"fuck\w*", r"shit", r"bitch\w*", r"mogolic[oa]s?", r"pendej[oa]s?",
]


def _norm(word: str) -> str:
    word = unicodedata.normalize("NFKD", word).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]", "", word)


class Censor:
    def __init__(self, cfg: dict):
        c = cfg.get("censor", {})
        self.enabled = c.get("enabled", True)
        words = c.get("words") or DEFAULT_WORDS
        self.pattern = re.compile(r"^(" + "|".join(words) + r")$")
        self.mode = c.get("audio", "beep")  # beep | mute

    def is_bad(self, word: str) -> bool:
        # Whisper a veces ya escribe las malas palabras con asteriscos ("p***o")
        return self.enabled and ("*" in word or bool(self.pattern.match(_norm(word))))

    def mask(self, word: str) -> str:
        """'mierda,' -> 'M*****,' (respeta la puntuación de alrededor)."""
        if "*" in word:
            return word
        m = re.match(r"^(\W*)(\w)(\w*)(\W*)$", word)
        if not m:
            return "*" * len(word)
        pre, first, rest, post = m.groups()
        return f"{pre}{first}{'*' * len(rest)}{post}"

    def intervals(self, words: list) -> list[tuple[float, float]]:
        """Tramos (en la línea de tiempo del clip) a tapar con pitido."""
        out = []
        for w in words:
            if self.is_bad(w["word"]):
                a, b = max(w["start"] - 0.06, 0), w["end"] + 0.06
                if out and a <= out[-1][1]:
                    out[-1] = (out[-1][0], b)
                else:
                    out.append((a, b))
        return out


def audio_filter(intervals: list, mode: str, src: str, out: str) -> str:
    """Filtro ffmpeg que silencia esos tramos y (en modo beep) pone un pitido encima."""
    if not intervals:
        return f"[{src}]anull[{out}]"
    cond = "+".join(f"between(t,{a:.3f},{b:.3f})" for a, b in intervals)
    graph = f"[{src}]volume=volume='if({cond},0,1)':eval=frame[{out}m]"
    if mode == "mute":
        return graph.replace(f"[{out}m]", f"[{out}]")
    end = intervals[-1][1] + 0.1
    graph += (f";sine=f=1000:sample_rate=48000:duration={end:.3f},"
              f"volume=volume='if({cond},0.25,0)':eval=frame[{out}b]"
              f";[{out}m][{out}b]amix=inputs=2:duration=first:normalize=0[{out}]")
    return graph
