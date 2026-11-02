@echo off
REM Uso: arrastra un video encima de este archivo, o: procesar.bat https://kick.com/canal/videos/xxxx
call "%~dp0.venv\Scripts\activate.bat"
cd /d "%~dp0"
python -m clipper run %*
pause
