import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const base='https://d4ttara.github.io/metacademy-of-humanity/';
const repo='https://github.com/D4ttara/metacademy-of-humanity';

const docs={
 '003':{slug:'003-life-as-organization',en:'Life as Organization',ua:'Життя як організація'},
 '004':{slug:'004-when-science-reaches-a-plateau',en:'When Science Reaches a Plateau',ua:'Коли наука виходить на плато'},
 '006':{slug:'006-myoga-jyotish',en:'M{Y}OGA JYOTISH Field Manifesto',ua:'M{Y}OGA JYOTISH · Маніфест дисципліни'},
 '007':{slug:'007-after-vibe-coding',en:'After Vibe Coding',ua:'Після Vibe Coding'},
 '008':{slug:'008-the-interface-that-knows-you',en:'The Interface That Knows You',ua:'Інтерфейс, який знає тебе'},
 '010':{slug:'010-manifestation-time-genesis-time',en:'Manifestation Time ≠ Genesis Time',ua:'Час прояву ≠ час зародження'},
 '011':{slug:'011-the-third-body',en:'The Third Body',ua:'Третє тіло'},
 '012':{slug:'012-myoga-astrology-overview',en:"M{Y}OGA: What Happens If We Don't Laugh at Astrology for the First Five Minutes",ua:'M{Y}OGA · якщо не сміятися з астрології перші п’ять хвилин'},
 '013':{slug:'013-room-that-answers',en:'The Human in a Room That Answers',ua:'Людина в кімнаті, яка відповідає'},
 '015':{slug:'015-polytypic-thinking',en:'Polytypic Thinking',ua:'Політипічне мислення'},
 '016':{slug:'016-right-to-a-first-chance',en:'The Right to a First Chance',ua:'Право на перший шанс'}
};
const issue={'003':53,'004':54,'006':55,'007':45,'008':46,'010':48,'011':49,'012':50,'013':51,'015':58,'016':59};
const trails=[
 {id:'human-ai',en:'Human ↔ AI',ua:'Людина ↔ ШІ',descEn:'From personalization to answer bubbles, classification and access: how systems model people and how those models begin shaping what happens next.',descUa:'Від персоналізації до бульбашок відповідей, класифікації та доступу: як системи моделюють людей і як ці моделі починають змінювати те, що станеться далі.',nodes:['008','013','015','016']},
 {id:'knowledge-uncertainty',en:'Knowledge & Uncertainty',ua:'Знання й невизначеність',descEn:'How a field notices a plateau, distinguishes genesis from manifestation and resists turning a convenient type into final ontology.',descUa:'Як поле помічає плато, відрізняє генезис від прояву й не дозволяє зручному типу перетворитися на остаточну онтологію.',nodes:['004','010','015']},
 {id:'semantic-systems',en:'Semantic Systems',ua:'Семантичні системи',descEn:'What has to survive when intention becomes code, an interface learns you and an answering system starts predicting the next turn.',descUa:'Що має вижити, коли намір стає кодом, інтерфейс вчиться на тобі, а система відповідей починає передбачати наступний хід.',nodes:['007','008','013']},
 {id:'life-relation',en:'Life & Relation',ua:'Життя й відношення',descEn:'From organization as a candidate marker of life to the possibility that a relation develops properties not reducible to either participant.',descUa:'Від організації як можливого маркера життя до ідеї, що відношення може набувати властивостей, не зводимих до жодного учасника.',nodes:['003','011']},
 {id:'myoga',en:'M{Y}OGA',ua:'M{Y}OGA',descEn:'A guarded route through Jyotiṣa, cross-tradition research and testable questions without collapsing tradition, interpretation and physics into one evidence soup.',descUa:'Маршрут через Jyotiṣa, міжтрадиційне дослідження й перевірні питання без злиття традиції, інтерпретації та фізики в один evidence soup.',nodes:['006','012']}
];

