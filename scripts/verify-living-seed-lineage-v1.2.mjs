import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const source='uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md';
const v11='uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md';
const page='uk/research/living-seed-lineage/index.html';
const history='uk/research/living-seed-lineage/VERSION_HISTORY.md';
const expected='474f895682b12bf7d6642e645ac70695bdeb8dadc4c6b58273d33bcecafe7f20';
const norm=s=>s.replace(/\s+/g,' ').trim();
const sha=s=>createHash('sha256').update(norm(s),'utf8').digest('hex');

for(const p of [source,v11,page,history]) if(!existsSync(p)) throw new Error(`LIVING_SEED_V12 missing ${p}`);
const md=readFileSync(source,'utf8');
const actual=sha(md);
if(actual!==expected) throw new Error(`LIVING_SEED_V12 approved wording hash mismatch expected=${expected} actual=${actual}`);
if(/^\s*[-*+]\s+/m.test(md)) throw new Error('LIVING_SEED_V12 list syntax survived approved reflow');

const html=readFileSync(page,'utf8');
for(const token of [
  'UA · v1.2',
  'не викидати свідка лише тому, що він прийшов не з вашого факультету.',
  'не викинув маленький пакетик',
  'v1.0 · historical HTML witness',
  'v1.1 · canonical Markdown witness',
  'v1.2 · current canonical Markdown',
  'issues/73'
]) if(!html.includes(token)) throw new Error(`LIVING_SEED_V12 page missing ${token}`);

const h=readFileSync(history,'utf8');
for(const token of ['v1.0 -> v1.1 -> v1.2','CURRENT CANON != ERASED HISTORY','REFLOW != REWRITE','1207a75cf715e963644d78d0fe5945282399c47e']) if(!h.includes(token)) throw new Error(`LIVING_SEED_V12 history missing ${token}`);

const discovery=readFileSync('scripts/inject-living-seed-lineage-discovery.mjs','utf8');
for(const token of ['Canonical UA v1.2','Historical v1.1 Markdown','Historical v1.0 HTML witness','inject-living-seed-lineage-surfaces.mjs']) if(!discovery.includes(token)) throw new Error(`LIVING_SEED_V12 discovery missing ${token}`);

console.log(`LIVING_SEED_V12_VERIFY=PASS normalized_sha256=${actual} wording=APPROVED reflow=ONLY lineage=v1.0+v1.1+v1.2 issue=73`);
