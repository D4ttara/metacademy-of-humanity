import { mkdirSync, writeFileSync } from 'node:fs';

const base='https://d4ttara.github.io/metacademy-of-humanity/';
const shared={
  'msl':{
    title:'MSL · Semantic Research Layer',
    status:'ACTIVE PUBLIC RESEARCH',
    en:'A public doorway into MET[Ȧ]CADEMY work on semantic preservation, translation between representations, provenance-aware meaning and the boundary between an intended concept and its executable form.',
    ua:'Публічний вхід у дослідження MET[Ȧ]CADEMY про збереження смислу, переклад між представленнями, provenance-aware meaning та межу між задумом і його виконуваною формою.',
    guard:'SEMANTIC AGREEMENT != EXECUTABLE EQUIVALENCE',
    related:[['../','Research'],['../../programs/','Programs'],['../../corpus/','Corpus'],['../../documents/007-after-vibe-coding/en/','Document 007']]
  },
  'lineage':{
    title:'Research Lineage',
    status:'PUBLIC RESEARCH INFRASTRUCTURE',
    en:'A public index for source history, revision paths, superseded ideas and research memory. It exists so a later conclusion can keep a route back to the earlier state that produced it.',
    ua:'Публічний індекс історії джерел, ревізій, superseded-ідей та пам’яті дослідження. Він потрібен, щоб пізніший висновок зберігав маршрут назад до стану, з якого виріс.',
    guard:'ARCHIVE != CANON',
    related:[['../../memory/','Research Memory'],['../../questions/','Open Questions'],['../../programs/','Programs'],['../','Research']]
  },
  'system':{
    title:'Experimental Systems Research',
    status:'RESEARCH CANDIDATE FIELD',
    en:'A guarded public doorway into experimental compute and systems work, including the MOR}4{MER / M4M lineage. Public presence here records research direction and provenance, not a claim that a deployed replacement for established architectures already exists.',
    ua:'Обережний публічний вхід в experimental compute та системні дослідження, включно з lineage MOR}4{MER / M4M. Публічна присутність тут фіксує напрям і provenance, а не заявляє, що вже існує розгорнута заміна усталеним архітектурам.',
    guard:'RESEARCH CANDIDATE != DEPLOYED SYSTEM',
    related:[['../../programs/#experimental-compute','Experimental Compute program'],['../','Research'],['../../corpus/','Corpus'],['../../identity/','Identity & citation']]
  }
};

const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function render(id,p){
 const canonical=`${base}research/${id}/`;
 const links=p.related.map(([href,label])=>`<a class="button" href="${href}">${esc(label)}</a>`).join(' ');
 const ld={"@context":"https://schema.org","@type":"WebPage","name":p.title,"url":canonical,"isPartOf":{"@id":`${base}#website`},"about":[p.title,'METACADEMY OF HUMANITY','research provenance']};
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(p.en)}"><meta name="robots" content="index,follow,max-snippet:-1"><link rel="canonical" href="${canonical}"><meta property="og:type" content="website"><meta property="og:site_name" content="MET[Ȧ]CADEMY OF HUMANITY"><meta property="og:title" content="${esc(p.title)} · MET[Ȧ]CADEMY OF HUMANITY"><meta property="og:description" content="${esc(p.en)}"><meta property="og:url" content="${canonical}"><title>${esc(p.title)} · MET[Ȧ]CADEMY OF HUMANITY</title><link rel="icon" href="../../assets/img/favicon.svg"><link rel="stylesheet" href="../../assets/css/site.css"><script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><header class="top"><div class="wrap"><a class="brand" href="../../">MET[Ȧ]CADEMY<br>OF HUMANITY</a><nav class="nav" aria-label="Primary navigation"><a href="../../start/">Start</a><a href="../../corpus/">Corpus</a><a href="../../programs/">Programs</a><a href="../">Research</a></nav></div></header><main><header class="pagehead"><div class="wrap"><p class="eyebrow">${esc(p.status)} · PUBLIC INDEX</p><h1>${esc(p.title)}</h1><p class="lede">${esc(p.en)}</p><p class="lede">${esc(p.ua)}</p><p><code>${esc(p.guard)}</code></p></div></header><section><div class="wrap grid"><div class="copy"><p class="eyebrow">PUBLIC BOUNDARY</p><h2>Enough surface to inspect the direction. Not a dump of the engine room.</h2><p>Only material already intended for the public repository belongs behind this doorway. Internal implementation, private archives, sealed research payloads and unverified runtime claims remain outside the public surface.</p><p>Публічний індекс показує напрям, статус і provenance. Внутрішня реалізація, приватні архіви, sealed research та неперевірені runtime-заяви сюди автоматично не переходять.</p></div><aside class="aside">PUBLIC INDEX != INTERNAL CORPUS<br>VISIBLE DIRECTION != VERIFIED IMPLEMENTATION<br>${esc(p.guard)}</aside></div></section><section><div class="wrap"><p class="eyebrow">RELATED ROUTES</p><p>${links}</p></div></section></main><footer><div class="wrap">© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH) · <a href="../../identity/">Identity & citation</a> · <a href="../../legal/">Legal & privacy</a></div></footer></body></html>`;
}

for(const [id,p] of Object.entries(shared)){
 const dir=`research/${id}`;mkdirSync(dir,{recursive:true});writeFileSync(`${dir}/index.html`,render(id,p),'utf8');
}
const machine={schema:'metacademy-public-research-indexes/v1',generated:'2026-08-29',indexes:Object.entries(shared).map(([id,p])=>({id,url:`${base}research/${id}/`,title:p.title,status:p.status,guard:p.guard}))};
mkdirSync('discovery',{recursive:true});writeFileSync('discovery/research-program-indexes.json',JSON.stringify(machine,null,2)+'\n','utf8');
console.log('RESEARCH_PROGRAM_INDEXES_BUILD=PASS indexes=3 msl=PUBLIC lineage=PUBLIC system=RESEARCH_CANDIDATE machine=PASS');