const pathFor=(n,ua)=>{
 const d=docs[n];
 if(n==='003') return ua?`../documents/${d.slug}/`:`../documents/${d.slug}/en/`;
 if(n==='006') return `../documents/${d.slug}/`;
 return `../documents/${d.slug}/${ua?'ua':'en'}/`;
};
const absPathFor=(n,ua)=>{
 const d=docs[n];
 if(n==='003') return `${base}documents/${d.slug}/${ua?'':'en/'}`;
 if(n==='006') return `${base}documents/${d.slug}/`;
 return `${base}documents/${d.slug}/${ua?'ua':'en'}/`;
};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function render(ua){
 const lang=ua?'uk':'en';
 const route=ua?'uk/start/':'start/';
 const other=ua?`${base}start/`:`${base}uk/start/`;
 const canonical=`${base}${route}`;
 const title=ua?'З ЧОГО ПОЧАТИ':'START HERE';
 const desc=ua?'П’ять дослідницьких маршрутів через публічний корпус MET[Ȧ]CADEMY OF HUMANITY: Людина↔ШІ, знання, семантичні системи, життя й M{Y}OGA.':'Five guided research trails through the public MET[Ȧ]CADEMY OF HUMANITY corpus: Human↔AI, knowledge, semantic systems, life and M{Y}OGA.';
 const prefix=ua?'../../':'../';
 const cards=trails.map((t,idx)=>{
   const nodes=t.nodes.map((n,i)=>{const d=docs[n]; const href=pathFor(n,ua); const challenge=`${repo}/issues/${issue[n]}`; return `<li><span class="eyebrow">${i+1}</span> <a href="${href}">Document ${n} · ${esc(ua?d.ua:d.en)}</a> · <a href="${href}#ai-reader-lab-${n}">${ua?'ШІ-критика':'AI critique'}</a> · <a href="${challenge}">${ua?'заперечити':'challenge'}</a></li>`}).join('');
   return `<article class="card" id="${t.id}"><p class="eyebrow">${ua?'Маршрут':'Trail'} ${idx+1} · ${t.nodes.length} ${ua?'вузли':'nodes'}</p><h2>${esc(ua?t.ua:t.en)}</h2><p>${esc(ua?t.descUa:t.descEn)}</p><ol>${nodes}</ol></article>`;
 }).join('');
 const listItems=trails.map((t,i)=>({"@type":"ListItem",position:i+1,name:ua?t.ua:t.en,url:`${canonical}#${t.id}`}));
 const ld={"@context":"https://schema.org","@type":"CollectionPage","name":title,"url":canonical,"description":desc,"isPartOf":{"@id":`${base}#website`},"about":["Artificial intelligence","Human-AI interaction","Epistemology","Semantic computing","Complex systems","Jyotisha"],"mainEntity":{"@type":"ItemList","numberOfItems":trails.length,"itemListElement":listItems}};
 return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="${base}start/"><link rel="alternate" hreflang="uk" href="${base}uk/start/"><link rel="alternate" hreflang="x-default" href="${base}start/"><meta property="og:type" content="website"><meta property="og:site_name" content="MET[Ȧ]CADEMY OF HUMANITY"><meta property="og:title" content="${title} · MET[Ȧ]CADEMY OF HUMANITY"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><title>${title} · MET[Ȧ]CADEMY OF HUMANITY</title><link rel="icon" href="${prefix}assets/img/favicon.svg"><link rel="stylesheet" href="${prefix}assets/css/site.css"><script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><header class="top"><div class="wrap"><a class="brand" href="${ua?'../':'../'}">MET[Ȧ]CADEMY<br>OF HUMANITY</a><nav class="nav" aria-label="${ua?'Основна навігація':'Primary navigation'}"><a href="${prefix}research/">${ua?'Дослідження':'Research'}</a><a href="${prefix}questions/">${ua?'Питання':'Questions'}</a><a href="${prefix}identity/">${ua?'Ідентичність':'Identity'}</a><a href="${other}">${ua?'EN':'UKR'}</a></nav></div></header><main><header class="pagehead"><div class="wrap"><p class="eyebrow">${ua?'5 шляхів у корпус · не треба читати все по порядку':'5 ways into the corpus · no need to read everything in order'}</p><h1>${title}</h1><p class="lede">${ua?'Обери питання, а не номер документа. Кожен маршрут має читання, готову ШІ-критику й публічний канал для заперечення.':'Choose a question, not a document number. Every trail includes reading, a ready AI critique, and a public route for disagreement.'}</p><p>${ua?'Це навігація, не рейтинг. Маршрути перетинаються, бо живі питання погано поважають межі каталогів.':'This is navigation, not ranking. The trails overlap because live questions are notoriously bad at respecting filing cabinets.'}</p></div></header><section><div class="wrap"><div class="cards">${cards}</div></div></section></main><footer><div class="wrap">© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH) · <a href="${prefix}identity/">${ua?'Ідентичність і цитування':'Identity & citation'}</a></div></footer></body></html>`;
}

for(const [dir,html] of [['start/index.html',render(false)],['uk/start/index.html',render(true)]]){mkdirSync(dir.split('/').slice(0,-1).join('/'),{recursive:true});writeFileSync(dir,html,'utf8')}

const machine={schema:'metacademy-research-trails/v1',canonical_name:'MET[Ȧ]CADEMY OF HUMANITY',machine_safe_name:'METACADEMY OF HUMANITY',generated:'2026-08-29',trails:trails.map(t=>({id:t.id,title_en:t.en,title_ua:t.ua,description_en:t.descEn,description_ua:t.descUa,documents:t.nodes.map(n=>({number:n,title_en:docs[n].en,title_ua:docs[n].ua,url_en:absPathFor(n,false),url_ua:absPathFor(n,true),discussion:`${repo}/issues/${issue[n]}`}))}))};
mkdirSync('discovery',{recursive:true});writeFileSync('discovery/research-trails.json',JSON.stringify(machine,null,2)+'\n','utf8');

let sitemap=readFileSync('sitemap.xml','utf8');
for(const route of ['start/','uk/start/']) if(!sitemap.includes(base+route)) sitemap=sitemap.replace('</urlset>',`  <url><loc>${base}${route}</loc></url>\n</urlset>`);
writeFileSync('sitemap.xml',sitemap,'utf8');

let llms=readFileSync('llms.txt','utf8');
if(!llms.includes('## Start Here · Research Trails')) llms += `\n## Start Here · Research Trails\n- ${base}start/\n- ${base}uk/start/\n- Machine-readable trails: ${base}discovery/research-trails.json\n`;
writeFileSync('llms.txt',llms,'utf8');

