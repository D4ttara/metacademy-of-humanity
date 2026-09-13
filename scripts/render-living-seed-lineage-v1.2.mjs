import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const site='https://d4ttara.github.io/metacademy-of-humanity/';
const repo='https://raw.githubusercontent.com/D4ttara/metacademy-of-humanity/main/';
const discussion='https://github.com/D4ttara/metacademy-of-humanity/issues/73';

const editions=[
  {
    lang:'uk', code:'UA', mdPath:'uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md', outPath:'uk/research/living-seed-lineage/index.html',
    canonical:`${site}uk/research/living-seed-lineage/`, alternate:`${site}research/living-seed-lineage/`, source:`${repo}uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md`,
    assetPrefix:'../../../', home:'../../', research:'../', documents:'../../documents/', fields:'../../fields/', manifesto:'../../../manifesto/',
    nav:['Дослідження','Документи','Поля','Маніфест'], read:'Читати онлайн', lineage:'Lineage', respond:'Відповісти', switchLabel:'English',
    lineageHtml:`<p class="eyebrow">Lineage · версії</p><h2>Текст не переписує власне минуле.</h2><p>v1.2 є поточною канонічною українською версією. Попередні публічні стани залишаються доступними як історичні свідки.</p><p><a href="https://github.com/D4ttara/metacademy-of-humanity/blob/1207a75cf715e963644d78d0fe5945282399c47e/uk/research/living-seed-lineage/index.html" rel="external noopener noreferrer">v1.0 · historical HTML witness · commit 1207a75</a></p><p><a href="${repo}uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md" rel="external noopener noreferrer">v1.1 · canonical Markdown witness</a></p><p><a href="source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md">v1.2 · current canonical Markdown</a></p><p><a href="VERSION_HISTORY.md">Повна історія версій →</a></p>`,
    responseTitle:'Де наша база даних обрізає живу історію?', responseText:'Яку частину історії рослини ми сьогодні втрачаємо просто тому, що наша база даних не має поля для цієї частини реальності? І контрпитання: де додаткова координата вже не допомагає, а лише створює красивий інформаційний бур’ян?', responseButton:'Написати відповідь', threadButton:'Читати гілку'
  },
  {
    lang:'en', code:'EN', mdPath:'research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_EN_v1.2.md', outPath:'research/living-seed-lineage/index.html',
    canonical:`${site}research/living-seed-lineage/`, alternate:`${site}uk/research/living-seed-lineage/`, source:`${repo}research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_EN_v1.2.md`,
    assetPrefix:'../../', home:'../../', research:'../', documents:'../../documents/', fields:'../../fields/', manifesto:'../../manifesto/',
    nav:['Research','Documents','Fields','Manifesto'], read:'Read online', lineage:'Lineage', respond:'Respond', switchLabel:'Українська',
    lineageHtml:`<p class="eyebrow">Lineage · editions</p><h2>The English edition keeps the Ukrainian v1.2 as its source witness.</h2><p>This English v1.2 is an adaptive literary edition of the current Ukrainian v1.2. Reflow changes presentation, not the argument or authorial voice.</p><p><a href="${site}uk/research/living-seed-lineage/">UA v1.2 · current source edition</a></p><p><a href="${repo}uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md" rel="external noopener noreferrer">UA v1.2 · canonical Markdown</a></p><p><a href="source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_EN_v1.2.md">EN v1.2 · current canonical English Markdown</a></p>`,
    responseTitle:'Where does our database cut off a living history?', responseText:'What part of a plant’s history do we lose today simply because the database has no field for that part of reality? And the counter-question: when does another coordinate stop helping and become elegant informational weed?', responseButton:'Write a response', threadButton:'Read the thread'
  }
];

const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

