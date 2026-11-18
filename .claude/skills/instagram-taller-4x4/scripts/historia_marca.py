"""Historia 9:16 según el Manual de Marca WILD4X4 v1.
Uso: python3 historia_marca.py FOTO SALIDA.jpg [--rotar 90] [--titulo ..] [--sub ..] [--pie ..]
Requiere fuentes en assets/fonts (ver SKILL.md)."""
import sys, os, argparse
from PIL import Image, ImageDraw, ImageFont, ImageEnhance, ImageFilter
B=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','assets')+'/'
F=B+'fonts/'
ap=argparse.ArgumentParser(); ap.add_argument('foto'); ap.add_argument('salida'); ap.add_argument('--rotar',type=int,default=0)
ap.add_argument('--titulo',default='TALLER LLENO'); ap.add_argument('--sub',default='4 PROYECTOS EN MARCHA'); ap.add_argument('--pie',default='¿Cuál querés ver terminada?')
A=ap.parse_args()
AZUL=(0x32,0x32,0x48); BLANCO=(255,255,255)
BC=lambda s,w=700: ImageFont.truetype(F+f'barlow-condensed-latin-{w}-normal.woff',s)
IN=lambda s,w=400: ImageFont.truetype(F+f'inter-latin-{w}-normal.woff',s)
W,H=1080,1920
foto=Image.open(A.foto).convert('RGB')
if A.rotar: foto=foto.rotate(A.rotar,expand=True)
foto=ImageEnhance.Contrast(foto).enhance(1.08); foto=ImageEnhance.Color(foto).enhance(1.05)
foto=foto.resize((W,int(W*foto.height/foto.width)),Image.LANCZOS).filter(ImageFilter.UnsharpMask(2,60,3))
im=Image.new('RGB',(W,H),AZUL); d=ImageDraw.Draw(im)
logo=Image.open(B+'wild_logo_blanco.png'); lw=170; logo=logo.resize((lw,int(lw*logo.height/logo.width)),Image.LANCZOS)
im.paste(logo,((W-lw)//2,150),logo)
def c(t,f,y,fill): d.text(((W-d.textlength(t,font=f))/2,y),t,font=f,fill=fill)
c(A.titulo.upper(),BC(170),395,BLANCO)
sub=A.sub.upper(); f=BC(64,600); w=d.textlength(sub,font=f)
x=(W-w)/2; d.rectangle((x-30,605,x+w+30,695),fill=BLANCO); d.text((x,612),sub,font=f,fill=AZUL)
y=760; im.paste(foto,(0,y))
c(A.pie,IN(52,600),y+foto.height+90,BLANCO)
c('@WILD4X4.COM.AR',IN(34,400),H-150,(200,200,215))
im.save(A.salida,quality=95); print('Listo:',A.salida)
