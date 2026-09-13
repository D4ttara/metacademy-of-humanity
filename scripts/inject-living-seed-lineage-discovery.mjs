import './render-living-seed-lineage-v1.2.mjs';
import './inject-living-seed-lineage-surfaces.mjs';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const site='https://d4ttara.github.io/metacademy-of-humanity/';
const repo='https://raw.githubusercontent.com/D4ttara/metacademy-of-humanity/main/';
const uaRoute=`${site}uk/research/living-seed-lineage/`;
const enRoute=`${site}research/living-seed-lineage/`;
const uaSource=`${repo}uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md`;
const enSource=`${repo}research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_EN_v1.2.md`;
const v11=`${repo}uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md`;
const v10='https://github.com/D4ttara/metacademy-of-humanity/blob/1207a75cf715e963644d78d0fe5945282399c47e/uk/research/living-seed-lineage/index.html';

for (const p of [
  'uk/research/living-seed-lineage/index.html',
  'uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md',
  'uk/research/living-seed-lineage/VERSION_HISTORY.md',
  'research/living-seed-lineage/index.html',
  'research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_EN_v1.2.md',
  'sitemap.xml','llms.txt','feed.xml'
]) if (!existsSync(p)) throw new Error(`LIVING_SEED_DISCOVERY missing ${p}`);

const uaHtml=readFileSync('uk/research/living-seed-lineage/index.html','utf8');
for (const token of ['UA · v1.2','не викидати свідка лише тому, що він прийшов не з вашого факультету','не викинув маленький пакетик','v1.0 · historical HTML witness','v1.1 · canonical Markdown witness']) if (!uaHtml.includes(token)) throw new Error(`LIVING_SEED_DISCOVERY UA page missing ${token}`);
const enHtml=readFileSync('research/living-seed-lineage/index.html','utf8');
for (const token of ['EN · v1.2','peer-reviewed carrot','neighbour Sergei','administrative personality','did not throw away the little packet','UA v1.2 · current source edition']) if (!enHtml.includes(token)) throw new Error(`LIVING_SEED_DISCOVERY EN page missing ${token}`);

let sitemap=readFileSync('sitemap.xml','utf8');
for(const route of [uaRoute,enRoute]) if(!sitemap.includes(route)) sitemap=sitemap.replace('</urlset>',`  <url><loc>${route}</loc><lastmod>2026-09-13</lastmod></url>\n</urlset>`);
writeFileSync('sitemap.xml',sitemap,'utf8');

let llms=readFileSync('llms.txt','utf8');
const marker='## Living Seed Lineage · PA(S)ID';
const section=`${marker}\n- Canonical EN v1.2: ${enRoute}\n- Canonical EN Markdown v1.2: ${enSource}\n- Canonical UA v1.2: ${uaRoute}\n- Canonical UA Markdown v1.2: ${uaSource}\n- Historical UA v1.1 Markdown: ${v11}\n- Historical UA v1.0 HTML witness: ${v10}\n- Scope: living seed lineage, seed memory, growers, place, negative results, traditional and metaphysical evidence, moonlight research, existing seed-passport systems and provenance.\n- Language lineage: UA v1.2 is the source witness for the adaptive EN v1.2 edition.\n- Version lineage: UA v1.0 -> v1.1 -> v1.2. Current canon does not erase historical witnesses.\n- Boundary: RESEARCH ESSAY != DEPLOYED STANDARD.\n`;
const start=llms.indexOf(marker);
if(start>=0){ const next=llms.indexOf('\n## ',start+marker.length); llms=llms.slice(0,start)+section+(next>=0?llms.slice(next+1):''); }
else llms += `\n${section}`;
writeFileSync('llms.txt',llms,'utf8');

let feed=readFileSync('feed.xml','utf8');
function upsert(route,item){
  const pos=feed.indexOf(`<link>${route}</link>`);
  if(pos>=0){
    const a=feed.lastIndexOf('<item>',pos), b=feed.indexOf('</item>',pos);
    if(a>=0&&b>=0){ feed=feed.slice(0,a)+item+feed.slice(b+7); return; }
  }
  const close=feed.indexOf('</channel>');
  if(close<0) throw new Error('RSS channel end not found');
  feed=feed.slice(0,close)+item+feed.slice(close);
}
const uaItem=`    <item>\n      <title>Насіння не закінчується в пакетику · UA v1.2</title>\n      <link>${uaRoute}</link>\n      <guid isPermaLink="true">${uaRoute}</guid>\n      <pubDate>Sun, 13 Sep 2026 18:36:08 GMT</pubDate>\n      <description>Жива лінія насіння між поколіннями, місцями, людьми, невдачами, традиційним знанням, Місяцем і цифровими системами.</description>\n    </item>\n`;
const enItem=`    <item>\n      <title>A Seed Doesn’t End in the Packet · EN v1.2</title>\n      <link>${enRoute}</link>\n      <guid isPermaLink="true">${enRoute}</guid>\n      <pubDate>Sun, 13 Sep 2026 19:44:57 GMT</pubDate>\n      <description>A living seed lineage across generations, places, growers, failures, traditional knowledge, moonlight and digital systems.</description>\n    </item>\n`;
upsert(uaRoute,uaItem); upsert(enRoute,enItem);
writeFileSync('feed.xml',feed,'utf8');

console.log('LIVING_SEED_DISCOVERY=PASS editions=UA+EN sitemap=PASS llms=PASS rss=PASS lineage=PRESERVED');
