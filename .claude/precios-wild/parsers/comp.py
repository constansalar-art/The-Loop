import sys, json, re, openpyxl, datetime
wb=openpyxl.load_workbook(sys.argv[1],data_only=True); ws=wb.worksheets[0]
def num(x):
    return x if isinstance(x,(int,float)) and not isinstance(x,bool) else None
def clean(s): return re.sub(r'\s+',' ',str(s)).strip()
def code(x):
    if x is None: return ''
    if isinstance(x,float) and x.is_integer(): x=int(x)
    return clean(x)
items=[]; zero=[]; anomalies=[]; both=[]
section='BAULES Y VALIJAS - PORTATUTTO'; title=''; aero=False; kitmode=False; conomode=None
HDR_GENERIC={'DESCRIPCION','CINTA REFLECTIVA','Altura'}
for i,r in enumerate(ws.iter_rows(values_only=True),start=1):
    r=list(r)+[None]*25
    c0,c1,c2=r[0],r[1],r[2]
    if i<=10: continue
    if all(v is None or isinstance(v,datetime.time) for v in r[:23]): continue
    # header rows
    if c1=='CODIGO' or c1=='KIT Nº' or c0=='Cod Imp':
        kitmode = (c1=='KIT Nº')
        if c2 and clean(c2) not in HDR_GENERIC: section=clean(c2)
        elif title: section=title
        conomode = 'conos' if clean(c2 or '')=='Altura' else None
        continue
    if c0 is None and isinstance(c2,str) and num(c1) is None:
        t=clean(c2)
        if t not in ('Medidas','en cm'): title=t
        if 'AERO' in t.upper().replace(' ',''): aero=True
        continue
    if c0 is None and isinstance(c1,str) and c2 is None:
        title=clean(c1); continue
    if kitmode:
        for a,b,c in ((0,1,2),(4,5,6)):
            if num(r[a]) and num(r[c]) is not None:
                p=r[c]
                it={'s':'KIT '+code(r[b]),'n':'Kit Nº %s para barras portatablas Aerodynamic'%code(r[b]),'v':'Kit para barras Aerodynamic','p':round(p,2)}
                (items if p else zero).append(it if p else (i,it))
        continue
    if num(c0) is None or not c0:
        anomalies.append((i,[x for x in r[:23] if x is not None])); continue
    usd,ars=num(r[21]),num(r[22])
    if usd and ars: both.append(i)
    if ars: p,m=ars,'ARS'
    elif usd: p,m=usd,'USD'
    else: p,m=0,None
    s=code(c1)
    if conomode=='conos' and num(c2) is not None:
        n='Cono vial altura %s cm, base %s cm, cintas reflectivas: %s'%(code(c2),code(r[3]),clean(r[5]))
    else:
        n=clean(c2)
        if section.startswith('CONOS') or title.startswith('CONOS'):
            if section=='CONOS' or 'cintas reflectivas' in n.lower() and 'cono' not in n.lower():
                n='Cono vial %s, base %s, %s'%(code(r[7]),clean(r[5]),n)
    if section.startswith('ADAPTABLE') or section.startswith('KIT UNIVERSAL'):
        extra=[]
        if r[6] not in (None,'-',0,0.0): extra.append('kit %s'%code(r[6]))
        if r[7] not in (None,'-',0,0.0): extra.append('caño %s'%code(r[7]))
        n='Barras portatablas Aerodynamic '+n+(' ('+', '.join(extra)+')' if extra else '')
    if section.startswith('CAÑOS') and num(r[7]):
        n=n+' %s m'%code(r[7]) if 'mt' not in n else n
    v=section[:1].upper()+section[1:].lower()
    if section.startswith('ADAPTABLE LINEA'): v='Barras Aerodynamic '+section.replace('ADAPTABLE LINEA','').strip().title()
    if r[20]=='OFERTA': n+=' (OFERTA)'
    it={'s':s,'n':n,'v':v,'p':round(p,2)}
    if m=='USD': it['mon']='USD'; it['v']=(v+' · USD').strip(' ·')
    if p: items.append(it)
    else: zero.append((i,it))
out={'vigencia':'2026-09-01','precio_es':'Precio de lista Canal de Ventas N° 107, sin IVA. La lista mezcla monedas: p está en pesos (ARS) salvo los items marcados con "mon":"USD" (y sufijo " · USD" en v), cuyo precio está en dólares (columna PRECIO USD).','moneda':'ARS','iva':'no incluido','items':items}
json.dump(out,open(sys.argv[2],'w'),ensure_ascii=False,indent=0)
print(len(items),'items; zero',len(zero),'both',both)
print('USD',sum(1 for x in items if x.get('m')=='USD'))
print('ANOM'); [print(a) for a in anomalies]
from collections import Counter
print(Counter(x['v'] for x in items).most_common(200))
