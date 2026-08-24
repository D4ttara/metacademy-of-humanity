import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const base = 'https://d4ttara.github.io/metacademy-of-humanity/';
const issue = n => `https://github.com/D4ttara/metacademy-of-humanity/issues/${n}`;

const docs = {
  '003': { issue:53, en:{title:'Life as Organization', href:'documents/003-life-as-organization/en/'}, ua:{title:'Життя як організація', href:'documents/003-life-as-organization/'} },
  '004': { issue:54, en:{title:'When Science Reaches a Plateau', href:'documents/004-when-science-reaches-a-plateau/en/'}, ua:{title:'Коли наука виходить на плато', href:'documents/004-when-science-reaches-a-plateau/ua/'} },
  '006': { issue:55, en:{title:'M{Y}OGA JYOTISH · Field Manifesto', href:'documents/006-myoga-jyotish/'}, ua:{title:'M{Y}OGA JYOTISH · Маніфест дисципліни', href:'documents/006-myoga-jyotish/'} },
  '007': { issue:45, en:{title:'After Vibe Coding', href:'documents/007-after-vibe-coding/en/'}, ua:{title:'Після Vibe Coding', href:'documents/007-after-vibe-coding/ua/'} },
  '008': { issue:46, en:{title:'The Interface That Knows You', href:'documents/008-the-interface-that-knows-you/en/'}, ua:{title:'Інтерфейс, який знає тебе', href:'documents/008-the-interface-that-knows-you/ua/'} },
  '009': { issue:47, en:{title:'Metanauts on AI Control', href:'documents/009-elon-musk-mark-zuckerberg-ai-control/en/'}, ua:{title:'Метанавти про контроль AI', href:'documents/009-elon-musk-mark-zuckerberg-ai-control/ua/'} },
  '010': { issue:48, en:{title:'Manifestation Time ≠ Genesis Time', href:'documents/010-manifestation-time-genesis-time/en/'}, ua:{title:'Час прояву ≠ час зародження', href:'documents/010-manifestation-time-genesis-time/ua/'} },
  '011': { issue:49, en:{title:'The Third Body', href:'documents/011-the-third-body/en/'}, ua:{title:'Третє тіло', href:'documents/011-the-third-body/ua/'} },
  '012': { issue:50, en:{title:'M{Y}OGA: What Happens If We Don’t Laugh at Astrology for the First Five Minutes', href:'documents/012-myoga-astrology-overview/en/'}, ua:{title:'M{Y}OGA: що буде, якщо не сміятися з астрології перші п’ять хвилин', href:'documents/012-myoga-astrology-overview/ua/'} },
  '013': { issue:51, en:{title:'The Human in a Room That Answers', href:'documents/013-room-that-answers/en/'}, ua:{title:'Людина в кімнаті, яка відповідає', href:'documents/013-room-that-answers/ua/'} },
  '014': { issue:39, en:{title:'The Right to See the Consequence', href:'documents/014-right-to-see-the-consequence/en/'}, ua:{title:'Право бачити наслідок', href:'documents/014-right-to-see-the-consequence/ua/'} }
};

