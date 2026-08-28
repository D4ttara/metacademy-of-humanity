import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const base='https://d4ttara.github.io/metacademy-of-humanity/';
const canonical='MET[Ȧ]CADEMY OF HUMANITY';
const aliases=['METACADEMY OF HUMANITY','MetaAcademy of Humanity','Metacademy of Humanity','METACADEMY','MoH'];
const fail=m=>{throw new Error(m)};
const identity=JSON.parse(readFileSync('identity.json','utf8'));
if(identity.canonicalName!==canonical)fail('identity.json canonicalName mismatch');
if(identity.machineSafeName!=='METACADEMY OF HUMANITY')fail('identity.json machine-safe name missing');
for(const a of aliases)if(!identity.aliases.includes(a))fail(`identity.json missing alias ${a}`);
for(const p of ['identity/index.html','uk/identity/index.html']){const h=readFileSync(p,'utf8');for(const token of [canonical,'METACADEMY OF HUMANITY','identity.json','CITATION.cff','application/ld+json'])if(!h.includes(token))fail(`${p} missing ${token}`);}
const citation=readFileSync('CITATION.cff','utf8');for(const token of ['cff-version: 1.2.0','Ievgen','Karogod','MET[Ȧ]CADEMY OF HUMANITY','https://d4ttara.github.io/metacademy-of-humanity/'])if(!citation.includes(token))fail(`CITATION.cff missing ${token}`);
const sitemap=readFileSync('sitemap.xml','utf8');for(const route of ['identity/','uk/identity/'])if(!sitemap.includes(base+route))fail(`sitemap missing ${route}`);
const llms=readFileSync('llms.txt','utf8');for(const token of ['## Canonical identity','Machine-safe name: METACADEMY OF HUMANITY','identity.json','MetaAcademy of Humanity'])if(!llms.includes(token))fail(`llms missing ${token}`);
const walk=d=>readdirSync(d).flatMap(n=>{const p=join(d,n);const s=statSync(p);return s.isDirectory()&&!['.git','node_modules'].includes(n)?walk(p):[p]});
const pages=walk('.').filter(p=>p.endsWith('index.html'));
let identityLinks=0;
for(const p of pages){const h=readFileSync(p,'utf8');if(!h.includes('name="application-name"'))fail(`${p} missing application-name`);if(!h.includes('rel="describedby"')||!h.includes('identity.json'))fail(`${p} missing identity describedby`);if(!h.includes(`${base}#organization`))fail(`${p} missing canonical organization @id`);if(/<footer[\s>]/i.test(h)){if(!h.includes('data-brand-identity-link'))fail(`${p} missing visible identity link`);identityLinks++;}}
console.log(`BRAND_IDENTITY_VERIFY=PASS pages=${pages.length} footer_links=${identityLinks} aliases=${aliases.length} identity_json=PASS citation_cff=PASS sitemap=PASS llms=PASS organization_id=PASS`);
