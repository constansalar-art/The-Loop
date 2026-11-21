import sys, json, re, openpyxl
S=sys.argv[1]
cl=lambda s: re.sub(r'\s+',' ',str(s)).strip()
ws=openpyxl.load_workbook(S+'/raw/miguel.xlsx',data_only=True).worksheets[0]
rows=[list(r) for r in ws.iter_rows(min_row=2,values_only=True)]
items=[];notes=[]
for k,r in enumerate(rows):
    mod,desc,pub,may=r[:4]
    if mod is None and desc is None: continue
    if mod is None: continue  # continuation handled below
    if not pub and k+1<len(rows) and rows[k+1][0] is None and rows[k+1][1]:
        nx=rows[k+1]; desc=cl(desc)+' '+cl(nx[1]); pub,may=nx[2],nx[3]; notes.append('joined row %d+%d'%(k+2,k+3))
    if not pub and not may: notes.append('no price row %d'%(k+2)); continue
    it={'s':'','n':'Kit de levante (suplementos) %s %s'%(cl(mod),cl(desc)) if mod not in ('GRAMPAS','TACOS','TACOS DE ELASTICOS') else '%s %s'%(cl(mod),cl(desc)),'v':cl(mod)}
    if may: it['p']=may; it['t']=pub
    else: it['p']=pub; notes.append('only publico row %d: %s'%(k+2,it['n']))
    items.append(it)
json.dump({'vigencia':None,'precio_es':'p = Precio mayorista; t = Precio público (ambos tal como figuran en la lista, sin aclaración de IVA)','moneda':'ARS','iva':'desconocido','items':items},open(S+'/miguel-mz-lift-kits.json','w'),ensure_ascii=False,indent=0)
print('miguel',len(items),notes)
ws=openpyxl.load_workbook(S+'/raw/coversaxs.xlsx',data_only=True).worksheets[0]
items=[]
for r in ws.iter_rows(min_row=4,max_row=10,values_only=True):
    if r[1] and isinstance(r[3],(int,float)):
        items.append({'s':'','n':'Fundas de asiento Coversaxs %s color %s'%(cl(r[1]),cl(r[2])),'v':cl(r[1]),'p':r[3],'t':r[4]})
json.dump({'vigencia':None,'precio_es':'Precio distribuidor en USD (al tipo de cambio BNA) más IVA: p = precio pago al día, t = precio a 30 días. Descuentos: +50 u. 10% (142.785), +100 u. 20% (126.92). Precio de venta sugerido al público: $430.000 IVA incluido (ARS).','moneda':'USD','iva':'no incluido','items':items},open(S+'/coversaxs-fundas.json','w'),ensure_ascii=False,indent=0)
print('cov',len(items))
