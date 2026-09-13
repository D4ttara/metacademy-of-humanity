import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const uaSource='uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md';
const enSource='research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_EN_v1.2.md';
const v11='uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md';
const uaPage='uk/research/living-seed-lineage/index.html';
const enPage='research/living-seed-lineage/index.html';
const history='uk/research/living-seed-lineage/VERSION_HISTORY.md';
const expectedUa='474f895682b12bf7d6642e645ac70695bdeb8dadc4c6b58273d33bcecafe7f20';
const expectedEn='65bce8b3f514afc0eb5404d95f7982a1675d16357c4247bba58a7405bab113e6';
const uaRoute='https://d4ttara.github.io/metacademy-of-humanity/uk/research/living-seed-lineage/';
const enRoute='https://d4ttara.github.io/metacademy-of-humanity/research/living-seed-lineage/';
const norm=s=>s.replace(/\s+/g,' ').trim();
const sha=s=>createHash('sha256').update(norm(s),'utf8').digest('hex');

for(const p of [uaSource,enSource,v11,uaPage,enPage,history]) if(!existsSync(p)) throw new Error(`LIVING_SEED_V12 missing ${p}`);
const uaMd=readFileSync(uaSource,'utf8');
const enMd=readFileSync(enSource,'utf8');
const uaActual=sha(uaMd), enActual=sha(enMd);
if(uaActual!==expectedUa) throw new Error(`LIVING_SEED_V12 UA wording hash mismatch expected=${expectedUa} actual=${uaActual}`);
if(enActual!==expectedEn) throw new Error(`LIVING_SEED_V12 EN wording hash mismatch expected=${expectedEn} actual=${enActual}`);
for(const [code,md] of [['UA',uaMd],['EN',enMd]]) if(/^\s*[-*+]\s+/m.test(md)) throw new Error(`LIVING_SEED_V12 ${code} list syntax survived prose reflow`);

const uaHtml=readFileSync(uaPage,'utf8');
for(const token of ['UA · v1.2','не викидати свідка лише тому, що він прийшов не з вашого факультету.','не викинув маленький пакетик','v1.0 · historical HTML witness','v1.1 · canonical Markdown witness','v1.2 · current canonical Markdown','issues/73']) if(!uaHtml.includes(token)) throw new Error(`LIVING_SEED_V12 UA page missing ${token}`);
const enHtml=readFileSync(enPage,'utf8');
for(const token of ['EN · v1.2','peer-reviewed carrot','neighbour Sergei','administrative personality','did not throw away the little packet','UA v1.2 · current source edition','Українська','issues/73']) if(!enHtml.includes(token)) throw new Error(`LIVING_SEED_V12 EN page missing ${token}`);

const h=readFileSync(history,'utf8');
for(const token of ['v1.0 -> v1.1 -> v1.2','CURRENT CANON != ERASED HISTORY','REFLOW != REWRITE','1207a75cf715e963644d78d0fe5945282399c47e']) if(!h.includes(token)) throw new Error(`LIVING_SEED_V12 history missing ${token}`);

const discovery=readFileSync('scripts/inject-living-seed-lineage-discovery.mjs','utf8');
for(const token of ['Canonical EN v1.2','Canonical UA v1.2','Historical UA v1.1 Markdown','Historical UA v1.0 HTML witness','inject-living-seed-lineage-surfaces.mjs','render-living-seed-lineage-v1.2.mjs']) if(!discovery.includes(token)) throw new Error(`LIVING_SEED_V12 discovery missing ${token}`);

for(const p of ['index.html','research/index.html','updates/index.html','uk/index.html','uk/research/index.html','uk/updates/index.html']){
  const surface=readFileSync(p,'utf8');
  if(!surface.includes('data-living-seed-v1-2')) throw new Error(`LIVING_SEED_V12 surface missing v1.2 card ${p}`);
}
for(const p of ['index.html','research/index.html','updates/index.html']) if(!readFileSync(p,'utf8').includes('Read EN v1.2')) throw new Error(`LIVING_SEED_V12 English surface not linked to EN edition ${p}`);

const sitemap=readFileSync('sitemap.xml','utf8');
const llms=readFileSync('llms.txt','utf8');
const feed=readFileSync('feed.xml','utf8');
for(const route of [uaRoute,enRoute]) if(!sitemap.includes(route)) throw new Error(`LIVING_SEED_V12 sitemap missing ${route}`);
for(const token of ['Canonical EN v1.2','Canonical UA v1.2','UA v1.0 -> v1.1 -> v1.2']) if(!llms.includes(token)) throw new Error(`LIVING_SEED_V12 llms missing ${token}`);
for(const token of ['A Seed Doesn’t End in the Packet · EN v1.2','Насіння не закінчується в пакетику · UA v1.2',uaRoute,enRoute]) if(!feed.includes(token)) throw new Error(`LIVING_SEED_V12 RSS missing ${token}`);

console.log(`LIVING_SEED_V12_VERIFY=PASS UA_sha256=${uaActual} EN_sha256=${enActual} editions=UA+EN reflow=PARAGRAPH lineage=PRESERVED surfaces=6 sitemap=PASS llms=PASS rss=PASS issue=73`);
