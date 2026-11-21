import re, json, sys
D=sys.argv[1]
def num(s): return float(s.replace('.','').replace(',','.')) if ',' in s else int(s.replace('.',''))
def clean(x):
    x=round(x,2); return int(x) if x==int(x) else x
# DURABOX
txt=open(D+'/raw/durabox.txt').read().splitlines()
items=[];cat='';pl=0
for l in txt:
    m=re.match(r'^\s*(\d+)\s+(.+?)\s+\$\s+([\d\.,-]+)\s+\$\s+([\d\.,-]+)\s+\$\s+([\d\.,-]+)\s*$',l)
    if not m: continue
    code,name,a,b,c=m.groups()
    if a=='-': cat=name.strip().title(); continue
    pl+=1
    items.append({"s":code,"n":"Tapa rígida plegable Durabox "+name.strip(),"v":"Tapa rígida "+cat,"p":clean(num(c)),"t":clean(num(a)),"i":clean(num(b))})
json.dump({"vigencia":None,"precio_es":"p = precio revendedor FINAL con IVA; i = precio revendedor sin IVA; t = precio SUGERIDO de venta al público","moneda":"ARS","iva":"incluido","items":items},open(D+'/durabox.json','w'),ensure_ascii=False,indent=0)
print('durabox',len(items),'price lines',pl,'nonzero-$ lines',sum(1 for l in txt if re.search(r'\$\s+\d',l)))
# THOR
txt=open(D+'/raw/thor4x4.txt').read().splitlines()
items=[];cat='';sub='';skipped=[];pricelines=0
P=r'\$\s*([\d\.]+)'
for l in txt[2:]:
    if not l.strip(): continue
    prices=re.findall(r'\$\s*([\d\.]+\d)',l)
    if prices: pricelines+=1
    m=re.match(r'^(\S+(?: B)?)?\s+(.*?)\s*(\$.*|NO\s+NO\s+NO)?$',l)
    left=l.split('$')[0]
    left=re.sub(r'\s+NO\s+NO\s+NO\s*$','',left).rstrip()
    code='';name=left.strip()
    m=re.match(r'^(\S+(?: B)?)\s{2,}(.+)$',left)
    if m and re.search(r'\d',m.group(1)) and not left.startswith(' '):
        code,name=m.group(1),m.group(2).strip()
    elif not left.startswith(' ') and re.match(r'^\S+$',left.strip()) and re.search(r'\d',left):
        code,name=left.strip(),''
    if not prices:
        if code or '$' in l or 'NO' in l.split()[-1:] or (name and len(left)-len(left.lstrip())<20):
            skipped.append(l.strip()); continue
        if name in ('PICK UP','SUV','FURGON'): sub=name
        elif name: cat=name.strip(); sub=''
        continue
    if not name: skipped.append(l.strip()); continue
    vals=[num(x) for x in prices]
    it={"s":code,"n":name,"v":(cat+(' '+sub if sub else '')).title()}
    if len(vals)==3: it.update(p=vals[1],t=vals[2],m=vals[0])
    elif len(vals)==1: it.update(p=vals[0],t=vals[0],obs="solo precio mostrador")
    else: print('ODD',l)
    items.append(it)
json.dump({"vigencia":"2026-10-01","precio_es":"p = precio REVENTA; t = precio MOSTRADOR (público); m = precio MAYORISTA (más bajo). Ítems con obs='solo precio mostrador' solo traen precio mostrador (p=t). La lista no aclara IVA.","moneda":"ARS","iva":"desconocido","items":items},open(D+'/thor4x4.json','w'),ensure_ascii=False,indent=0)
print('thor',len(items),'pricelines',pricelines); print('\n'.join('SKIP '+s for s in skipped))
# BARATEC
txt=open(D+'/raw/baratec.txt').read().splitlines()
items=[];brand='';model='';pl=0;brands={'CHEVROLET','DODGE','FORD','JEEP','LAND ROVER','MITSUBISHI','L200 CHEVROLET','NISSAN','RENAULT','TOYOTA','VOLKSWAGEN'}
for l in txt:
    if re.search(r'\$\s*[\d\.]+,\d\d',l): pl+=1
    m=re.match(r'^(X-4-\S+)\s+(.+?)\s{2,}(\S.*?)\s{2,}(Sin reg\.|Regulable)\s*\$\s*([\d\.]+,\d\d)\s*$',l)
    if m:
        code,d,u,t,pr=m.groups()
        items.append({"s":code,"n":f"Amortiguador {d.strip()} - {u.strip()} - {t} ({brand.title()} {model})","v":"Amortiguador "+brand.title(),"p":clean(num(pr))}); continue
    s=l.strip()
    if not s or 'PRECIOS' in s or s.startswith('CODIGO') or s.startswith('Página') or s.startswith('**'): continue
    if s in brands: brand=s if s!='L200 CHEVROLET' else 'MITSUBISHI'; model=''
    else: model=s
json.dump({"vigencia":"2026-09-10","precio_es":"Precio público por unidad, sin IVA (+21%)","moneda":"ARS","iva":"no incluido","items":items},open(D+'/baratec.json','w'),ensure_ascii=False,indent=0)
print('baratec',len(items),'pricelines',pl)