for(const e of editions){
  const md=readFileSync(e.mdPath,'utf8');
  const lines=md.split(/\r?\n/);
  const title=lines[0].replace(/^#\s+/,'').trim();
  const subtitle=lines[2].replace(/^##\s+/,'').trim();
  const firstBody=lines.findIndex((line,i)=>i>6 && line.trim() && !line.startsWith('**'));
  if(firstBody<0) throw new Error(`Living Seed ${e.code} v1.2 body not found`);
  const bodyMd=lines.slice(firstBody).join('\n');
  const pandoc=spawnSync('pandoc',['--from=gfm','--to=html5','--wrap=none'],{input:bodyMd,encoding:'utf8'});
  if(pandoc.status!==0) throw new Error(`pandoc failed for ${e.code}: ${pandoc.stderr}`);
  const body=pandoc.stdout.trim();
  const schema={"@context":"https://schema.org","@type":"ScholarlyArticle",headline:title,alternativeHeadline:subtitle,datePublished:'2026-09-13',dateModified:'2026-09-13',version:'1.2',inLanguage:e.lang,author:{"@type":"Person",name:'Ievgen Karogod / Dattara'},publisher:{"@type":"Organization",name:'MET[Ȧ]CADEMY OF HUMANITY (MoH)'},url:e.canonical,discussionUrl:discussion,isBasedOn:e.lang==='en'?[e.alternate,`${repo}uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md`]:['https://github.com/D4ttara/metacademy-of-humanity/blob/1207a75cf715e963644d78d0fe5945282399c47e/uk/research/living-seed-lineage/index.html',`${repo}uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md`]};
  const html=`<!doctype html>
<html lang="${e.lang}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="${esc(subtitle)}"><meta name="author" content="Ievgen Karogod / Dattara"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="citation_title" content="${esc(title)}"><meta name="citation_author" content="Ievgen Karogod / Dattara"><meta name="citation_publication_date" content="2026-09-13"><meta name="citation_language" content="${e.lang}">
<link rel="canonical" href="${e.canonical}"><link rel="alternate" hreflang="${e.lang}" href="${e.canonical}"><link rel="alternate" hreflang="${e.lang==='en'?'uk':'en'}" href="${e.alternate}"><link rel="alternate" type="text/markdown" href="${e.source}" title="Canonical Markdown v1.2"><link rel="alternate" type="application/rss+xml" href="${site}feed.xml" title="MET[Ȧ]CADEMY publications">
<meta property="og:type" content="article"><meta property="og:site_name" content="MET[Ȧ]CADEMY OF HUMANITY"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(subtitle)}"><meta property="og:url" content="${e.canonical}"><meta property="article:published_time" content="2026-09-13"><meta property="article:modified_time" content="2026-09-13"><meta name="twitter:card" content="summary">
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<title>${esc(title)} · MET[Ȧ]CADEMY</title><link rel="icon" href="${e.assetPrefix}assets/img/favicon.svg"><link rel="stylesheet" href="${e.assetPrefix}assets/css/site.css"><link rel="stylesheet" href="${e.assetPrefix}assets/css/research-essays.css"><script src="${e.assetPrefix}assets/js/site.js" defer></script>
</head><body>
<header class="top"><div class="wrap"><a class="brand" href="${e.home}">MET[Ȧ]CADEMY<br>OF HUMANITY</a><nav class="nav"><a href="${e.research}">${e.nav[0]}</a><a href="${e.documents}">${e.nav[1]}</a><a href="${e.fields}">${e.nav[2]}</a><a href="${e.manifesto}">${e.nav[3]}</a></nav></div></header>
<main><header class="pagehead document-head"><div class="wrap document-series"><p class="document-plaque">(MoH) · Research Essay · ${e.code} · v1.2 · 2026-09-13</p><h1>${esc(title)}</h1><p class="lede">${esc(subtitle)}</p><p class="document-sign">MET[Ȧ]CADEMY OF HUMANITY <span aria-hidden="true">· (A) · {Ȧ} · <strong>[Ả]</strong> · {Ã} · (Ā) ·</span></p><div class="edition-links"><a class="button primary" href="#read-online">${e.read}</a><a class="button" href="source/${e.mdPath.split('/').at(-1)}">Markdown v1.2</a><a class="button" href="${e.alternate}">${e.switchLabel}</a><a class="button" href="#lineage">${e.lineage}</a><a class="button" href="${discussion}#issuecomment-new" rel="external noopener noreferrer">${e.respond}</a></div></div></header>
<article id="read-online" class="prose document-prose document-reading research-essay-reading">${body}</article>
<section id="lineage"><div class="wrap">${e.lineageHtml}</div></section>
<section class="reader-response" aria-labelledby="reader-response-title-${e.lang}"><div class="wrap reader-response-inner"><p class="eyebrow">${e.lang==='uk'?'Твоя черга':'Your turn'}</p><h2 id="reader-response-title-${e.lang}">${e.responseTitle}</h2><p class="response-question">${e.responseText}</p><div class="edition-links"><a class="button primary" href="${discussion}#issuecomment-new" rel="external noopener noreferrer">${e.responseButton}</a><a class="button" href="${discussion}" rel="external noopener noreferrer">${e.threadButton}</a></div></div></section></main>
<footer><div class="wrap">© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)</div></footer></body></html>`;
  mkdirSync(e.outPath.slice(0,e.outPath.lastIndexOf('/')),{recursive:true});
  writeFileSync(e.outPath,html,'utf8');
  const checks=e.lang==='uk'?['UA · v1.2','не викидати свідка лише тому, що він прийшов не з вашого факультету','не викинув маленький пакетик','v1.0 · historical HTML witness','v1.1 · canonical Markdown witness']:['EN · v1.2','peer-reviewed carrot','neighbour Sergei','administrative personality','did not throw away the little packet','UA v1.2 · current source edition'];
  for(const token of checks) if(!html.includes(token)) throw new Error(`Living Seed ${e.code} renderer missing ${token}`);
}

console.log('LIVING_SEED_RENDER=PASS editions=UA+EN version=v1.2 lineage=PRESERVED reflow=PARAGRAPH');