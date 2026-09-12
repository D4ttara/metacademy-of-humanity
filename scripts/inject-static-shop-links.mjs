import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const STORE='https://payhip.com/dattara';
const roots=['index.html','manifesto','manifestos','documents','research','science-aperture','fields','library','books','shop','arena','participate','updates','support','legal','uk','topics','start','corpus','programs','questions','memory','identity','discover'];
const skip=new Set(['source','source_parts','node_modules','.git']);
const walk=p=>{
  if(!existsSync(p)) return [];
  if(statSync(p).isFile()) return p.endsWith('.html')?[p]:[];
  return readdirSync(p).flatMap(n=>skip.has(n)?[]:walk(join(p,n)));
};

let changed=0,seen=0;
for(const file of [...new Set(roots.flatMap(walk))]){
  let html=readFileSync(file,'utf8');
  if(!/<nav[^>]*class=["'][^"']*\bnav\b[^"']*["'][^>]*>/i.test(html)) continue;
  seen++;
  if(/class=["'][^"']*\bnav-shop\b/i.test(html)) continue;
  const uk=/<html[^>]*lang=["']uk/i.test(html);
  const link=`<a class="nav-shop" href="${STORE}" rel="external noopener noreferrer">${uk?'Магазин ↗':'Shop ↗'}</a>`;
  if(/<span class=["']language-switch["']>/i.test(html)) html=html.replace(/<span class=["']language-switch["']>/i,link+'<span class="language-switch">');
  else html=html.replace(/<\/nav>/i,link+'</nav>');
  writeFileSync(file,html,'utf8'); changed++;
}
console.log(`STATIC_SHOP_NAV=PASS nav_pages=${seen} changed=${changed} store=${STORE}`);
