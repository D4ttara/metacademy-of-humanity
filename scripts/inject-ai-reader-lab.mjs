import { readFileSync, writeFileSync } from 'node:fs';

const issue015='https://github.com/D4ttara/metacademy-of-humanity/issues/58';
const issue016='https://github.com/D4ttara/metacademy-of-humanity/issues/59';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const client='<script src="../../../assets/js/ai-reader-lab.js" defer></script>';

const jobs=[
  {
    path:'documents/015-polytypic-thinking/en/index.html', number:'015', jump:'AI critique',
    eyebrow:'AI READER LAB', title:'Take this essay to your AI',
    note:'No new account, plugin or comment service is required here. Copy a critical reading prompt, use it in the AI you already have, then bring back only the counterexample or revision that survived the conversation.',
    prompt:'Read MET[Ȧ]CADEMY Document 015 “Polytypic Thinking” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, one real counterexample to “type is a projection, not an essence”, one case where typing is genuinely useful, and a defensible boundary for the right to be statistically inconvenient. Separate evidence from interpretation. If you have web access, verify the cited sources and say exactly where the essay overreaches.',
    copy:'Copy critical prompt', share:'Share article', related:'Next: when classification becomes access control', relatedHref:'../../016-right-to-a-first-chance/en/', returnLabel:'Bring a counterexample back', issue:issue015
  },
  {
    path:'documents/015-polytypic-thinking/ua/index.html', number:'015', jump:'ШІ-критика',
    eyebrow:'ШІ-ЛАБОРАТОРІЯ ЧИТАЧА', title:'Візьми цю статтю у свій ШІ',
    note:'Тут не потрібні новий акаунт, плагін чи окремий сервіс коментарів. Скопіюй критичний промпт у той ШІ, яким уже користуєшся, а назад принеси лише контрприклад або правку, що пережили розмову.',
    prompt:'Прочитай MET[Ȧ]CADEMY Document 015 «Політипічне мислення» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце, один реальний контрприклад до принципу «тип є проєкцією, а не сутністю», один випадок, де типізація справді корисна, і захищену аргументами межу права бути статистично незручною. Відділяй доказ від інтерпретації. Якщо маєш веб-доступ, перевір джерела й точно вкажи, де текст перебільшує.',
    copy:'Копіювати критичний промпт', share:'Поділитися статтею', related:'Далі: коли класифікація стає контролем доступу', relatedHref:'../../016-right-to-a-first-chance/ua/', returnLabel:'Принести контрприклад назад', issue:issue015
  },
  {
    path:'documents/016-right-to-a-first-chance/en/index.html', number:'016', jump:'AI critique',
    eyebrow:'AI READER LAB', title:'Take this essay to your AI',
    note:'Use the AI you already have as an adversarial reading partner, not as an applause machine. The prompt asks it to search for the place where the essay fails, then the public thread remains available if you want to return the result.',
    prompt:'Read MET[Ȧ]CADEMY Document 016 “The Right to a First Chance” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, one counterexample where a strict entry barrier genuinely protects a person or shared resource better than a small safe first chance, and one human-centred redesign of a real system. Separate evidence from interpretation. If you have web access, verify the cited sources and identify where the essay underestimates risk.',
    copy:'Copy critical prompt', share:'Share article', related:'Conceptual sibling: how a system decides what kind of person it sees', relatedHref:'../../015-polytypic-thinking/en/', returnLabel:'Bring a counterexample back', issue:issue016
  },
  {
    path:'documents/016-right-to-a-first-chance/ua/index.html', number:'016', jump:'ШІ-критика',
    eyebrow:'ШІ-ЛАБОРАТОРІЯ ЧИТАЧА', title:'Візьми цю статтю у свій ШІ',
    note:'Використай той ШІ, який уже маєш, як критичного співчитача, а не машину оплесків. Промпт спеціально шукає місце, де есе ламається; якщо результат вартий публічної пам’яті, гілка лишається поруч.',
    prompt:'Прочитай MET[Ȧ]CADEMY Document 016 «Право на перший шанс» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце, один контрприклад, де жорсткий бар’єр справді краще захищає людину або спільний ресурс, ніж малий безпечний перший шанс, і запропонуй один людиноорієнтований redesign реальної системи. Відділяй доказ від інтерпретації. Якщо маєш веб-доступ, перевір джерела й точно вкажи, де текст недооцінює ризик.',
    copy:'Копіювати критичний промпт', share:'Поділитися статтею', related:'Споріднений текст: як система вирішує, який тип людини вона бачить', relatedHref:'../../015-polytypic-thinking/ua/', returnLabel:'Принести контрприклад назад', issue:issue016
  }
];

let changed=0;
for(const job of jobs){
  let html=readFileSync(job.path,'utf8');
  let touched=false;
  const anchor=`ai-reader-lab-${job.number}`;
  if(!html.includes('ai-reader-lab.js')){
    if(!html.includes('</head>')) throw new Error(`</head> missing: ${job.path}`);
    html=html.replace('</head>',client+'</head>');
    touched=true;
  }
  if(!html.includes('data-ai-reader-jump')){
    const re=/(<div class="edition-links">)([\s\S]*?)(<\/div>)/;
    if(!re.test(html)) throw new Error(`edition links missing: ${job.path}`);
    html=html.replace(re,(whole,open,body,close)=>`${open}${body}<a class="button" data-ai-reader-jump href="#${anchor}">${esc(job.jump)}</a>${close}`);
    touched=true;
  }
  if(!html.includes(`data-ai-reader-lab="${job.number}"`)){
    const block=`\n<section id="${anchor}" class="ai-reader-lab" data-ai-reader-lab="${job.number}"><div class="wrap ai-reader-lab-inner"><p class="eyebrow">${esc(job.eyebrow)}</p><h2>${esc(job.title)}</h2><p class="ai-reader-note">${esc(job.note)}</p><pre class="ai-reader-prompt" data-ai-prompt>${esc(job.prompt)}</pre><div class="ai-reader-actions"><button class="button primary" type="button" data-copy-ai-prompt>${esc(job.copy)}</button><button class="button" type="button" data-share-reader>${esc(job.share)}</button><a class="button" href="${job.relatedHref}">${esc(job.related)}</a><a class="button" href="${job.issue}" rel="external noopener noreferrer">${esc(job.returnLabel)}</a></div></div></section>`;
    const marker='<section class="reader-response"';
    const at=html.indexOf(marker);
    if(at<0){ if(!html.includes('</main>')) throw new Error(`reader response and </main> missing: ${job.path}`); html=html.replace('</main>',block+'\n</main>'); }
    else html=html.slice(0,at)+block+'\n'+html.slice(at);
    touched=true;
  }
  if(touched){ writeFileSync(job.path,html,'utf8'); changed++; }
}
console.log(`AI_READER_LAB_INJECT=PASS changed=${changed} documents=015,016 editions=EN_UA header_jump=PASS backend=ZERO client=LOCAL`);
