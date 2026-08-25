import { readFileSync, writeFileSync } from 'node:fs';

const base='https://d4ttara.github.io/metacademy-of-humanity/';
const issue=n=>`https://github.com/D4ttara/metacademy-of-humanity/issues/${n}`;
const docs={
 '015':{issue:58,slug:'015-polytypic-thinking',en:'Polytypic Thinking',ua:'Політипічне мислення',topics:['artificial-intelligence','human-ai','epistemology','agency-and-behavior']},
 '016':{issue:59,slug:'016-right-to-a-first-chance',en:'The Right to a First Chance',ua:'Право на перший шанс',topics:['epistemology','agency-and-behavior']}
};
const topicNames={
 'artificial-intelligence':{en:'Artificial Intelligence',ua:'Штучний інтелект'},
 'human-ai':{en:'Human ↔ AI',ua:'Людина ↔ AI'},
 'epistemology':{en:'Epistemology & Research Method',ua:'Епістемологія й метод дослідження'},
 'agency-and-behavior':{en:'Agency, Behavior & Care',ua:'Агентність, поведінка й турбота'}
};
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

let topicCards=0,jsonParts=0,articleStrips=0;
for(const [number,d] of Object.entries(docs)){
 for(const lang of ['en','ua']){
  for(const topic of d.topics){
   const file=lang==='ua'?`uk/topics/${topic}/index.html`:`topics/${topic}/index.html`;
   let html=readFileSync(file,'utf8');
   if(!html.includes(`data-taxonomy-document="${number}"`)){
    const href=lang==='ua'?`../../../documents/${d.slug}/ua/`:`../../documents/${d.slug}/en/`;
    const read=lang==='ua'?'Читати':'Read'; const q=lang==='ua'?'Питання до тексту':'Reader question'; const ai=lang==='ua'?'ШІ-критика':'AI critique';
    const card=`<article class="card document-card" data-taxonomy-document="${number}"><div><p class="eyebrow">Document ${number}</p><h3>${esc(d[lang])}</h3></div><p><a href="${href}">${read} →</a> · <a href="${issue(d.issue)}">${q} →</a> · <a href="${href}#ai-reader-lab-${number}">${ai} →</a></p></article>`;
    const marker='</div><p class="topic-directory">';
    if(!html.includes(marker)) throw new Error(`Topic card marker missing: ${file}`);
    html=html.replace(marker,`${card}${marker}`); topicCards++;
   }
   const scripts=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
   const collection=scripts.find(m=>m[1].includes('CollectionPage'));
   if(collection){
    const data=JSON.parse(collection[1]); data.hasPart=Array.isArray(data.hasPart)?data.hasPart:[];
    const url=`${base}documents/${d.slug}/${lang==='ua'?'ua/':'en/'}`;
    if(!data.hasPart.some(x=>x?.url===url)){data.hasPart.push({'@type':'Article',name:d[lang],url}); jsonParts++; const replacement=`<script type="application/ld+json">${JSON.stringify(data)}</script>`; html=html.slice(0,collection.index)+replacement+html.slice(collection.index+collection[0].length);}
   }
   writeFileSync(file,html,'utf8');
  }

  const article=`documents/${d.slug}/${lang==='ua'?'ua':'en'}/index.html`;
  let html=readFileSync(article,'utf8');
  if(!html.includes(`data-search-taxonomy="true"`)){
   const links=d.topics.map(t=>`<a href="../../../${lang==='ua'?'uk/':''}topics/${t}/">${esc(topicNames[t][lang])}</a>`).join(' · ');
   const strip=`<nav class="article-topic-strip" data-search-taxonomy="true" aria-label="${lang==='ua'?'Теми дослідження':'Research topics'}"><span>${lang==='ua'?'Теми':'Topics'}: </span>${links}</nav>`;
   const marker='<section class="reader-response"'; const at=html.indexOf(marker);
   if(at>=0) html=html.slice(0,at)+strip+'\n'+html.slice(at); else html=html.replace('</main>',strip+'\n</main>'); articleStrips++;
  }
  const tags=d.topics.filter(t=>!html.includes(`property="article:tag" content="${esc(topicNames[t][lang])}"`)).map(t=>`<meta property="article:tag" content="${esc(topicNames[t][lang])}">`).join('');
  if(tags){if(!html.includes('</head>')) throw new Error(`Missing </head>: ${article}`); html=html.replace('</head>',tags+'</head>');}
  writeFileSync(article,html,'utf8');
 }
}
console.log(`SEARCH_TAXONOMY_EXTENSION=PASS documents=015,016 topic_cards=${topicCards} jsonld_parts=${jsonParts} article_strips=${articleStrips} ai_links=PASS`);
