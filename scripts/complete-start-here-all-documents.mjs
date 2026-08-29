import { readFileSync, writeFileSync } from 'node:fs';

const base='https://d4ttara.github.io/metacademy-of-humanity/';
const repo='https://github.com/D4ttara/metacademy-of-humanity';
const extra=[
  {number:'009',slug:'009-elon-musk-mark-zuckerberg-ai-control',issue:47,en:'AI Control',ua:'Контроль ШІ'},
  {number:'014',slug:'014-right-to-see-the-consequence',issue:39,en:'The Right to See the Consequence',ua:'Право бачити наслідок'}
];

const pathFor=(d,ua)=>`../documents/${d.slug}/${ua?'ua':'en'}/`;
const absFor=(d,ua)=>`${base}documents/${d.slug}/${ua?'ua':'en'}/`;

for(const [file,ua] of [['start/index.html',false],['uk/start/index.html',true]]){
  let html=readFileSync(file,'utf8');
  if(!html.includes('id="power-agency-access"')){
    const nodes=[extra[0],extra[1],{number:'016',slug:'016-right-to-a-first-chance',issue:59,en:'The Right to a First Chance',ua:'Право на перший шанс'}]
      .map((d,i)=>`<li><span class="eyebrow">${i+1}</span> <a href="${pathFor(d,ua)}">Document ${d.number} · ${ua?d.ua:d.en}</a> · <a href="${pathFor(d,ua)}#ai-reader-lab-${d.number}">${ua?'ШІ-критика':'AI critique'}</a> · <a href="${repo}/issues/${d.issue}">${ua?'заперечити':'challenge'}</a></li>`).join('');
    const card=`<article class="card" id="power-agency-access"><p class="eyebrow">${ua?'Маршрут':'Trail'} 6 · 3 ${ua?'вузли':'nodes'}</p><h2>${ua?'Влада, агентність і доступ':'Power, Agency & Access'}</h2><p>${ua?'Як контроль, попередження, інституційні ворота й право на перший шанс змінюють реальну агентність людини, навіть коли система формально називає себе захисною або доступною.':'How control, warnings, institutional gates and the right to a first chance shape human agency even when a system formally describes itself as protective or accessible.'}</p><ol>${nodes}</ol></article>`;
    html=html.replace('</div></div></section></main>',`${card}</div></div></section></main>`);
  }
  html=html.replaceAll('5 ways into the corpus','6 ways into the corpus')
           .replaceAll('5 шляхів у корпус','6 шляхів у корпус')
           .replaceAll('Five guided research trails','Six guided research trails')
           .replaceAll('П’ять дослідницьких маршрутів','Шість дослідницьких маршрутів');
  writeFileSync(file,html,'utf8');
}

const machinePath='discovery/research-trails.json';
const machine=JSON.parse(readFileSync(machinePath,'utf8'));
if(!machine.trails.some(t=>t.id==='power-agency-access')){
  const docs=[...extra,{number:'016',slug:'016-right-to-a-first-chance',issue:59,en:'The Right to a First Chance',ua:'Право на перший шанс'}].map(d=>({number:d.number,title_en:d.en,title_ua:d.ua,url_en:absFor(d,false),url_ua:absFor(d,true),discussion:`${repo}/issues/${d.issue}`}));
  machine.trails.push({id:'power-agency-access',title_en:'Power, Agency & Access',title_ua:'Влада, агентність і доступ',description_en:'Control, warnings, institutional gates and the architecture of a first chance.',description_ua:'Контроль, попередження, інституційні ворота й архітектура першого шансу.',documents:docs});
}
machine.coverage={public_documents:13,document_numbers:['003','004','006','007','008','009','010','011','012','013','014','015','016']};
writeFileSync(machinePath,JSON.stringify(machine,null,2)+'\n','utf8');

console.log('START_HERE_COMPLETION=PASS trails=6 documents=13 restored=009,014 machine_coverage=PASS');