const topics = [
  {slug:'artificial-intelligence', en:'Artificial Intelligence', ua:'Штучний інтелект', enDesc:'AI as a technical, cultural and political force: coding, interfaces, control, personalization and the problem of reality shaped by generated answers.', uaDesc:'AI як технічна, культурна й політична сила: код, інтерфейси, контроль, персоналізація та проблема реальності, яку дедалі частіше формують згенеровані відповіді.', docs:['007','008','009','013']},
  {slug:'human-ai', en:'Human ↔ AI', ua:'Людина ↔ AI', enDesc:'What happens when a person and an AI system stop being isolated objects and begin changing one another’s choices, models, language and sense of agency?', uaDesc:'Що відбувається, коли людина й AI перестають бути ізольованими об’єктами й починають змінювати вибір, моделі, мову та відчуття агентності одне одного?', docs:['007','008','009','011','013']},
  {slug:'semantic-computing', en:'Semantic Computing', ua:'Семантичні обчислення', enDesc:'Research on meaning that survives translation between intention, representation, code, interface and computational body without silently collapsing provenance.', uaDesc:'Дослідження сенсу, який має пережити перехід між наміром, репрезентацією, кодом, інтерфейсом та обчислювальним тілом без тихого стирання походження.', docs:['007','008','010','013']},
  {slug:'epistemology', en:'Epistemology & Research Method', ua:'Епістемологія й метод дослідження', enDesc:'How to keep evidence strength, provenance, contradiction, uncertainty and the unknown visible when disciplines and ways of knowing meet.', uaDesc:'Як зберігати видимими силу доказів, provenance, суперечність, невизначеність і невідоме, коли зустрічаються різні дисципліни та способи пізнання.', docs:['003','004','006','010','012','013','014']},
  {slug:'agency-and-behavior', en:'Agency, Behavior & Care', ua:'Агентність, поведінка й турбота', enDesc:'Where guidance becomes control, personalization becomes steering, friction becomes harm, and a system’s good intention stops being enough.', uaDesc:'Де порада стає контролем, персоналізація керуванням, тертя шкодою, а доброго наміру системи вже недостатньо для гуманності.', docs:['008','011','013','014']},
  {slug:'complex-systems', en:'Complex Systems & Emergence', ua:'Складні системи й емерджентність', enDesc:'Life, software, relations and scientific explanation viewed through organization, feedback, boundaries, hidden preparation and properties that arise between parts.', uaDesc:'Життя, software, відношення й наукове пояснення через організацію, feedback, межі, приховану підготовку та властивості, що виникають між частинами.', docs:['003','004','007','010','011']},
  {slug:'myoga-jyotish', en:'M{Y}OGA JYOTISH', ua:'M{Y}OGA JYOTISH', enDesc:'A source-aware research field where Jyotiṣa, astronomy, mathematics, interpretation and lived experience can meet without becoming one evidence soup.', uaDesc:'Джерельно дисципліноване поле, де Jyotiṣa, астрономія, математика, інтерпретація та прожитий досвід можуть зустрічатися без перетворення на один evidence soup.', docs:['006','012']},
  {slug:'time-and-causality', en:'Time, Causality & Hidden Preparation', ua:'Час, причинність і прихована підготовка', enDesc:'When visible manifestation comes later than causal genesis, the task is to detect real preparation without turning hindsight into a universal explanation.', uaDesc:'Коли видимий прояв приходить пізніше за причинне зародження, задача полягає в тому, щоб бачити реальну підготовку й не перетворювати hindsight на універсальне пояснення.', docs:['010','011','014']}
];

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const docTopics = new Map();
for (const t of topics) for (const n of t.docs) docTopics.set(n, [...(docTopics.get(n) || []), t]);

function topicPage(topic, lang) {
  const isUa = lang === 'ua';
  const title = isUa ? topic.ua : topic.en;
  const desc = isUa ? topic.uaDesc : topic.enDesc;
  const route = isUa ? `uk/topics/${topic.slug}/` : `topics/${topic.slug}/`;
  const alternate = isUa ? `${base}topics/${topic.slug}/` : `${base}uk/topics/${topic.slug}/`;
  const cards = topic.docs.map(n => {
    const d = docs[n];
    const ed = isUa ? d.ua : d.en;
    const href = isUa ? `../../../${ed.href}` : `../../${ed.href}`;
    const q = isUa ? 'Питання до тексту' : 'Reader question';
    const r = isUa ? 'Читати' : 'Read';
    return `<article class="card document-card"><div><p class="eyebrow">Document ${n}</p><h3>${esc(ed.title)}</h3></div><p><a href="${href}">${r} →</a> · <a href="${issue(d.issue)}">${q} →</a></p></article>`;
  }).join('');
  const jsonLd = {
    '@context':'https://schema.org', '@type':'CollectionPage', name:title, description:desc,
    url:`${base}${route}`, inLanguage:isUa?'uk':'en',
    isPartOf:{'@type':'WebSite',name:'MET[Ȧ]CADEMY OF HUMANITY',url:base},
    about:{'@type':'DefinedTerm',name:title,url:`${base}${route}`},
    hasPart:topic.docs.map(n=>({'@type':'Article',name:(isUa?docs[n].ua:docs[n].en).title,url:`${base}${(isUa?docs[n].ua:docs[n].en).href}`}))
  };
  const home = isUa ? '../../' : '../../';
  const allTopics = topics.map(t => `<a href="${isUa ? `../${t.slug}/` : `../${t.slug}/`}">${esc(isUa?t.ua:t.en)}</a>`).join(' · ');
  return `<!doctype html><html lang="${isUa?'uk':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><link rel="canonical" href="${base}${route}"><link rel="alternate" hreflang="${isUa?'en':'uk'}" href="${alternate}"><link rel="alternate" type="application/rss+xml" title="MET[Ȧ]CADEMY OF HUMANITY · Publications" href="${base}feed.xml"><meta property="og:type" content="website"><meta property="og:site_name" content="MET[Ȧ]CADEMY OF HUMANITY"><meta property="og:title" content="${esc(title)} · MET[Ȧ]CADEMY"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${base}${route}"><title>${esc(title)} · MET[Ȧ]CADEMY OF HUMANITY</title><link rel="icon" href="${isUa?'../../../':'../../'}assets/img/favicon.svg"><link rel="stylesheet" href="${isUa?'../../../':'../../'}assets/css/site.css"><script type="application/ld+json">${JSON.stringify(jsonLd)}</script></head><body><header class="top"><div class="wrap"><a class="brand" href="${home}">MET[Ȧ]CADEMY OF HUMANITY</a><nav class="nav"><a href="${isUa?'../../':'../../'}">${isUa?'Головна':'Home'}</a><a href="${isUa?'../../documents/':'../../documents/'}">${isUa?'Документи':'Documents'}</a><a href="${isUa?'../../../topics/':'../'}">${isUa?'EN topics':'All topics'}</a></nav></div></header><main><header class="pagehead"><div class="wrap"><p class="eyebrow">${isUa?'Тематичне поле':'Research topic'}</p><h1>${esc(title)}</h1><p class="lede">${esc(desc)}</p></div></header><section><div class="wrap"><div class="cards">${cards}</div><p class="topic-directory">${allTopics}</p></div></section></main><footer><div class="wrap">© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)</div></footer></body></html>`;
}