for(const [file,ua] of [['index.html',false],['uk/index.html',true]]){
 let h=readFileSync(file,'utf8');
 if(!h.includes('data-start-here-entry')){
   const href=ua?'start/':'start/';
   const block=`<section data-start-here-entry="true"><div class="wrap grid"><div class="copy"><p class="eyebrow">${ua?'З чого почати · 5 маршрутів':'Start here · 5 research trails'}</p><h2>${ua?'Не обирай номер документа. Обери питання.':'Do not choose a document number. Choose a question.'}</h2><p>${ua?'Людина ↔ ШІ, знання й невизначеність, семантичні системи, життя й відношення, M{Y}OGA.':'Human ↔ AI, knowledge & uncertainty, semantic systems, life & relation, and M{Y}OGA.'}</p><a class="button primary" href="${href}">${ua?'Відкрити маршрути →':'Open the trails →'}</a></div><aside class="aside">${ua?'READ → AI CRITIQUE → CHALLENGE':'READ → AI CRITIQUE → CHALLENGE'}</aside></div></section>`;
   h=h.replace('</main>',block+'</main>'); writeFileSync(file,h,'utf8');
 }
}
for(const [file,ua] of [['research/index.html',false],['uk/research/index.html',true]]){
 let h=readFileSync(file,'utf8');
 if(!h.includes('data-start-here-research-link')){
  const href=ua?'../start/':'../start/';
  const block=`<p data-start-here-research-link="true"><a class="button" href="${href}">${ua?'З чого почати: 5 дослідницьких маршрутів →':'Start here: 5 guided research trails →'}</a></p>`;
  h=h.replace('</main>',`<section><div class="wrap">${block}</div></section></main>`); writeFileSync(file,h,'utf8');
 }
}
console.log('START_HERE_BUILD=PASS trails=5 pages=2 machine_json=PASS homepage_entry=PASS research_entry=PASS sitemap=PASS llms=PASS');