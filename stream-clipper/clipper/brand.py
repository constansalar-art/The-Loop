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
    pad = height // 3 if b.get("pill") else 0  # pastilla oscura detrás (estilo TikTok)
    width = height + gap + (right - left) + 2 * pad
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    if pad:
        ImageDraw.Draw(img).rounded_rectangle((0, 0, width - 1, height - 1), radius=height // 2,
                                              fill=(0, 0, 0, 170))
        icon = icon.resize((int(height * 0.7),) * 2, Image.LANCZOS)
        img.paste(icon, (pad, (height - icon.height) // 2), icon)
    else:
        img.paste(icon, (0, 0), icon)
    text_y = (height - (bottom - top)) // 2 - top
    ImageDraw.Draw(img).text((pad + height + gap - left, text_y), text, font=font, fill=b["color"],
                             stroke_width=0 if pad else b["stroke"], stroke_fill="#000000")
    img.save(out_png)
    return width, height
