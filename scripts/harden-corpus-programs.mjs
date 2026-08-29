import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const base='https://d4ttara.github.io/metacademy-of-humanity/';
const editions=[
 'documents/003-life-as-organization/en/index.html','documents/003-life-as-organization/index.html',
 'documents/004-when-science-reaches-a-plateau/en/index.html','documents/004-when-science-reaches-a-plateau/ua/index.html',
 'documents/006-myoga-jyotish/index.html',
 'documents/007-after-vibe-coding/en/index.html','documents/007-after-vibe-coding/ua/index.html',
 'documents/008-the-interface-that-knows-you/en/index.html','documents/008-the-interface-that-knows-you/ua/index.html',
 'documents/009-elon-musk-mark-zuckerberg-ai-control/en/index.html','documents/009-elon-musk-mark-zuckerberg-ai-control/ua/index.html',
 'documents/010-manifestation-time-genesis-time/en/index.html','documents/010-manifestation-time-genesis-time/ua/index.html',
 'documents/011-the-third-body/en/index.html','documents/011-the-third-body/ua/index.html',
 'documents/012-myoga-astrology-overview/en/index.html','documents/012-myoga-astrology-overview/ua/index.html',
 'documents/013-room-that-answers/en/index.html','documents/013-room-that-answers/ua/index.html',
 'documents/014-right-to-see-the-consequence/en/index.html','documents/014-right-to-see-the-consequence/ua/index.html',
 'documents/015-polytypic-thinking/en/index.html','documents/015-polytypic-thinking/ua/index.html',
 'documents/016-right-to-a-first-chance/en/index.html','documents/016-right-to-a-first-chance/ua/index.html'
];

let headPrev=0,headNext=0;
for(const path of editions){
 if(!existsSync(path)) throw new Error(`missing canonical edition ${path}`);
 let html=readFileSync(path,'utf8');
 const rail=html.match(/<section class="corpus-rail"[\s\S]*?<\/section>/)?.[0] || '';
 const prev=rail.match(/<a rel="prev" href="([^"]+)"/i)?.[1];
 const next=rail.match(/<a rel="next" href="([^"]+)"/i)?.[1];
 if(prev && !html.includes('<link rel="prev"')){html=html.replace('</head>',`<link rel="prev" href="${prev}"></head>`);headPrev++}
 if(next && !html.includes('<link rel="next"')){html=html.replace('</head>',`<link rel="next" href="${next}"></head>`);headNext++}
 writeFileSync(path,html,'utf8');
}

// The Ukrainian home page lives at /uk/. Its local corpus/program routes must
// stay inside /uk/ rather than escaping to the English root.
{
 const path='uk/index.html';
 let html=readFileSync(path,'utf8');
 const m=html.match(/<section data-corpus-programs-entry="true">[\s\S]*?<\/section>/);
 if(!m) throw new Error('uk/index.html missing corpus/program entry');
 const fixed=m[0]
  .replace('href="../corpus/"','href="corpus/"')
  .replace('href="../programs/"','href="programs/"');
 html=html.replace(m[0],fixed);
 writeFileSync(path,html,'utf8');
}

function hardenStart(path,ua){
 let html=readFileSync(path,'utf8');
 const re=/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
 let changed=false;
 html=html.replace(re,(whole,jsonText)=>{
  let obj; try{obj=JSON.parse(jsonText)}catch{return whole}
  if(obj?.['@type']!=='CollectionPage' || obj?.mainEntity?.['@type']!=='ItemList') return whole;
  const list=Array.isArray(obj.mainEntity.itemListElement)?obj.mainEntity.itemListElement:[];
  if(!list.some(x=>String(x?.url||'').includes('#power-agency-access'))){
   list.push({'@type':'ListItem',position:6,name:ua?'Влада, агентність і доступ':'Power, Agency & Access',url:`${base}${ua?'uk/':''}start/#power-agency-access`});
  }
  obj.mainEntity.itemListElement=list;
  obj.mainEntity.numberOfItems=6;
  changed=true;
  return `<script type="application/ld+json">${JSON.stringify(obj)}</script>`;
 });
 if(!changed) throw new Error(`${path} Start Here CollectionPage JSON-LD not found`);
 writeFileSync(path,html,'utf8');
}
hardenStart('start/index.html',false);
hardenStart('uk/start/index.html',true);

console.log(`CORPUS_PROGRAMS_HARDEN=PASS editions=${editions.length} head_prev_added=${headPrev} head_next_added=${headNext} ua_home_routes=PASS start_jsonld_items=6`);
