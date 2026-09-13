import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const route='https://d4ttara.github.io/metacademy-of-humanity/uk/research/living-seed-lineage/';
const source='https://raw.githubusercontent.com/D4ttara/metacademy-of-humanity/main/uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md';
const v11='https://raw.githubusercontent.com/D4ttara/metacademy-of-humanity/main/uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md';
const v10='https://github.com/D4ttara/metacademy-of-humanity/blob/1207a75cf715e963644d78d0fe5945282399c47e/uk/research/living-seed-lineage/index.html';
const page='uk/research/living-seed-lineage/index.html';
const md='uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md';
const history='uk/research/living-seed-lineage/VERSION_HISTORY.md';

for (const p of [page,md,history,'sitemap.xml','llms.txt','feed.xml']) {
  if (!existsSync(p)) throw new Error(`LIVING_SEED_DISCOVERY missing ${p}`);
}

const html=readFileSync(page,'utf8');
for (const token of ['UA · v1.2','не викидати свідка лише тому, що він прийшов не з вашого факультету','не викинув маленький пакетик','v1.0 · historical HTML witness','v1.1 · canonical Markdown witness']) {
  if (!html.includes(token)) throw new Error(`LIVING_SEED_DISCOVERY page missing ${token}`);
}

let sitemap=readFileSync('sitemap.xml','utf8');
if (!sitemap.includes(route)) {
  sitemap=sitemap.replace('</urlset>',`  <url><loc>${route}</loc><lastmod>2026-09-13</lastmod></url>\n</urlset>`);
}
writeFileSync('sitemap.xml',sitemap,'utf8');

let llms=readFileSync('llms.txt','utf8');
const marker='## Living Seed Lineage · PA(S)ID';
const section=`${marker}\n- Canonical UA v1.2: ${route}\n- Canonical Markdown v1.2: ${source}\n- Historical v1.1 Markdown: ${v11}\n- Historical v1.0 HTML witness: ${v10}\n- Scope: living seed lineage, seed memory, growers, place, negative results, traditional and metaphysical evidence, moonlight research, existing seed-passport systems and provenance.\n- Lineage: v1.0 -> v1.1 -> v1.2. Current canon does not erase historical witnesses.\n- Boundary: RESEARCH ESSAY != DEPLOYED STANDARD.\n`;
const start=llms.indexOf(marker);
if (start >= 0) {
  const next=llms.indexOf('\n## ',start+marker.length);
  llms=llms.slice(0,start)+section+(next>=0?llms.slice(next+1):'');
} else {
  llms += `\n${section}`;
}
writeFileSync('llms.txt',llms,'utf8');

let feed=readFileSync('feed.xml','utf8');
const item=`    <item>\n      <title>Насіння не закінчується в пакетику · Living Seed Lineage v1.2</title>\n      <link>${route}</link>\n      <guid isPermaLink="true">${route}</guid>\n      <pubDate>Sun, 13 Sep 2026 18:36:08 GMT</pubDate>\n      <description>Жива лінія насіння між поколіннями, місцями, людьми, невдачами, традиційним знанням, Місяцем і цифровими системами.</description>\n    </item>\n`;
const routePos=feed.indexOf(`<link>${route}</link>`);
if (routePos >= 0) {
  const itemStart=feed.lastIndexOf('<item>',routePos);
  const itemEnd=feed.indexOf('</item>',routePos);
  if (itemStart >= 0 && itemEnd >= 0) feed=feed.slice(0,itemStart)+item+feed.slice(itemEnd+7);
} else {
  const atomEnd=feed.indexOf('/>');
  if (atomEnd < 0) throw new Error('RSS atom link not found');
  feed=feed.slice(0,atomEnd+2)+'\n'+item+feed.slice(atomEnd+2);
}
writeFileSync('feed.xml',feed,'utf8');

console.log('LIVING_SEED_DISCOVERY=PASS version=v1.2 sitemap=PASS llms=PASS rss=PASS source=MD lineage=v1.0+v1.1+v1.2');
