import json,sys,os
# uso: build_doc.py <slug>  -> lee listas/<slug>.json + ref/docs/<slug>.json, escribe listas/out/<slug>.json
S='/tmp/claude-0/-home-user-The-Loop/0fcf221f-5510-5b47-a517-01a61aa97461/scratchpad/'
slug=sys.argv[1]
L=json.load(open(S+f'listas/{slug}.json')); base=json.load(open(S+f'ref/docs/{slug}.json'))
items=[]
for it in L['items']:
    try: p=float(it['p'])
    except Exception: continue
    if p<=0: continue
    o={'n':str(it.get('n','')).strip(),'p':round(p,2)}
    if it.get('mon') in ('USD','ARS'): o['mon']=it['mon']
    for k in ('s','v'):
        if it.get(k): o[k]=str(it[k]).strip()
    for k in ('t','i'):
        try:
            if it.get(k) not in (None,''): o[k]=round(float(it[k]),2)
        except Exception: pass
    if o['n']: items.append(o)
import re
nota=' · '.join(x for x in [L.get('precio_es'),('Moneda: '+L['moneda']) if L.get('moneda') and L['moneda']!='ARS' else '',('IVA '+L['iva']) if L.get('iva') and L['iva']!='desconocido' else ''] if x)
nota=re.sub(r'\bp\s*=',' Precio =',nota); nota=re.sub(r'\bt\s*=',' Otro precio =',nota); nota=re.sub(r'\bi\s*=',' Sin impuestos =',nota).strip()
doc=dict(base); doc.update({'tipo':'lista','items':items,'nota':nota or 'Lista cargada','actualizado':L.get('vigencia'),'moneda':L.get('moneda','ARS')})
if not L.get('vigencia'):
    doc['fecha_archivo']=base.get('actualizado'); doc['fecha_archivo_origen']='modificación del archivo'
    doc['nota']+=' · La lista no trae fecha impresa'
json.dump(doc,open(S+f'listas/out/{slug}.json','w'),ensure_ascii=False,separators=(',',':'))
print(slug,len(items),'items',os.path.getsize(S+f'listas/out/{slug}.json')//1024,'KB',doc['actualizado'],'|',doc['nota'])
