// === Compatibilidad por vehículo (Wild4x4) ===
const VEH=[
 {marca:'Toyota',modelo:'Hilux',re:/\bhilux\b|\brevo\b/,gens:[[1998,2004,'1998-2004'],[2005,2015,'2005-2015'],[2016,2099,'2016 en adelante']]},
 {marca:'Toyota',modelo:'SW4',re:/\bsw\s?-?4\b/,gens:[[1996,2004,'1996-2004'],[2005,2015,'2005-2015'],[2016,2099,'2016 en adelante']]},
 {marca:'Ford',modelo:'Ranger',re:/\branger\b/,gens:[[1998,2011,'1998-2011'],[2012,2022,'2012-2022'],[2023,2099,'2023 en adelante']]},
 {marca:'Volkswagen',modelo:'Amarok',re:/\bamarok\b/,gens:[[2010,2023,'2010-2023'],[2024,2099,'2024 en adelante']]},
 {marca:'Chevrolet',modelo:'S10',re:/\bs\s?-?10\b/,gens:[[1995,2011,'1995-2011'],[2012,2099,'2012 en adelante']]},
 {marca:'Nissan',modelo:'Frontier',re:/\bfrontier\b|\bnp\s?-?300\b/,gens:[[2008,2015,'2008-2015'],[2016,2099,'2016 en adelante (NP300)']]},
 {marca:'Jeep',modelo:'Wrangler',re:/\bwrangler\b|\bjk\b|\bjl\b|\btj\b/,gens:[[1997,2006,'TJ 1997-2006'],[2007,2018,'JK 2007-2018'],[2018,2099,'JL 2018 en adelante']]},
 {marca:'Jeep',modelo:'Gladiator',re:/\bgladiator\b|\bjt\b/,gens:[[2020,2099,'JT 2020 en adelante']]},
 {marca:'Ram',modelo:'1500',re:/\b(ram|dodge)\b(?![^|]*\b(2500|rampage|dakota)\b)|\b1500\b(?=[^|]*\b(ram|dodge)\b)/,gens:[[2009,2018,'2009-2018'],[2019,2099,'2019 en adelante']]},
 {marca:'Ram',modelo:'2500',re:/\b(ram|dodge)\b[^|]*\b2500\b|\b2500\b[^|]*\b(ram|dodge)\b/,gens:[[2010,2099,'2010 en adelante']]},
 {marca:'Ram',modelo:'Rampage',re:/\brampage\b/,gens:[[2024,2099,'2024 en adelante']]}
];
const OTHER_VEH=/\b(toyota|ford|fiat|vw|volkswagen|chevrolet|chevy|renault|peugeot|citroen|nissan|mitsubishi|jeep|dodge|ram|honda|hyundai|kia|mercedes|m\.?\s?benz|isuzu|suzuki|audi|bmw|land\s?rover|ducato|kangoo|partner|berlingo|cronos|ecosport|ecosport|duster|oroch|toro|titano|maverick|f-?150|f-?100|l200|triton|saveiro|strada|gol|polo|tiguan|corolla|etios|yaris|onix|cruze|tracker|trailblazer|silverado|alaskan|d-?max|bronco|territory|kuga|focus|fiesta|ka|208|2008|3008|partner|sandero|logan|kwid|clio|qubo|fiorino|argo|mobi|uno|palio|siena|punto|vito|sprinter|transit|master|daily|hilux|ranger|amarok|s10|frontier|wrangler|gladiator|sw4)\b/;
const CATS=[
 ['Bumpers y defensas',/bumper|paragolpe|defensa|\blmb\b|portafaro|rejilla|burrera|punteras?/],
 ['Suspensión y lift kits',/suspension|amortiguador|\blift\b|suplemento|levante|espiral|elastico|grillete|gemelo|shackle|rotula|barra panhard|bujes?|kit de altura|body\b|vejiga|air spring|coilover|barra estabiliz/],
 ['Protecciones y chapones',/chapon|protector|cubre ?carter|proteccion|skid|blindaje/],
 ['Estribos y rocksliders',/estribo|rockslider|pisadera|zocalo|side ?step/],
 ['Jaulas, racks y barras',/jaula|\brack\b|antivuelco|roll ?bar|sport ?bar|\barco\b|\blanza\b|portaequipaje|barras? (de )?techo|barras? porta|canasto|porta ?escalera|portaobjeto/],
 ['Caja de carga',/cupula|\btapa\b|\blona\b|persiana|canopy|cobertor|cobertrax|bandeja|cajon|decked|smartcap|\bbaul|\btray\b|cubre caja|tri-?cuerpo|trifold/],
 ['Snorkel y tomas de aire',/snorkel|toma de aire/],
 ['Iluminación',/\bled\b|\bfaro|optica|barra de luz|\bluz\b|luces|antiniebla|lightbar/],
 ['Enganches',/enganche|\bbocha|perno|\btiro\b/],
 ['Llantas, cubiertas y separadores',/llanta|cubierta|neumatico|separador|tuerca|beadlock|\brin\b/],
 ['Fenders y carrocería',/fender|guardabarro|parrilla|deflector|moldura|cubre ?rueda|spoiler|cubre zocalo|manija|espejo/],
 ['Recuperación, inflado y camping',/malacate|winch|eslinga|hi-?lift|crique|plancha|desatasco|carpa|toldo|compresor|manometro|inflador|pala\b|kit de rescate|bolso/],
 ['Diferencial y transmisión',/diferencial|pinion|pinon|corona|\beje\b|lock\b|\bdana\b|yoke|overhaul|engranaje|axle/],
 ['Motor y performance',/escape|exhaust|cat-?back|downpipe|reprogramacion|stage|chip|pedal drive|filtro|intercooler|turbo|admision/],
 ['Interior',/funda|mariposero|cubre alfombra|alfombra|asiento|consola|organizador|volante/]
];
const nrm=s=>(s||'').toString().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const y2=d=>{d=+d;return d<=40?2000+d:1900+d};
const okY=y=>y>=1990&&y<=2030;
function parseYears(t){
  const R=[];let s=' '+t+' ';
  const take=(re,fn)=>{s=s.replace(re,(...m)=>{const r=fn(m);if(r&&okY(r[0])&&(r[1]===2099||okY(r[1]))&&r[0]<=r[1]){R.push(r);return ' # '}return m[0]})};
  const UNIT='(?!\\s?(?:v\\b|cm|mm|kg|lb|w\\b|"|pulg|mts?\\b|%|psi|x\\d|lts?\\b|cc\\b|rpm|amp|ah\\b|w\\b))';
  take(new RegExp('(?<![\\d.,])((?:19|20)\\d\\d)\\s?(?:-|/|al|a|hasta)\\s?((?:19|20)\\d\\d)(?!\\d|[.,]\\d)','g'),m=>[+m[1],+m[2]]);
  take(new RegExp('(?<![\\d.,])((?:19|20)\\d\\d)\\s?(?:-|/|al|a)\\s?(\\d\\d)(?!\\d|[.,]\\d)'+UNIT,'g'),m=>[+m[1],y2(m[2])]);
  take(/(?:desde|a partir de)\s?(?:el\s)?((?:19|20)\d\d)/g,m=>[+m[1],2099]);
  take(/((?:19|20)\d\d)\s?(?:en adelante|\+|>)/g,m=>[+m[1],2099]);
  take(new RegExp('(?<![\\d.,/\\w])(\\d\\d)\\s?(?:-|/|al|a)\\s?(\\d\\d)(?!\\d|[.,]\\d)'+UNIT,'g'),m=>{const a=+m[1],b=+m[2];const v=x=>(x>=90||x<=30);if(!v(a)||!v(b))return null;const A=y2(a),B=y2(b);return B-A<=30?[A,B]:null});
  take(/(?<![\d.,/\w])(\d\d)\s?(?:\+|en adelante)/g,m=>{const a=+m[1];return(a>=90||a<=30)?[y2(a),2099]:null});
  take(/hasta\s(?:[a-z]+\s)?((?:19|20)\d\d)/g,m=>[1990,+m[1]]);
  take(new RegExp('(?<![\\d.,])((?:19|20)\\d\\d)(?!\\d|[.,]\\d)'+UNIT,'g'),m=>[+m[1],+m[1]]);
  const up=R.filter(r=>r[0]===1990),open=R.filter(r=>r[1]===2099);
  if(up.length&&open.length){const a=Math.max(...open.map(r=>r[0])),b=Math.min(...up.map(r=>r[1]));if(a<=b)return R.filter(r=>r[0]!==1990&&r[1]!==2099).concat([[a,b]])}
  return R;
}
function tagItem(text){
  const t=nrm(text).replace(/\s+/g,' ');
  const models=[];VEH.forEach((v,i)=>{if(v.re.test(t))models.push(i)});
  const years=models.length?parseYears(t):[];
  let cat='Otros';for(const [c,re] of CATS){if(re.test(t)){cat=c;break}}
  const universal=!models.length&&(/universal/.test(t)||!OTHER_VEH.test(t));
  return {models,years,cat,universal};
}
function fitsYear(tag,y){return !tag.years.length||tag.years.some(([a,b])=>y>=a&&y<=b)}
function genOf(mi,y){const g=VEH[mi].gens.filter(([a,b])=>y>=a&&y<=b).map(g=>g[2]);return g.join(' / ')}
if(typeof module!=='undefined')module.exports={VEH,CATS,tagItem,parseYears,fitsYear,genOf,nrm};
