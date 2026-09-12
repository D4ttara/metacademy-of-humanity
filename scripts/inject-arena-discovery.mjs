import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const SITE='https://d4ttara.github.io/metacademy-of-humanity';
const routes=[
  {
    url:`${SITE}/arena/`,
    title:'AI Arena · MET[Ȧ]CADEMY OF HUMANITY',
    description:'A source-aware bridge from public MET[Ȧ]CADEMY publications to external model comparison, critique, image and video evaluation surfaces, with explicit AI provenance boundaries.',
    language:'en',
    type:'CollectionPage',
    markdown:null
  },
  {
    url:`${SITE}/uk/arena/`,
    title:'ШІ Арена · MET[Ȧ]CADEMY OF HUMANITY',
    description:'Source-aware міст від публічних матеріалів MET[Ȧ]CADEMY до зовнішнього порівняння моделей, критики, зображень і відео з явними межами походження ШІ-відповідей.',
    language:'uk',
    type:'CollectionPage',
    markdown:null
  }
];

const must=(cond,msg)=>{ if(!cond) throw new Error(msg); };
for(const p of ['arena/index.html','uk/arena/index.html']) must(existsSync(p),`missing Arena page: ${p}`);

let changed=0;
if(existsSync('ai-index.json')){
  const index=JSON.parse(readFileSync('ai-index.json','utf8'));
  must(Array.isArray(index.entries),'ai-index entries missing');
  const byUrl=new Map(index.entries.map(e=>[e.url,e]));
  for(const route of routes) byUrl.set(route.url,{...(byUrl.get(route.url)||{}),...route});
  const next=[...byUrl.values()].sort((a,b)=>String(a.url).localeCompare(String(b.url)));
  if(JSON.stringify(next)!==JSON.stringify(index.entries)){
    index.entries=next;
    writeFileSync('ai-index.json',JSON.stringify(index,null,2)+'\n','utf8');
    changed++;
  }
}

if(existsSync('sitemap.xml')){
  let xml=readFileSync('sitemap.xml','utf8');
  const before=xml;
  for(const route of routes){
    if(!xml.includes(`<loc>${route.url}</loc>`)) xml=xml.replace(/\s*<\/urlset>\s*$/i,`\n  <url><loc>${route.url}</loc></url>\n</urlset>\n`);
  }
  if(xml!==before){ writeFileSync('sitemap.xml',xml,'utf8'); changed++; }
}

if(existsSync('llms-full.txt')){
  let llms=readFileSync('llms-full.txt','utf8');
  const before=llms;
  const lines=[
    `- [AI Arena](${SITE}/arena/): source-aware bridge to external model critique, image and video evaluation surfaces with provenance boundaries.`,
    `- [ШІ Арена](${SITE}/uk/arena/): source-aware міст до зовнішніх моделей із provenance-паспортами для майбутніх AI Peer Notes.`
  ];
  const missing=lines.filter((line,i)=>!llms.includes(routes[i].url));
  if(missing.length){
    llms=llms.replace(/\s*$/,'')+'\n\n## AI Arena\n\n'+missing.join('\n')+'\n';
    writeFileSync('llms-full.txt',llms,'utf8'); changed++;
  }
}

console.log(`ARENA_DISCOVERY_INJECT=PASS routes=${routes.length} changed_surfaces=${changed} public_api=NOT_ASSUMED provenance=AI_PEER_NOTES_V1`);
