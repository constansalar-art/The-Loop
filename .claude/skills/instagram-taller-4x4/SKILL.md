---
name: instagram-taller-4x4
description: Contenido de Instagram para WILD4X4 (equipamiento off road, Tigre) siguiendo su Manual de Marca, o para cualquier taller 4x4. Usar cuando el usuario manda fotos o videos del taller y pide ideas para Instagram, copys, hashtags, editar fotos (enderezar, recortar 4:5, filtros cinematic / color pop rojo, historias 9:16) o armar un reel con efectos (zoom out, titulares, barrido, rotulador, comentario, antes y después, vértigo, clones, órbita, fuera de marco, croma, pegatina, letras 3D).
---

# Instagram para taller 4x4

Tono: crítico y realista, en español rioplatense (voseo). Decir siempre qué NO se puede hacer con el material recibido.

## Marca WILD4X4 (obligatorio para piezas de Wild)

Manual oficial: `references/Manual_de_Marca_WILD4X4_v1_1.pdf`. Resumen operativo: `references/marca-wild4x4.md` (leerlo antes de producir).

- Colores: solo **azul `#323248`**, **blanco** y **grafito `#111111`**. Nada de rojo ni amarillo.
- Tipografía: **Barlow Condensed** en títulos, **Inter** en textos (`assets/fonts/`).
- Logo: `assets/wild_logo_blanco.png` (sobre oscuro/foto) o `assets/wild_logo_azul.png` (sobre claro). Visible, no invasivo, sin efectos.
- Foto real protagonista. Sin viñetas, color pop ni efectos "futuristas".
- Voz directa y técnica, sin épica ni promesas no verificadas.
- Pasar el checklist del manual antes de entregar.

Pieza base aprobada: `scripts/historia_marca.py` (historia 9:16 con fondo azul, logo, titular Barlow, barra blanca con texto azul, foto, pregunta en Inter y @WILD4X4.COM.AR).
```bash
python3 scripts/historia_marca.py foto.jpg historia.jpg --rotar 90 --titulo "TALLER LLENO" --sub "4 proyectos en marcha" --pie "¿Cuál querés ver terminada?"
```

## Flujo

1. **Mirar la foto antes de todo.** Las fotos de WhatsApp suelen llegar acostadas y comprimidas (≈1600×900). Rotarla y verla (`Image.rotate(90, expand=True)` = antihorario) antes de elegir coordenadas.
2. **Diagnóstico honesto:** qué muestra, qué le falta (protagonista claro, personas, el "después"), y la calidad (si está comprimida, pedir el original).
3. **Ideas de post:** ver `references/ideas-y-copys.md` (carrusel, antes/después, serie por vehículo, copys, hashtags, consejos de constancia).
4. **Fotos editadas:** `scripts/fotos_feed.py` → feed 4:5 natural / cinematic / color pop rojo + historia 9:16 con textos. Para Wild usar solo la **natural**: cinematic y color pop violan el manual.
   ```bash
   python3 scripts/fotos_feed.py foto.jpg salida/ --rotar 90 --x 0.4 --titulo "TALLER LLENO" --sub "4 proyectos en marcha" --pie "¿Cuál querés ver terminada?"
   ```
5. **Reel desde una foto:** copiar `scripts/ejemplo_config.json`, ajustar coordenadas mirando la foto rotada, y:
   ```bash
   python3 scripts/reel_desde_foto.py config.json reel.mp4
   ```
   Siempre extraer 4-6 cuadros con ffmpeg (`-ss T -frames:v 1`), armar una hoja de contacto y **revisarla** antes de entregar (círculo bien centrado, textos legibles, sin parches raros).
6. **Entregar** con SendUserFile y una lista corta de lo que hay que corregir (audio, textos inventados, calidad).

## Efectos

Tabla completa (qué es, idea para el taller y si sale con una foto o necesita video): `references/efectos.md`.

Resumen: con UNA foto salen **zoom out, titulares, barrido, rotulador (fijo), comentario, pegatina**. Necesitan video: **antes y después** (o dos fotos), **vértigo, clones, órbita, croma, rotulador con seguimiento**. **Fuera de marco y letras 3D** requieren recortar el vehículo: mejor en Edits/CapCut.

## Reglas

- No inventar el trabajo realizado: si se pone una etiqueta tipo "SNORKEL + PARAGOLPES", avisar que hay que confirmarla.
- No intentar el vértigo con una foto plana: queda un parche falso. Reemplazar por acercamiento.
- Los reels salen sin audio: recordar ponerle un audio en tendencia desde Instagram.
- Patentes reales de clientes: taparlas o pedir permiso antes de publicar.
- No publicar nada con nombre/marca de un negocio ajeno sin autorización.
- Requiere: Python 3 con Pillow y numpy, ffmpeg. Fuentes de marca en `assets/fonts/` (si faltan: `npm pack @fontsource/barlow-condensed @fontsource/inter`).
