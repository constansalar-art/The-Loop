#!/usr/bin/env python3
"""Genera versiones para Instagram de una foto: feed 4:5 (natural, cinematic, color-pop rojo) e historia 9:16.

Uso:
  python3 fotos_feed.py FOTO CARPETA_SALIDA [--rotar 90|-90|180] [--x 0.5]
                        [--titulo "TALLER LLENO"] [--sub "4 proyectos en marcha"] [--pie "¿Cuál querés ver terminada?"]
--rotar: grados antihorarios para enderezar la foto (WhatsApp a veces la manda acostada).
--x: dónde centrar el recorte 4:5 en fotos horizontales (0 = izquierda, 1 = derecha).
"""
import argparse, os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont, ImageOps

FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def recorte(im, ratio, xc):
    w, h = im.size
    if w / h > ratio:
        nw = int(h * ratio); x0 = int(min(max(xc * w - nw / 2, 0), w - nw)); return im.crop((x0, 0, x0 + nw, h))
    nh = int(w / ratio); y0 = (h - nh) // 2; return im.crop((0, y0, w, y0 + nh))

def vineta(im, s=0.55):
    w, h = im.size; y, x = np.ogrid[:h, :w]
    d = np.sqrt(((x - w / 2) / (w / 2)) ** 2 + ((y - h / 2) / (h / 2)) ** 2)
    m = np.clip(1 - s * (d - 0.4), 0.35, 1)[..., None]
    return Image.fromarray((np.asarray(im) * m).clip(0, 255).astype('uint8'))

def natural(im):
    im = ImageEnhance.Contrast(im).enhance(1.12); im = ImageEnhance.Color(im).enhance(1.12)
    return im.filter(ImageFilter.UnsharpMask(2, 80, 3))

def cinematic(im):
    a = np.asarray(im).astype(float) / 255
    a = 0.5 + (a - 0.5) * 1.2
    lum = a.mean(2, keepdims=True)
    a = a + np.array([0.0, 0.04, 0.07]) * (1 - lum) + np.array([0.07, 0.03, -0.03]) * lum
    a = lum + (a - lum) * 0.85
    return vineta(Image.fromarray((a.clip(0, 1) * 255).astype('uint8')).filter(ImageFilter.UnsharpMask(2, 90, 3)))

def color_pop_rojo(im):
    hsv = np.asarray(im.convert('HSV')).astype(float)
    h, s = hsv[..., 0], hsv[..., 1]
    hd = np.minimum(h, 255 - h)
    m = np.clip((22 - hd) / 10, 0, 1) * np.clip((s - 90) / 50, 0, 1)
    m = np.asarray(Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.5))).astype(float)[..., None] / 255
    col = np.asarray(ImageEnhance.Color(im).enhance(1.3)).astype(float)
    g = np.asarray(ImageEnhance.Contrast(ImageOps.grayscale(im)).enhance(1.25).convert('RGB')).astype(float)
    return vineta(Image.fromarray((col * m + g * (1 - m)).clip(0, 255).astype('uint8')), 0.45)

def historia(im, titulo, sub, pie):
    W, H = 1080, 1920
    bg = recorte(im, W / H, 0.5).resize((W, H))
    bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(30))).enhance(0.45)
    fg = im.copy(); fg.thumbnail((W, 1300), Image.LANCZOS)
    if fg.width < W: fg = fg.resize((W, int(fg.height * W / fg.width)), Image.LANCZOS)
    y = (H - fg.height) // 2; bg.paste(fg, ((W - fg.width) // 2, y))
    d = ImageDraw.Draw(bg); f1 = ImageFont.truetype(FB, 96); f2 = ImageFont.truetype(FB, 46)
    def c(t, f, yy, fill):
        if t: d.text(((W - d.textlength(t, font=f)) / 2, yy), t, font=f, fill=fill, stroke_width=3, stroke_fill='black')
    c(titulo, f1, max(60, y - 260), 'white'); c(sub, f2, max(180, y - 130), (255, 255, 255)); c(pie, f2, min(H - 140, y + fg.height + 80), 'white')
    return bg

if __name__ == '__main__':
    p = argparse.ArgumentParser()
    p.add_argument('foto'); p.add_argument('salida')
    p.add_argument('--rotar', type=int, default=0); p.add_argument('--x', type=float, default=0.5)
    p.add_argument('--titulo', default=''); p.add_argument('--sub', default=''); p.add_argument('--pie', default='')
    a = p.parse_args(); os.makedirs(a.salida, exist_ok=True)
    im = Image.open(a.foto).convert('RGB')
    if a.rotar: im = im.rotate(a.rotar, expand=True)
    f45 = recorte(im, 4 / 5, a.x).resize((1080, 1350), Image.LANCZOS)
    natural(f45).save(f'{a.salida}/1_feed_natural.jpg', quality=93)
    cinematic(f45).save(f'{a.salida}/2_feed_cinematic.jpg', quality=93)
    color_pop_rojo(f45).save(f'{a.salida}/3_feed_color_pop_rojo.jpg', quality=93)
    historia(natural(im), a.titulo, a.sub, a.pie).save(f'{a.salida}/4_historia.jpg', quality=93)
    print('Listo:', a.salida, '| foto original', im.size)
