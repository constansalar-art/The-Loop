"""Cartel del canal (logo + dirección) que va en todos los clips."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent


def make_badge(cfg: dict, out_png: Path) -> tuple[int, int]:
    """Dibuja el cartel en un PNG transparente y devuelve su tamaño (ancho, alto)."""
    b = cfg["brand"]
    height = b["height"]
    font = ImageFont.truetype(str(ROOT / "fonts" / b["font_file"]), int(height * 0.78))
    text = b["text"]
    left, top, right, bottom = font.getbbox(text, stroke_width=b["stroke"])
    icon = Image.open(ROOT / b["icon"]).convert("RGBA").resize((height, height), Image.LANCZOS)
    # esquinas redondeadas para el ícono
    mask = Image.new("L", icon.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, height - 1, height - 1), radius=height // 5, fill=255)
    icon.putalpha(mask)

    gap = height // 4
    width = height + gap + (right - left)
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    img.paste(icon, (0, 0), icon)
    text_y = (height - (bottom - top)) // 2 - top
    ImageDraw.Draw(img).text((height + gap - left, text_y), text, font=font, fill=b["color"],
                             stroke_width=b["stroke"], stroke_fill="#000000")
    img.save(out_png)
    return width, height
