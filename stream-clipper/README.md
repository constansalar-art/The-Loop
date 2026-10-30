# stream-clipper

Le pasás una VOD (link de Kick o archivo grabado con OBS) y te devuelve **clips verticales
1080x1920 listos para TikTok**: con facecam arriba y juego abajo (o full cam en just chatting),
subtítulos grandes con la palabra activa resaltada, un título-gancho al inicio y el audio
normalizado. Además genera un `LEEME_clips.txt` con título, descripción y hashtags de cada clip.

## Cómo funciona

1. **Descarga** la VOD con yt-dlp (o usa tu archivo local).
2. **Transcribe** el audio con Whisper (en tu PC, gratis).
3. **Señales**: picos de volumen (gritos/festejos) y, si se puede, velocidad del chat de Kick.
4. **Claude** lee la transcripción con esas señales y elige los N mejores momentos, con inicio/fin
   exactos y los textos.
5. **ffmpeg** recorta, arma el vertical y quema los subtítulos.

Siempre revisá los clips antes de subirlos. La selección es buena, pero no perfecta: la IA no
ve el video, solo lo que se dice, el volumen y el chat. Lo esperable es que de 10 te sirvan 3 a 5.

## Instalación (Windows, una sola vez)

1. **Python 3.12**: https://www.python.org/downloads/ (tildá "Add python.exe to PATH").
2. **ffmpeg**: abrí PowerShell y corré `winget install Gyan.FFmpeg`. Cerrá y abrí la terminal.
3. En la carpeta `stream-clipper`:
   ```powershell
   python -m venv .venv
   .venv\Scripts\activate
   pip install -r requirements.txt
   ```
4. **API key de Claude**: creala en https://platform.claude.com (necesita crédito cargado) y guardala:
   ```powershell
   setx ANTHROPIC_API_KEY "sk-ant-..."
   ```
   Cerrá y abrí la terminal para que tome la variable.
5. **(Opcional) GPU NVIDIA**: la transcripción pasa de horas a minutos. faster-whisper necesita
   las DLL de cuBLAS y cuDNN para CUDA 12. La forma más simple en Windows es bajar el paquete
   `cuBLAS.and.cuDNN_CUDA12_win` de https://github.com/Purfview/whisper-standalone-win/releases
   y copiar los `.dll` en una carpeta que esté en el PATH. Si no están, el programa avisa y sigue
   con la CPU. Con NVIDIA, poné también `encoder = "h264_nvenc"` en `config.toml`.

## Primer uso: calibrar tu layout

Cada streamer tiene la facecam en un lugar distinto. Sacá un frame con grilla:

```powershell
python -m clipper frame "C:\ruta\a\un_stream.mp4" --at 00:30:00
```

Abrí `calibracion_1800.png`: el rectángulo verde es la facecam y el azul la zona del juego que
va abajo. Ajustá `facecam` y `gameplay` en `config.toml` (son fracciones del 0 al 1:
`[x, y, ancho, alto]`) y repetí hasta que encajen. Esto se hace una sola vez.

## Uso

```powershell
python -m clipper run https://kick.com/TU_CANAL/videos/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# o con un archivo local:
python -m clipper run "C:\Videos\stream 2026-10-25.mp4"
```

También podés arrastrar el video encima de `procesar.bat`.

Resultado en `output\<nombre>\clips\`:
- `01_titulo.mp4`, `02_...`: ordenados de mejor a peor.
- `LEEME_clips.txt`: título, descripción y hashtags para copiar y pegar, y en qué minuto de la VOD está cada clip.

### Corregir clips

Todo queda cacheado, así que corregir algo no repite la descarga ni la transcripción.

- **Cambiar inicio/fin o título**: editá `output\<nombre>\selection.json` (`start`/`end` en segundos) y corré:
  ```powershell
  python -m clipper render output\<nombre> --only 3
  ```
- **Layout equivocado** (detectó full cam cuando era juego o al revés):
  `python -m clipper render output\<nombre> --only 3 --layout split`
- **Pedir otra selección**: `python -m clipper run <link> --reselect` (vuelve a cobrar la llamada a Claude).
- **Solo elegir, sin renderizar**: `--no-render`.

## Tiempos y costos aproximados (VOD de 4 horas)

| Paso | Con NVIDIA | Solo CPU |
|---|---|---|
| Descarga 1080p (~6-10 GB) | según tu internet | ídem |
| Transcripción | 10-25 min (large-v3-turbo) | 1-3 h (modelo small) |
| Selección con Claude | 1-3 min, aprox. USD 0,30-0,80 | ídem |
| Render de 10 clips | 2-5 min (nvenc) | 10-20 min |

El costo de Claude depende de cuánto hables en el stream (la transcripción completa va en el
pedido). El programa muestra los tokens usados al final. Para gastar menos podés poner
`effort = "medium"` en `config.toml`, aunque la selección puede salir algo peor.

## Limitaciones conocidas

- **No probado contra Kick real.** Lo desarrollé en un entorno sin acceso a Kick: la descarga
  depende del soporte de yt-dlp para Kick y el chat usa endpoints no oficiales de su web. Si el
  chat falla, el programa sigue con audio y transcripción. Si falla la descarga, actualizá
  yt-dlp (`pip install -U yt-dlp`) o descargá la VOD a mano y pasale el archivo.
- **Detección full cam vs juego**: usa un detector de caras simple. Con poca luz, auriculares
  grandes o la cara de costado puede equivocarse; corregilo con `--layout`. Si casi todo tu
  stream es igual, fijá `mode = "split"` en `config.toml`.
- **Los subtítulos tienen errores** cuando hay música fuerte, gritos o jerga.
- **TikTok y apuestas**: TikTok restringe el contenido que promociona juegos de azar. El
  programa le pide a Claude títulos y hashtags sin nombres de casinos ni invitaciones a
  apostar, pero el video sigue mostrando el casino. Mostrar códigos de referido, links o
  depósitos aumenta el riesgo de que te bajen el video o la cuenta.
- Para limpiar disco: borrá `output\<nombre>\video.mp4` y `audio.wav` cuando ya tengas los clips.
