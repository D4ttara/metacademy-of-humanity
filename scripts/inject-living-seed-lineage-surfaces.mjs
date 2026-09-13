import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const jobs=[
  {path:'uk/index.html',href:'research/living-seed-lineage/',uk:true,label:'Нове дослідження · 13 вересня 2026 · UA v1.2'},
  {path:'uk/research/index.html',href:'living-seed-lineage/',uk:true,label:'Research Essay · UA · v1.2'},
  {path:'uk/updates/index.html',href:'../research/living-seed-lineage/',uk:true,label:'13 вересня 2026 · Research Essay · UA v1.2'},
  {path:'index.html',href:'research/living-seed-lineage/',uk:false,label:'New research · 13 September 2026 · EN v1.2'},
  {path:'research/index.html',href:'living-seed-lineage/',uk:false,label:'Research Essay · EN · v1.2'},
  {path:'updates/index.html',href:'../research/living-seed-lineage/',uk:false,label:'13 September 2026 · Research Essay · EN v1.2'}
];

for(const j of jobs){
  if(!existsSync(j.path)) throw new Error(`LIVING_SEED_SURFACE missing ${j.path}`);
  let html=readFileSync(j.path,'utf8');
  if(!html.includes('</main>')) throw new Error(`LIVING_SEED_SURFACE no main end ${j.path}`);
  const block=j.uk
    ? `<section data-living-seed-v1-2><div class="wrap"><p class="eyebrow">${j.label}</p><h2>Насіння не закінчується в пакетику</h2><p>Про родовід помідора, пам’ять землі, Місяць, невдалі врожаї й дивну звичку людства втрачати найцікавіше саме тоді, коли воно потрапляє в базу даних.</p><div class="actions"><a class="button primary" href="${j.href}">Читати v1.2 →</a><a class="button" href="https://github.com/D4ttara/metacademy-of-humanity/issues/73">Обговорити →</a></div></div></section>`
    : `<section data-living-seed-v1-2><div class="wrap"><p class="eyebrow">${j.label}</p><h2>A Seed Doesn’t End in the Packet</h2><p>On a tomato’s pedigree, the memory of soil, the Moon, failed harvests, and humanity’s habit of losing the most interesting part the moment it enters a database.</p><div class="actions"><a class="button primary" href="${j.href}">Read EN v1.2 →</a><a class="button" href="https://github.com/D4ttara/metacademy-of-humanity/issues/73">Discussion →</a></div></div></section>`;
  if(/<section data-living-seed-v1-2>[\s\S]*?<\/section>/.test(html)) html=html.replace(/<section data-living-seed-v1-2>[\s\S]*?<\/section>/,block);
  else html=html.replace('</main>',`${block}</main>`);
  writeFileSync(j.path,html,'utf8');
}

console.log('LIVING_SEED_SURFACES=PASS home=EN_UA research=EN_UA updates=EN_UA editions=UA+EN');
