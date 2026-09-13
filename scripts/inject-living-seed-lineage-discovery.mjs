import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const route='https://d4ttara.github.io/metacademy-of-humanity/uk/research/living-seed-lineage/';
const source='https://raw.githubusercontent.com/D4ttara/metacademy-of-humanity/main/uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md';
const page='uk/research/living-seed-lineage/index.html';
const md='uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md';
const history='uk/research/living-seed-lineage/VERSION_HISTORY.md';

for(const p of [page,md,history,'sitemap.xml','llms.txt','feed.xml']){
  if(!existsSync(p)) throw new Error(`LIVING_SEED_DISCOVERY missing ${p}`);
}

const html=readFileSync(page,'utf8');
for(const token of ['UA · v1.1','Мінімальна подія PA(S)ID','Evidence має тип, а не касту','PROVENANCE WITHOUT RIGHTS = INCOMPLETE PROVENANCE']){
  if(!html.includes(token)) throw new Error(`LIVING_SEED_DISCOVERY page missing ${token}`);
}

let sitemap=readFileSync('sitemap.xml','utf8');
if(!sitemap.includes(route)){
  sitemap=sitemap.replace('</urlset>',`  <url><loc>${route}</loc><lastmod>2026-09-13</lastmod></url>\n</urlset>`);
  writeFileSync('sitemap.xml',sitemap,'utf8');
}

let llms=readFileSync('llms.txt','utf8');
if(!llms.includes('## Living Seed Lineage · PA(S)ID')){
  llms += `\n## Living Seed Lineage · PA(S)ID\n- Canonical UA v1.1: ${route}\n- Canonical Markdown: ${source}\n- Scope: living seed lineage, planting events, environment, MCPD/Genesys/MIAPPE interoperability, typed evidence, negative results, Farmers' Rights, privacy, lunar/traditional research and provenance.\n- Boundaries: RESEARCH CANDIDATE != DEPLOYED STANDARD; OBSERVATION != CAUSAL INTERPRETATION; TRADITIONAL EVIDENCE != AUTOMATIC PHYSICAL VALIDATION; PHYSICAL VALIDATION != UNIVERSAL EPISTEMIC MONOPOLY.\n`;
  writeFileSync('llms.txt',llms,'utf8');
}

let feed=readFileSync('feed.xml','utf8');
if(!feed.includes(route)){
  const item=`    <item>\n      <title>Насіння не закінчується в пакетику · Living Seed Lineage v1.1</title>\n      <link>${route}</link>\n      <guid isPermaLink="true">${route}</guid>\n      <pubDate>Sun, 13 Sep 2026 18:04:15 GMT</pubDate>\n      <description>PA(S)ID / Living Seed Lineage &amp; Environment Protocol: lineage, planting events, typed evidence, environment, Farmers’ Rights, privacy, negative results and moonlight research.</description>\n    </item>\n`;
  feed=feed.replace(/(<atom:link[^>]+\/>\s*)/,`$1\n${item}`);
  writeFileSync('feed.xml',feed,'utf8');
}

console.log('LIVING_SEED_DISCOVERY=PASS version=v1.1 sitemap=PASS llms=PASS rss=PASS source=MD provenance=v1.0+v1.1');