for (const t of topics) {
  for (const lang of ['en','ua']) {
    const path = lang === 'ua' ? `uk/topics/${t.slug}/index.html` : `topics/${t.slug}/index.html`;
    mkdirSync(dirname(path), {recursive:true});
    writeFileSync(path, topicPage(t, lang), 'utf8');
  }
}

const indexes = {
  en: {path:'topics/index.html', title:'Research Topics', desc:'Browse MET[Ȧ]CADEMY OF HUMANITY by research question rather than document number.', prefix:'', lang:'en'},
  ua: {path:'uk/topics/index.html', title:'Теми досліджень', desc:'Навігація MET[Ȧ]CADEMY OF HUMANITY за дослідницькими питаннями, а не лише за номерами документів.', prefix:'../../', lang:'uk'}
};
for (const cfg of Object.values(indexes)) {
  mkdirSync(dirname(cfg.path), {recursive:true});
  const isUa = cfg.lang === 'uk';
  const cards = topics.map(t => `<article class="card"><h3><a href="${t.slug}/">${esc(isUa?t.ua:t.en)}</a></h3><p>${esc(isUa?t.uaDesc:t.enDesc)}</p></article>`).join('');
  const canonical = `${base}${isUa?'uk/':''}topics/`;
  const alt = `${base}${isUa?'':'uk/'}topics/`;
  writeFileSync(cfg.path, `<!doctype html><html lang="${cfg.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(cfg.desc)}"><meta name="robots" content="index,follow"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="${isUa?'en':'uk'}" href="${alt}"><title>${esc(cfg.title)} · MET[Ȧ]CADEMY</title><link rel="icon" href="${cfg.prefix}assets/img/favicon.svg"><link rel="stylesheet" href="${cfg.prefix}assets/css/site.css"></head><body><header class="top"><div class="wrap"><a class="brand" href="${cfg.prefix}">MET[Ȧ]CADEMY OF HUMANITY</a><nav class="nav"><a href="${cfg.prefix}documents/">${isUa?'Документи':'Documents'}</a><a href="${cfg.prefix}research/">${isUa?'Дослідження':'Research'}</a></nav></div></header><main><header class="pagehead"><div class="wrap"><p class="eyebrow">${isUa?'Тематичний індекс':'Topic index'}</p><h1>${esc(cfg.title)}</h1><p class="lede">${esc(cfg.desc)}</p></div></header><section><div class="wrap"><div class="cards">${cards}</div></div></section></main><footer><div class="wrap">© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)</div></footer></body></html>`, 'utf8');
}

