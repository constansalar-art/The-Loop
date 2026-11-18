#!/usr/bin/env python3
"""Arma un reel vertical 1080x1920 (sin audio) a partir de UNA foto, con efectos:
zoom out + titular -> barrido -> acercamiento -> rotulador (círculo dibujado + etiqueta) -> comentario.

Uso: python3 reel_desde_foto.py config.json salida.mp4

config.json (coordenadas en píxeles de la foto YA rotada; mirala antes para elegirlas):
{
  "foto": "foto.jpg", "rotar": 90,
  "titulo": "TALLER LLENO", "subtitulo": "4 proyectos en marcha",
  "zoom_desde": [260, 650],        // detalle donde arranca el zoom out
  "plano_1_x": 380,                 // centro horizontal del primer plano vertical
  "plano_2_x": 1290,                // a dónde llega el barrido
  "acercar_a": [1350, 570],         // centro del acercamiento final
  "circulo": [1320, 640, 400, 300], // centro x,y (foto) y radios x,y (px de salida)
  "etiqueta": "SNORKEL + PARAGOLPES",
  "comentario_usuario": "Responde a @cliente",
  "comentario": ["¿Le hacen snorkel", "a la Hilux?"]
}
Cualquier clave de efecto puede omitirse ("etiqueta": "", "comentario": []) para saltear ese efecto.
"""
import sys, json, math, subprocess
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; FR = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
W, H, FPS = 1080, 1920, 30
cfg = json.load(open(sys.argv[1])); out = sys.argv[2]
src = Image.open(cfg['foto']).convert('RGB')
if cfg.get('rotar'): src = src.rotate(cfg['rotar'], expand=True)
src = ImageEnhance.Color(ImageEnhance.Contrast(src).enhance(1.1)).enhance(1.12)
SW, SH = src.size
FULL = min(SH, SW * 16 / 9)  # alto máximo de un recorte 9:16

def view(cx, cy, h):
    w = h * 9 / 16; cx = min(max(cx, w / 2), SW - w / 2); cy = min(max(cy, h / 2), SH - h / 2)
    return src.resize((W, H), Image.BICUBIC, box=(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2)), (cx - w / 2, cy - h / 2, W / w)

ease = lambda t: 1 - (1 - t) ** 3

def titular(im, t, txt, sub, y=230):
    d = ImageDraw.Draw(im); f = ImageFont.truetype(FB, 110); f2 = ImageFont.truetype(FB, 52)
    off = int((1 - ease(min(1, t * 3))) * 60)
    w = d.textlength(txt, font=f); x = (W - w) / 2
    d.rectangle((x - 30, y - 20 + off, x + w + 30, y + 125 + off), fill=(0x32, 0x32, 0x48))
    d.text((x, y + off), txt, font=f, fill='white')
    if sub:
        d.text(((W - d.textlength(sub, font=f2)) / 2, y + 160 + off), sub, font=f2, fill='white', stroke_width=4, stroke_fill=(0x11, 0x11, 0x11))

frames = []
zx, zy = cfg.get('zoom_desde', [SW / 2, SH / 2]); p1 = cfg.get('plano_1_x', SW / 2); p2 = cfg.get('plano_2_x', p1)
# 1) Zoom out + titular
for i in range(72):
    t = i / 71; k = ease(t)
    im, _ = view(zx + (p1 - zx) * k, zy + (SH / 2 - zy) * k, FULL * 0.37 + FULL * 0.63 * k)
    if cfg.get('titulo') and t > 0.45: titular(im, t - 0.45, cfg['titulo'], cfg.get('subtitulo', ''))
    frames.append(im)
# 2) Barrido (paneo con desenfoque de movimiento)
if p2 != p1:
    for i in range(15):
        t = i / 14; k = t * t * (3 - 2 * t); cx = p1 + (p2 - p1) * k
        sub = [np.asarray(view(cx + dx, SH / 2, FULL)[0], float) for dx in np.linspace(-140, 140, 31) * math.sin(math.pi * t)]
        frames.append(Image.fromarray(np.mean(sub, 0).astype('uint8')))
# 3) Acercamiento
ax, ay = cfg.get('acercar_a', [p2, SH / 2])
for i in range(45):
    t = ease(i / 44)
    frames.append(view(p2 + (ax - p2) * t, SH / 2 + (ay - SH / 2) * t, FULL - FULL * 0.2 * t)[0])
last, (x0, y0, sc) = view(ax, ay, FULL * 0.8)
# 4) Rotulador + 5) Comentario
circ = cfg.get('circulo'); com = cfg.get('comentario', [])
n = 54 if circ else 1
for i in range(n + (60 if com else 30)):
    im = last.copy(); d = ImageDraw.Draw(im)
    if circ:
        t = min(1, i / (n - 12)); cx, cy, rx, ry = (circ[0] - x0) * sc, (circ[1] - y0) * sc, circ[2], circ[3]
        pts = [(cx + rx * math.cos(a) + 6 * math.sin(a * 7), cy + ry * math.sin(a)) for a in np.linspace(-2.2, -2.2 + 2 * math.pi * 1.08 * t, 120)]
        d.line(pts, fill=(255, 255, 255), width=16, joint='curve')
        if t >= 1 and cfg.get('etiqueta'):
            f = ImageFont.truetype(FB, 64); e = cfg['etiqueta']
            d.text(((W - d.textlength(e, font=f)) / 2, min(H - 120, cy + ry + 40)), e, font=f, fill=(255, 255, 255), stroke_width=6, stroke_fill=(0x11, 0x11, 0x11))
    if com and i >= n:
        s = ease(min(1, (i - n) / 8)); bh0 = 120 + 65 * len(com); bw, bh = int(860 * s), int(bh0 * s)
        if bw > 20:
            b = Image.new('RGBA', (860, bh0), (0, 0, 0, 0)); bd = ImageDraw.Draw(b)
            bd.rounded_rectangle((0, 0, 859, bh0 - 1), 36, fill=(255, 255, 255, 245))
            bd.ellipse((30, 30, 110, 110), fill=(0x32, 0x32, 0x48))
            bd.text((130, 32), cfg.get('comentario_usuario', 'Responde a @cliente'), font=ImageFont.truetype(FR, 36), fill=(110, 110, 110))
            for j, l in enumerate(com): bd.text((130, 85 + 65 * j), l, font=ImageFont.truetype(FB, 50), fill='black')
            b = b.resize((bw, bh)); im.paste(b, ((W - bw) // 2, 230 + (bh0 - bh) // 2), b)
    frames.append(im)

p = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
for f in frames: p.stdin.write(f.tobytes())
p.stdin.close(); p.wait(); print(f'{out}: {len(frames) / FPS:.1f} s (sin audio)')
