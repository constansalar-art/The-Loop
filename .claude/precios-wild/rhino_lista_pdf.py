import re,json,sys
lines=open(sys.argv[1],encoding='utf-8').read().split('\n')
items=[];cat=sub='';last=None
skip=re.compile(r'Lista de Precios|^\s*\d\d/\d\d/\d{4}\s*$|CÓDIGO\s+DESCRIPCI|Page \d+ of|Los Precios de Lista')
for raw in lines:
    if not raw.strip(): last=None; continue
    if skip.search(raw): continue
    m=re.match(r'^(\S.*?)?\s*\$\s*([\d.]+,\d{2})\s*$',raw.rstrip())
    if m:
        txt=(m.group(1) or '').strip()
        code=''
        mc=re.match(r'^([A-Z0-9][A-Z0-9\-./]{2,14})\s{2,}(.*)$',txt)
        if mc and any(ch.isdigit() for ch in mc.group(1)): code,txt=mc.group(1),mc.group(2)
        p=float(m.group(2).replace('.','').replace(',','.'))
        last={'s':code,'n':re.sub(r'\s+',' ',txt),'p':p,'c':cat,'sc':sub,'w':len(raw.rstrip())}
        items.append(last); continue
    indent=len(raw)-len(raw.lstrip()); t=re.sub(r'\s+',' ',raw.strip())
    if last is not None and indent==0:
        last['n']=(last['n']+' '+t).strip(); continue
    last=None
    if indent==0: cat=t; sub=''
    else: sub=t
for it in items: it.pop('w',None)
json.dump(items,open(sys.argv[2],'w'),ensure_ascii=False,indent=0)
print(len(items),'items')
