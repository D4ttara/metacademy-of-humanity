import { readFileSync, existsSync } from 'node:fs';
const assert=(ok,msg)=>{if(!ok) throw new Error(msg)};
const pages=['start/index.html','uk/start/index.html'];
for(const p of pages){assert(existsSync(p),`missing ${p}`); const h=readFileSync(p,'utf8'); for(const token of ['data-start-here-entry','CollectionPage','Human ↔ AI','knowledge','Semantic','M{Y}OGA','AI critique']){} }
const en=readFileSync('start/index.html','utf8');
const ua=readFileSync('uk/start/index.html','utf8');
for(const [h,label] of [[en,'EN'],[ua,'UA']]){
 for(const id of ['human-ai','knowledge-uncertainty','semantic-systems','life-relation','myoga']) assert(h.includes(`id="${id}"`),`${label} missing trail ${id}`);
 for(const n of ['003','004','006','007','008','010','011','012','013','015','016']) assert(h.includes(`Document ${n}`),`${label} missing Document ${n}`);
 assert(h.includes('application/ld+json'),`${label} missing JSON-LD`);
 assert(h.includes('AI critique') || h.includes('ШІ-критика'),`${label} missing AI critique route`);
 assert(h.includes('github.com/D4ttara/metacademy-of-humanity/issues/'),`${label} missing challenge route`);
}
const machine=JSON.parse(readFileSync('discovery/research-trails.json','utf8'));
assert(machine.schema==='metacademy-research-trails/v1','bad trails schema');
assert(machine.trails.length===5,'expected five research trails');
for(const t of machine.trails){assert(t.documents.length>=2,`trail ${t.id} too short`); for(const d of t.documents){assert(d.url_en&&d.url_ua&&d.discussion,`trail ${t.id} missing document provenance`)}}
for(const [file,token] of [['index.html','data-start-here-entry'],['uk/index.html','data-start-here-entry'],['research/index.html','data-start-here-research-link'],['uk/research/index.html','data-start-here-research-link']]){const h=readFileSync(file,'utf8');assert(h.includes(token),`${file} missing ${token}`)}
const site=readFileSync('sitemap.xml','utf8'); for(const route of ['start/','uk/start/']) assert(site.includes(`https://d4ttara.github.io/metacademy-of-humanity/${route}`),`sitemap missing ${route}`);
const llms=readFileSync('llms.txt','utf8'); assert(llms.includes('## Start Here · Research Trails'),'llms missing Start Here'); assert(llms.includes('discovery/research-trails.json'),'llms missing machine trails');
console.log('START_HERE_VERIFY=PASS trails=5 pages=2 documents=11 machine_json=PASS homepage=PASS research=PASS sitemap=PASS llms=PASS');