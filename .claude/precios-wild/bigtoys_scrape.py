import re, json, time, html, subprocess, datetime, concurrent.futures as cf
urls=[u for u in re.findall(r'<loc>([^<]+)</loc>',open('bt/sitemap.xml').read()) if '/productos/' in u and u.rstrip('/')!='https://www.big-toys.com.ar/productos']
def num(t):
    if not t: return None
    t=t.replace('$','').replace('ARS','').strip().replace('.','').replace(',','.')
    try: return float(t)
    except: return None
def get(u):
    for i in range(3):
        r=subprocess.run(['curl','-sS','--max-time','30',u],capture_output=True,text=True)
        if r.returncode==0 and r.stdout: return r.stdout
        time.sleep(2)
    return ''
def parse(u):
    s=get(u); time.sleep(0.3)
    m=re.search(r'data-variants="([^"]*)"',s)
    t=re.search(r'<meta property="og:title" content="([^"]*)',s)
    nombre=html.unescape(t.group(1)) if t else ''
    if not m: return [{'url':u,'nombre':nombre,'error':'sin variantes'}]
    out=[]
    for v in json.loads(html.unescape(m.group(1))):
        opts=' / '.join(x for x in (v.get('option0'),v.get('option1'),v.get('option2')) if x)
        out.append({'url':u,'nombre':nombre,'variante':opts,'sku':v.get('sku') or '',
          'precio':v.get('price_number'),'precio_transferencia':num(v.get('price_with_payment_discount_short')),
          'precio_sin_impuestos':num(v.get('price_without_taxes')),'precio_tachado':v.get('compare_at_price_number'),
          'stock':v.get('stock'),'disponible':v.get('available'),'consultar':v.get('contact')})
    return out
with cf.ThreadPoolExecutor(4) as ex: res=[r for rs in ex.map(parse,urls) for r in rs]
json.dump({'fuente':'big-toys.com.ar','fecha':datetime.date.today().isoformat(),'items':res},open('bt/catalogo.json','w'),ensure_ascii=False,indent=1)
print(len(urls),'productos',len(res),'filas',sum(1 for r in res if r.get('precio')),'con precio')