const docPaths = {
  '003': {en:'documents/003-life-as-organization/en/index.html', ua:'documents/003-life-as-organization/index.html'},
  '004': {en:'documents/004-when-science-reaches-a-plateau/en/index.html', ua:'documents/004-when-science-reaches-a-plateau/ua/index.html'},
  '006': {ua:'documents/006-myoga-jyotish/index.html'},
  '007': {en:'documents/007-after-vibe-coding/en/index.html', ua:'documents/007-after-vibe-coding/ua/index.html'},
  '008': {en:'documents/008-the-interface-that-knows-you/en/index.html', ua:'documents/008-the-interface-that-knows-you/ua/index.html'},
  '009': {en:'documents/009-elon-musk-mark-zuckerberg-ai-control/en/index.html', ua:'documents/009-elon-musk-mark-zuckerberg-ai-control/ua/index.html'},
  '010': {en:'documents/010-manifestation-time-genesis-time/en/index.html', ua:'documents/010-manifestation-time-genesis-time/ua/index.html'},
  '011': {en:'documents/011-the-third-body/en/index.html', ua:'documents/011-the-third-body/ua/index.html'},
  '012': {en:'documents/012-myoga-astrology-overview/en/index.html', ua:'documents/012-myoga-astrology-overview/ua/index.html'},
  '013': {en:'documents/013-room-that-answers/en/index.html', ua:'documents/013-room-that-answers/ua/index.html'},
  '014': {en:'documents/014-right-to-see-the-consequence/en/index.html', ua:'documents/014-right-to-see-the-consequence/ua/index.html'}
};

let tagged = 0;
for (const [n, paths] of Object.entries(docPaths)) {
  for (const [lang, path] of Object.entries(paths)) {
    const ts = docTopics.get(n) || [];
    if (!ts.length) continue;
    let html = readFileSync(path,'utf8');
    if (html.includes('data-search-taxonomy="true"')) continue;
    const isUa = lang === 'ua';
    const rootPrefix = path.split('/').slice(0,-1).map(()=> '..').join('/') + '/';
    const links = ts.map(t => `<a href="${rootPrefix}${isUa?'uk/':''}topics/${t.slug}/">${esc(isUa?t.ua:t.en)}</a>`).join(' · ');
    const strip = `<nav class="topic-strip" data-search-taxonomy="true" aria-label="${isUa?'Теми статті':'Article topics'}"><span>${isUa?'Теми':'Topics'}:</span> ${links}</nav>`;
    const headClose = html.indexOf('</header>');
    if (headClose < 0) throw new Error(`Header not found for ${path}`);
    html = html.slice(0, headClose + 9) + strip + html.slice(headClose + 9);
    const tags = ts.map(t=>`<meta property="article:tag" content="${esc(t.en)}">`).join('');
    html = html.replace('</head>', `${tags}</head>`);
    writeFileSync(path, html, 'utf8');
    tagged++;
  }
}

function injectTopicDesk(path, isUa) {
  let html = readFileSync(path,'utf8');
  if (html.includes('data-topic-desk="true"')) return;
  const start = html.indexOf('<section class="research-frontpage" data-newspaper-frontpage="true">');
  if (start < 0) throw new Error(`Newspaper front page missing in ${path}`);
  const end = html.indexOf('</section>', start) + 10;
  const prefix = isUa ? '../' : '';
  const links = topics.map(t => `<a href="${prefix}${isUa?'uk/':''}topics/${t.slug}/">${esc(isUa?t.ua:t.en)}</a>`).join('');
  const block = `<section class="topic-desk" data-topic-desk="true"><div class="wrap"><p class="eyebrow">${isUa?'Шукати за темою':'Browse by topic'}</p><h2>${isUa?'Не знаєш номер документа? Шукай питання.':'Forget document numbers. Follow the question.'}</h2><div class="topic-desk-links">${links}</div></div></section>`;
  html = html.slice(0,end) + block + html.slice(end);
  writeFileSync(path, html, 'utf8');
}
injectTopicDesk('index.html', false);
injectTopicDesk('uk/index.html', true);

let sitemap = readFileSync('sitemap.xml','utf8');
for (const t of topics) {
  for (const route of [`topics/${t.slug}/`,`uk/topics/${t.slug}/`]) {
    const u = `${base}${route}`;
    if (!sitemap.includes(u)) sitemap = sitemap.replace('</urlset>', `  <url><loc>${u}</loc></url>\n</urlset>`);
  }
}
for (const route of ['topics/','uk/topics/']) {
  const u = `${base}${route}`;
  if (!sitemap.includes(u)) sitemap = sitemap.replace('</urlset>', `  <url><loc>${u}</loc></url>\n</urlset>`);
}
writeFileSync('sitemap.xml', sitemap, 'utf8');

console.log(`SEARCH_TAXONOMY_BUILD=PASS topics=${topics.length} topic_pages=${topics.length*2+2} tagged_editions=${tagged} homepage_topic_desks=2`);
