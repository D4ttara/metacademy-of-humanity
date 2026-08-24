import { readFileSync, writeFileSync } from 'node:fs';

const repo = 'D4ttara/metacademy-of-humanity';
const jobs = [
  {path:'documents/003-life-as-organization/en/index.html',lang:'en',number:'003',issue:53,assets:'../../../assets',title:'When does organization become a new whole?',question:'If autonomy has degrees, boundaries are active interfaces, and environment can be part of the mechanism, what observation would make you say that a system now has a genuinely new level of organization rather than a clever arrangement of parts?'},
  {path:'documents/003-life-as-organization/index.html',lang:'ua',number:'003',issue:53,assets:'../../assets',title:'Коли організація стає новим цілим?',question:'Якщо автономність має ступені, межа є активним інтерфейсом, а середовище може бути частиною механізму, яке спостереження змусило б тебе сказати: тут уже виник новий рівень організації, а не просто хитра композиція деталей?'},
  {path:'documents/004-when-science-reaches-a-plateau/en/index.html',lang:'en',number:'004',issue:54,assets:'../../../assets',title:'How do we know a plateau is real?',question:'What would convince you that a field truly needs a new explanatory frame rather than better instruments, cleaner data, more mathematics or simply more patience inside the old one? Where does the essay risk mistaking frustration for a scientific transition?'},
  {path:'documents/004-when-science-reaches-a-plateau/ua/index.html',lang:'ua',number:'004',issue:54,assets:'../../../assets',title:'Як зрозуміти, що плато справжнє?',question:'Що переконало б тебе, що полю справді потрібна нова рамка пояснення, а не кращі інструменти, чистіші дані, більше математики чи просто більше терпіння всередині старої? Де есе ризикує сплутати втому з науковим переходом?'},
  {path:'documents/006-myoga-jyotish/index.html',lang:'ua',number:'006',issue:55,assets:'../../assets',title:'Що має залишатися розділеним?',question:'Коли традиція, астрономія, математика, інтерпретація й прожитий досвід зустрічаються в одному полі, яка межа має залишатися жорсткою, а яка може бути експериментально проникною? Який результат змусив би відкинути нове M{Y}OGA-розширення, а не інтегрувати його?'},
];

const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

for (const job of jobs) {
  let html = readFileSync(job.path,'utf8');
  if (!html.includes('research-essays.css')) html = html.replace('</head>', `<link rel="stylesheet" href="${job.assets}/css/research-essays.css">\n</head>`);
  if (!html.includes('site.js')) html = html.replace('</head>', `<script src="${job.assets}/js/site.js" defer></script>\n</head>`);

  const issueUrl = `https://github.com/${repo}/issues/${job.issue}`;
  const reply = job.lang === 'ua' ? 'Відповісти' : 'Reply';
  const write = job.lang === 'ua' ? 'Написати відповідь' : 'Write a reply';
  const thread = job.lang === 'ua' ? 'Читати гілку' : 'Read the thread';
  const eyebrow = job.lang === 'ua' ? 'Твоя черга' : 'Your turn';
  const note = job.lang === 'ua'
    ? 'Читати можна без акаунта. Для публічної відповіді в GitHub-гілці потрібен GitHub-акаунт. Одного сильного абзацу достатньо.'
    : 'Reading needs no account. Posting a public reply in the GitHub thread requires a GitHub account. One sharp paragraph is enough.';

  const edition = /(<div class="edition-links">)([\s\S]*?)(<\/div>)/;
  html = html.replace(edition, (whole, open, body, close) => body.includes(`issues/${job.issue}`) ? whole : `${open}${body}<a class="button" data-discuss-link="true" href="${issueUrl}#issuecomment-new" rel="external noopener noreferrer">${reply}</a>${close}`);

  if (!html.includes(`data-reader-document="${job.number}"`)) {
    const block = `<section class="reader-response" data-reader-document="${job.number}" aria-labelledby="reader-response-title-${job.number}"><div class="wrap reader-response-inner"><p class="eyebrow">${eyebrow}</p><h2 id="reader-response-title-${job.number}">${esc(job.title)}</h2><p class="response-question">${esc(job.question)}</p><p class="response-note">${esc(note)}</p><div class="edition-links"><a class="button primary" data-discuss-link="true" href="${issueUrl}#issuecomment-new" rel="external noopener noreferrer">${write}</a><a class="button" href="${issueUrl}" rel="external noopener noreferrer">${thread}</a></div><div class="reader-comments" data-github-issue-comments data-repo="${repo}" data-issue="${job.issue}"><p class="reader-comments-status" data-comment-status>${job.lang === 'ua' ? 'Завантажуємо публічні відповіді…' : 'Loading public replies…'}</p><div data-comment-stream></div></div></div></section>`;
    html = html.replace('</main>', `${block}</main>`);
  }
  writeFileSync(job.path, html, 'utf8');
}

console.log('LEGACY_READER_RESPONSE_INJECT=PASS documents=003,004,006 issues=53,54,55');
