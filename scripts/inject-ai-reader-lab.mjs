import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const repo='D4ttara/metacademy-of-humanity';
const issueUrl=n=>`https://github.com/${repo}/issues/${n}`;
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const strip=s=>String(s).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const relDir=(fromFile,targetDir)=>{const r=path.posix.relative(path.posix.dirname(fromFile),targetDir); return (r||'.')+'/';};
const clientSrc=file=>path.posix.relative(path.posix.dirname(file),'assets/js/ai-reader-lab.js');

const docs=[
 {number:'003',slug:'003-life-as-organization',issue:53,topic:'complex-systems',pages:{en:'documents/003-life-as-organization/en/index.html',ua:'documents/003-life-as-organization/index.html'},titles:{en:'Life as Organization',ua:'Життя як організація'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 003 “Life as Organization” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, and one observation that would force you to distinguish a genuinely new level of organization from a clever arrangement of parts. Test the essay’s treatment of autonomy, boundaries and environment. Separate evidence from interpretation. If you have web access, verify the scientific lineage and say exactly where the argument overreaches.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 003 «Життя як організація» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце й одне спостереження, яке змусило б відрізнити справді новий рівень організації від хитрої композиції деталей. Перевір трактування автономності, меж і середовища. Відділяй доказ від інтерпретації. Якщо маєш веб-доступ, перевір наукову лінію й точно вкажи, де аргумент перебільшує.'}},
 {number:'004',slug:'004-when-science-reaches-a-plateau',issue:54,topic:'epistemology',pages:{en:'documents/004-when-science-reaches-a-plateau/en/index.html',ua:'documents/004-when-science-reaches-a-plateau/ua/index.html'},titles:{en:'When Science Reaches a Plateau',ua:'Коли наука виходить на плато'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 004 “When Science Reaches a Plateau” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, and one historical or current case where an apparent scientific plateau was solved by better instruments, cleaner data or more patience rather than a new explanatory frame. State what evidence would justify changing the frame. Verify cited sources if you have web access.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 004 «Коли наука виходить на плато» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце й один історичний або сучасний випадок, де уявне наукове плато було подолане кращими інструментами, чистішими даними чи терпінням, а не новою рамкою. Скажи, який доказ справді виправдовує зміну рамки. Якщо маєш веб-доступ, перевір джерела.'}},
 {number:'006',slug:'006-myoga-jyotish',issue:55,topic:'myoga-jyotish',pages:{ua:'documents/006-myoga-jyotish/index.html'},titles:{ua:'M{Y}OGA JYOTISH'},prompts:{
  ua:'Прочитай MET[Ȧ]CADEMY Document 006 «M{Y}OGA JYOTISH» за цим URL: {URL}. Не погоджуйся автоматично й не відкидай автоматично. Розділи традицію, астрономічне твердження, математичну конструкцію, інтерпретацію та прожитий досвід. Назви найсильніше місце протоколу, найслабше місце й один результат, який мав би змусити відкинути конкретне M{Y}OGA-розширення. Не підмінюй перевірку ні вірою, ні насмішкою. Якщо маєш веб-доступ, перевір зовнішні джерела окремо від внутрішньої методології.'}},
 {number:'007',slug:'007-after-vibe-coding',issue:45,topic:'semantic-computing',pages:{en:'documents/007-after-vibe-coding/en/index.html',ua:'documents/007-after-vibe-coding/ua/index.html'},titles:{en:'After Vibe Coding',ua:'Після vibe coding'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 007 “After Vibe Coding” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, and the exact invariant that must survive when intention becomes interpretation, architecture, code and behaviour. Give one counterexample where a semantic passport would add ceremony without improving reliability, and one case where it would catch a real failure. Verify sources if you have web access.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 007 «Після vibe coding» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце й точний інваріант, який має пережити перехід задуму в інтерпретацію, архітектуру, код і поведінку. Дай один контрприклад, де семантичний паспорт лише додає церемонію, і один випадок, де він ловить реальну помилку. Якщо маєш веб-доступ, перевір джерела.'}},
 {number:'008',slug:'008-the-interface-that-knows-you',issue:46,topic:'human-ai',pages:{en:'documents/008-the-interface-that-knows-you/en/index.html',ua:'documents/008-the-interface-that-knows-you/ua/index.html'},titles:{en:'The Interface That Knows You',ua:'Інтерфейс, який знає тебе'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 008 “The Interface That Knows You” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, and one case where deep personalization clearly serves the person rather than steering them. Then name one optimization a system should never perform without explicit permission. Separate user benefit, platform benefit and third-party benefit. Verify sources if you have web access.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 008 «Інтерфейс, який знає тебе» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце й один випадок, де глибока персоналізація явно служить людині, а не керує нею. Потім назви одну оптимізацію, яку система не повинна робити без прямої згоди. Розділи користь людини, платформи й третьої сторони. Якщо маєш веб-доступ, перевір джерела.'}},
 {number:'009',slug:'009-elon-musk-mark-zuckerberg-ai-control',issue:47,topic:'artificial-intelligence',pages:{en:'documents/009-elon-musk-mark-zuckerberg-ai-control/en/index.html',ua:'documents/009-elon-musk-mark-zuckerberg-ai-control/ua/index.html'},titles:{en:'AI Control',ua:'Контроль ШІ'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 009 on AI control at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, and which concept fails first under current AI systems: tool, user, owner, subject, access or responsibility. Give one concrete governance case where the essay’s framing helps and one where it becomes too abstract to decide anything. Verify factual claims and current examples if you have web access.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 009 про контроль ШІ за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце й поняття, яке першим ламається на сучасних ШІ-системах: інструмент, користувач, власник, суб’єкт, доступ чи відповідальність. Дай один конкретний governance-випадок, де рамка допомагає, і один, де вона стає надто абстрактною. Якщо маєш веб-доступ, перевір факти й актуальні приклади.'}},
 {number:'010',slug:'010-manifestation-time-genesis-time',issue:48,topic:'time-and-causality',pages:{en:'documents/010-manifestation-time-genesis-time/en/index.html',ua:'documents/010-manifestation-time-genesis-time/ua/index.html'},titles:{en:'Manifestation Time ≠ Genesis Time',ua:'Час прояву ≠ час зародження'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 010 “Manifestation Time ≠ Genesis Time” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, and one observation that would falsify the idea of a hidden preparatory phase before a visible event. Distinguish prospective prediction from hindsight reconstruction. Give one domain where the distinction is useful and one where it risks becoming unfalsifiable. Verify sources if you have web access.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 010 «Час прояву ≠ час зародження» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце й одне спостереження, яке фальсифікувало б ідею прихованої підготовчої фази перед видимою подією. Відрізни проспективне передбачення від реконструкції заднім числом. Дай одну сферу, де відмінність корисна, й одну, де стає неперевірною. Якщо маєш веб-доступ, перевір джерела.'}},
 {number:'011',slug:'011-the-third-body',issue:49,topic:'agency-and-behavior',pages:{en:'documents/011-the-third-body/en/index.html',ua:'documents/011-the-third-body/ua/index.html'},titles:{en:'The Third Body',ua:'Третє тіло'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 011 “The Third Body” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, and a defensible boundary between difficult friction from which a shared third body can grow and a relationship that is simply damaging. Give one counterexample to romanticizing endurance and one counterexample to premature exit. Keep descriptive claims separate from ethical prescriptions.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 011 «Третє тіло» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце й захищену аргументами межу між складним тертям, з якого може вирости спільне третє тіло, та стосунком, який просто руйнує. Дай один контрприклад до романтизації терпіння й один до передчасного виходу. Не змішуй описові твердження з етичними приписами.'}},
 {number:'012',slug:'012-myoga-astrology-overview',issue:50,topic:'myoga-jyotish',pages:{en:'documents/012-myoga-astrology-overview/en/index.html',ua:'documents/012-myoga-astrology-overview/ua/index.html'},titles:{en:'M{Y}OGA: A Fair Test of Astrology',ua:'M{Y}OGA: чесний тест астрології'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 012 on M{Y}OGA and astrology at {URL}. Do not agree automatically and do not dismiss automatically. Separate astronomical input, formal calculation, interpretive rule, cultural tradition and lived report. Design one fair falsifiable test that neither assumes astrology is true nor rejects it before testing. State what result would make each side revise its position. Verify scientific sources if you have web access.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 012 про M{Y}OGA й астрологію за цим URL: {URL}. Не погоджуйся автоматично й не відкидай автоматично. Розділи астрономічні дані, формальний розрахунок, правило інтерпретації, культурну традицію й прожитий звіт. Запропонуй один чесний фальсифікований тест, який не припускає істинність наперед і не закриває питання до перевірки. Скажи, який результат мав би змусити кожну сторону змінити позицію. Якщо маєш веб-доступ, перевір наукові джерела.'}},
 {number:'013',slug:'013-room-that-answers',issue:51,topic:'human-ai',pages:{en:'documents/013-room-that-answers/en/index.html',ua:'documents/013-room-that-answers/ua/index.html'},titles:{en:'The Human in a Room That Answers',ua:'Людина в кімнаті, яка відповідає'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 013 “The Human in a Room That Answers” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, and one case where AI personalization improves understanding without adapting evidence, uncertainty or alternatives. Then identify when USER MODEL != USER should force the system to distrust its own model. Verify cited research if you have web access and name any missing counterevidence.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 013 «Людина в кімнаті, яка відповідає» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце й один випадок, де персоналізація ШІ покращує розуміння, не адаптуючи докази, невизначеність чи альтернативи. Потім скажи, коли USER MODEL != USER має змусити систему не довіряти власній моделі людини. Якщо маєш веб-доступ, перевір дослідження й назви відсутні контрдокази.'}},
 {number:'014',slug:'014-right-to-see-the-consequence',issue:39,topic:'agency-and-behavior',pages:{en:'documents/014-right-to-see-the-consequence/en/index.html',ua:'documents/014-right-to-see-the-consequence/ua/index.html'},titles:{en:'The Right to See the Consequence',ua:'Право бачити наслідок'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 014 “The Right to See the Consequence” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, one case where a harsh warning or graphic consequence genuinely changes behaviour without degrading agency, and one case where it produces stigma, avoidance or reactance. Distinguish informing from punishing and consequence visibility from coercion. Verify cited evidence if you have web access.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 014 «Право бачити наслідок» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце, один випадок, де жорстке попередження або графічний наслідок справді змінює поведінку без приниження агентності, й один, де породжує стигму, уникання чи reactance. Відрізни інформування від покарання, а видимість наслідку від примусу. Якщо маєш веб-доступ, перевір наведені докази.'}},
 {number:'015',slug:'015-polytypic-thinking',issue:58,topic:'human-ai',pages:{en:'documents/015-polytypic-thinking/en/index.html',ua:'documents/015-polytypic-thinking/ua/index.html'},titles:{en:'Polytypic Thinking',ua:'Політипічне мислення'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 015 “Polytypic Thinking” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, one real counterexample to “type is a projection, not an essence”, one case where typing is genuinely useful, and a defensible boundary for the right to be statistically inconvenient. Separate evidence from interpretation. If you have web access, verify the cited sources and say exactly where the essay overreaches.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 015 «Політипічне мислення» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце, один реальний контрприклад до принципу «тип є проєкцією, а не сутністю», один випадок, де типізація справді корисна, і захищену аргументами межу права бути статистично незручною. Відділяй доказ від інтерпретації. Якщо маєш веб-доступ, перевір джерела й точно вкажи, де текст перебільшує.'}},
 {number:'016',slug:'016-right-to-a-first-chance',issue:59,topic:'agency-and-behavior',pages:{en:'documents/016-right-to-a-first-chance/en/index.html',ua:'documents/016-right-to-a-first-chance/ua/index.html'},titles:{en:'The Right to a First Chance',ua:'Право на перший шанс'},prompts:{
  en:'Read MET[Ȧ]CADEMY Document 016 “The Right to a First Chance” at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, one counterexample where a strict entry barrier genuinely protects a person or shared resource better than a small safe first chance, and one human-centred redesign of a real system. Separate evidence from interpretation. If you have web access, verify the cited sources and identify where the essay underestimates risk.',
  ua:'Прочитай MET[Ȧ]CADEMY Document 016 «Право на перший шанс» за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце, один контрприклад, де жорсткий бар’єр справді краще захищає людину або спільний ресурс, ніж малий безпечний перший шанс, і запропонуй один людиноорієнтований redesign реальної системи. Відділяй доказ від інтерпретації. Якщо маєш веб-доступ, перевір джерела й точно вкажи, де текст недооцінює ризик.'}}
];

const labels={
 en:{jump:'AI critique',eyebrow:'AI READER LAB',title:'Take this publication to your AI',note:'Use the AI you already have as an adversarial reading partner, not as an applause machine. No new account, plugin or comment service is required. Bring back only the counterexample, correction or redesign that survived the conversation.',copy:'Copy critical prompt',share:'Share publication',related:'Explore the related research field',returnLabel:'Bring the surviving objection back'},
 ua:{jump:'ШІ-критика',eyebrow:'ШІ-ЛАБОРАТОРІЯ ЧИТАЧА',title:'Візьми цю публікацію у свій ШІ',note:'Використай той ШІ, який уже маєш, як критичного співчитача, а не машину оплесків. Новий акаунт, плагін чи сервіс коментарів не потрібні. Назад принеси лише контрприклад, виправлення або redesign, що пережили розмову.',copy:'Копіювати критичний промпт',share:'Поділитися публікацією',related:'Дослідити споріднене поле',returnLabel:'Принести заперечення назад'}
};

function removeExistingLab(html,number){
 const re=new RegExp(`\\n?<section id="ai-reader-lab-${number}"[\\s\\S]*?<\\/section>\\n?`,'g');
 return html.replace(re,'\n');
}
function injectOne(job,lang){
 const file=job.pages[lang]; if(!file) return false;
 let html=readFileSync(file,'utf8');
 html=removeExistingLab(html,job.number);
 const l=labels[lang]; const anchor=`ai-reader-lab-${job.number}`;
 if(!html.includes('ai-reader-lab.js')){
   if(!html.includes('</head>')) throw new Error(`</head> missing: ${file}`);
   html=html.replace('</head>',`<script src="${clientSrc(file)}" defer></script></head>`);
 }
 const headerRe=/(<div class="edition-links">)([\s\S]*?)(<\/div>)/;
 if(!html.includes(`href="#${anchor}"`)){
   if(!headerRe.test(html)) throw new Error(`edition links missing: ${file}`);
   html=html.replace(headerRe,(whole,open,body,close)=>`${open}${body}<a class="button" data-ai-reader-jump href="#${anchor}">${esc(l.jump)}</a>${close}`);
 }
 const topicBase=lang==='ua'?`uk/topics/${job.topic}`:`topics/${job.topic}`;
 const relatedHref=relDir(file,topicBase);
 const block=`\n<section id="${anchor}" class="ai-reader-lab" data-ai-reader-lab="${job.number}" data-ai-reader-mode="tailored"><div class="wrap ai-reader-lab-inner"><p class="eyebrow">${esc(l.eyebrow)}</p><h2>${esc(l.title)}</h2><p class="ai-reader-note">${esc(l.note)}</p><pre class="ai-reader-prompt" data-ai-prompt>${esc(job.prompts[lang])}</pre><div class="ai-reader-actions"><button class="button primary" type="button" data-copy-ai-prompt>${esc(l.copy)}</button><button class="button" type="button" data-share-reader>${esc(l.share)}</button><a class="button" href="${relatedHref}">${esc(l.related)}</a><a class="button" href="${issueUrl(job.issue)}" rel="external noopener noreferrer">${esc(l.returnLabel)}</a></div></div></section>`;
 const marker='<section class="reader-response"'; const at=html.indexOf(marker);
 if(at>=0) html=html.slice(0,at)+block+'\n'+html.slice(at);
 else { if(!html.includes('</main>')) throw new Error(`reader response and </main> missing: ${file}`); html=html.replace('</main>',block+'\n</main>'); }
 writeFileSync(file,html,'utf8'); return true;
}

let tailored=0;
const known=new Set();
for(const job of docs) for(const lang of Object.keys(job.pages)){known.add(job.pages[lang]); if(injectOne(job,lang)) tailored++;}

function walk(dir,out=[]){for(const name of readdirSync(dir)){const p=path.posix.join(dir,name); const s=statSync(p); if(s.isDirectory()) walk(p,out); else if(name==='index.html') out.push(p);} return out;}
let fallback=0;
for(const file of walk('documents')){
 if(known.has(file)) continue;
 let html=readFileSync(file,'utf8');
 const m=html.match(/data-reader-document="(\d{3})"/); if(!m||html.includes('data-ai-reader-lab=')) continue;
 const number=m[1]; const lang=/lang="(?:uk|ua)"|\/ua\//.test(html)||file.includes('/ua/')?'ua':'en'; const l=labels[lang];
 const h1=strip((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||`Document ${number}`);
 const issue=(html.match(/https:\/\/github\.com\/D4ttara\/metacademy-of-humanity\/issues\/(\d+)/)||[])[1];
 const prompt=lang==='ua'
   ?`Прочитай MET[Ȧ]CADEMY ${h1} за цим URL: {URL}. Не погоджуйся автоматично. Назви найсильнішу тезу, найслабше місце, один реальний контрприклад і одне спостереження або джерело, яке могло б змусити автора змінити висновок. Відділяй доказ від інтерпретації. Якщо маєш веб-доступ, перевір ключові зовнішні твердження й назви відсутні контрдокази.`
   :`Read MET[Ȧ]CADEMY ${h1} at {URL}. Do not agree automatically. Identify the strongest claim, the weakest point, one real counterexample, and one observation or source that should make the author revise the conclusion. Separate evidence from interpretation. If you have web access, verify the key external claims and identify missing counterevidence.`;
 const anchor=`ai-reader-lab-${number}`;
 if(!html.includes('ai-reader-lab.js')) html=html.replace('</head>',`<script src="${clientSrc(file)}" defer></script></head>`);
 const headerRe=/(<div class="edition-links">)([\s\S]*?)(<\/div>)/;
 if(!html.includes(`href="#${anchor}"`)&&headerRe.test(html)) html=html.replace(headerRe,(whole,open,body,close)=>`${open}${body}<a class="button" data-ai-reader-jump href="#${anchor}">${esc(l.jump)}</a>${close}`);
 const moreHref=relDir(file,'documents');
 const issueButton=issue?`<a class="button" href="${issueUrl(issue)}" rel="external noopener noreferrer">${esc(l.returnLabel)}</a>`:'';
 const block=`\n<section id="${anchor}" class="ai-reader-lab" data-ai-reader-lab="${number}" data-ai-reader-mode="fallback"><div class="wrap ai-reader-lab-inner"><p class="eyebrow">${esc(l.eyebrow)}</p><h2>${esc(l.title)}</h2><p class="ai-reader-note">${esc(l.note)}</p><pre class="ai-reader-prompt" data-ai-prompt>${esc(prompt)}</pre><div class="ai-reader-actions"><button class="button primary" type="button" data-copy-ai-prompt>${esc(l.copy)}</button><button class="button" type="button" data-share-reader>${esc(l.share)}</button><a class="button" href="${moreHref}">${lang==='ua'?'Інші публікації':'More publications'}</a>${issueButton}</div></div></section>`;
 const marker='<section class="reader-response"'; const at=html.indexOf(marker); if(at>=0) html=html.slice(0,at)+block+'\n'+html.slice(at); else html=html.replace('</main>',block+'\n</main>');
 writeFileSync(file,html,'utf8'); fallback++;
}

const surfaces=[['index.html','en'],['uk/index.html','ua'],['documents/index.html','en'],['uk/documents/index.html','ua'],['research/index.html','en'],['uk/research/index.html','ua'],['updates/index.html','en'],['uk/updates/index.html','ua']];
let discovery=0;
for(const [surface,lang] of surfaces){let html=readFileSync(surface,'utf8'); let touched=false;
 for(const job of docs){if(!html.includes(job.slug)||html.includes(`data-ai-reader-discovery="${job.number}"`)) continue; const target=job.pages[lang]||job.pages.en||job.pages.ua; const dir=target.replace(/index\.html$/,''); const href=relDir(surface,dir)+`#ai-reader-lab-${job.number}`; const label=lang==='ua'?'ШІ-критика →':'AI critique →';
  const articles=[...html.matchAll(/<article\b[\s\S]*?<\/article>/g)]; const hit=articles.find(m=>m[0].includes(job.slug)); if(!hit) continue; const block=hit[0]; const patched=block.replace('</article>',`<a data-ai-reader-discovery="${job.number}" href="${href}">${label}</a></article>`); html=html.slice(0,hit.index)+patched+html.slice(hit.index+block.length); touched=true; discovery++;
 }
 if(touched) writeFileSync(surface,html,'utf8');
}

console.log(`AI_READER_LAB_INJECT=PASS tailored=${tailored} fallback=${fallback} documents=003,004,006-016 public_publications=${docs.length} discovery_links=${discovery} backend=ZERO client=LOCAL future_fallback=PASS`);
