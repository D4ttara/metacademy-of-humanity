import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const mdPath='uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md';
const outPath='uk/research/living-seed-lineage/index.html';
const md=readFileSync(mdPath,'utf8');
const lines=md.split(/\r?\n/);
const title=lines[0].replace(/^#\s+/,'').trim();
const subtitle=lines[2].replace(/^##\s+/,'').trim();
const firstBody=lines.findIndex((line,i)=>i>6 && line.trim() && !line.startsWith('**'));
if(firstBody<0) throw new Error('Living Seed v1.2 body not found');
const bodyMd=lines.slice(firstBody).join('\n');
const pandoc=spawnSync('pandoc',['--from=gfm','--to=html5'],{input:bodyMd,encoding:'utf8'});
if(pandoc.status!==0) throw new Error(`pandoc failed: ${pandoc.stderr}`);
const body=pandoc.stdout.trim();
const canonical='https://d4ttara.github.io/metacademy-of-humanity/uk/research/living-seed-lineage/';
const source='https://raw.githubusercontent.com/D4ttara/metacademy-of-humanity/main/uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md';
const v11='https://raw.githubusercontent.com/D4ttara/metacademy-of-humanity/main/uk/research/living-seed-lineage/source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.1.md';
const v10='https://github.com/D4ttara/metacademy-of-humanity/blob/1207a75cf715e963644d78d0fe5945282399c47e/uk/research/living-seed-lineage/index.html';
const html=`<!doctype html>
<html lang="uk"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Жива лінія насіння між поколіннями, місцями, людьми, невдачами, традиційним знанням, Місяцем і цифровими системами.">
<meta name="author" content="Ievgen Karogod / Dattara"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="citation_title" content="${title}"><meta name="citation_author" content="Ievgen Karogod / Dattara"><meta name="citation_publication_date" content="2026-09-13"><meta name="citation_language" content="uk">
<link rel="canonical" href="${canonical}"><link rel="alternate" type="text/markdown" href="${source}" title="Canonical Markdown v1.2"><link rel="alternate" type="application/rss+xml" href="https://d4ttara.github.io/metacademy-of-humanity/feed.xml" title="MET[Ȧ]CADEMY publications">
<meta property="og:type" content="article"><meta property="og:site_name" content="MET[Ȧ]CADEMY OF HUMANITY"><meta property="og:title" content="${title}"><meta property="og:description" content="${subtitle}"><meta property="og:url" content="${canonical}"><meta property="article:published_time" content="2026-09-13"><meta property="article:modified_time" content="2026-09-13">
<script type="application/ld+json">${JSON.stringify({"@context":"https://schema.org","@type":"ScholarlyArticle",headline:title,alternativeHeadline:subtitle,datePublished:"2026-09-13",dateModified:"2026-09-13",version:"1.2",inLanguage:"uk",author:{"@type":"Person",name:"Ievgen Karogod / Dattara"},publisher:{"@type":"Organization",name:"MET[Ȧ]CADEMY OF HUMANITY (MoH)"},url:canonical,discussionUrl:"https://github.com/D4ttara/metacademy-of-humanity/issues/73",isBasedOn:[v10,v11]})}</script>
<title>${title} · MET[Ȧ]CADEMY</title><link rel="icon" href="../../../assets/img/favicon.svg"><link rel="stylesheet" href="../../../assets/css/site.css"><link rel="stylesheet" href="../../../assets/css/research-essays.css"><script src="../../../assets/js/site.js" defer></script>
</head><body>
<header class="top"><div class="wrap"><a class="brand" href="../../">MET[Ȧ]CADEMY<br>OF HUMANITY</a><nav class="nav"><a href="../">Дослідження</a><a href="../../documents/">Документи</a><a href="../../fields/">Поля</a><a href="../../../manifesto/">Маніфест</a></nav></div></header>
<main><header class="pagehead document-head"><div class="wrap document-series"><p class="document-plaque">(MoH) · Research Essay · UA · v1.2 · 2026-09-13</p><h1>${title}</h1><p class="lede">${subtitle}</p><p class="document-sign">MET[Ȧ]CADEMY OF HUMANITY <span aria-hidden="true">· (A) · {Ȧ} · <strong>[Ả]</strong> · {Ã} · (Ā) ·</span></p><div class="edition-links"><a class="button primary" href="#read-online">Читати онлайн</a><a class="button" href="source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md">Markdown v1.2</a><a class="button" href="#lineage">Lineage</a><a class="button" href="https://github.com/D4ttara/metacademy-of-humanity/issues/73#issuecomment-new" rel="external noopener noreferrer">Відповісти</a></div></div></header>
<article id="read-online" class="prose document-prose document-reading research-essay-reading">${body}</article>
<section id="lineage"><div class="wrap"><p class="eyebrow">Lineage · версії</p><h2>Текст не переписує власне минуле.</h2><p>v1.2 є поточною канонічною українською версією. Попередні публічні стани залишаються доступними як історичні свідки.</p><p><a href="${v10}" rel="external noopener noreferrer">v1.0 · historical HTML witness · commit 1207a75</a></p><p><a href="${v11}" rel="external noopener noreferrer">v1.1 · canonical Markdown witness</a></p><p><a href="source/METACADEMY_RESEARCH_LIVING_SEED_LINEAGE_UA_v1.2.md">v1.2 · current canonical Markdown</a></p><p><a href="VERSION_HISTORY.md">Повна історія версій →</a></p></div></section>
<section class="reader-response" aria-labelledby="reader-response-title-living-seed"><div class="wrap reader-response-inner"><p class="eyebrow">Твоя черга</p><h2 id="reader-response-title-living-seed">Де наша база даних обрізає живу історію?</h2><p class="response-question">Яку частину історії рослини ми сьогодні втрачаємо просто тому, що наша база даних не має поля для цієї частини реальності? І контрпитання: де додаткова координата вже не допомагає, а лише створює красивий інформаційний бур’ян?</p><div class="edition-links"><a class="button primary" href="https://github.com/D4ttara/metacademy-of-humanity/issues/73#issuecomment-new" rel="external noopener noreferrer">Написати відповідь</a><a class="button" href="https://github.com/D4ttara/metacademy-of-humanity/issues/73" rel="external noopener noreferrer">Читати гілку</a></div></div></section></main>
<footer><div class="wrap">© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)</div></footer></body></html>`;
writeFileSync(outPath,html,'utf8');
for(const token of ['UA · v1.2','не викидати свідка лише тому, що він прийшов не з вашого факультету','не викинув маленький пакетик','v1.0 · historical HTML witness','v1.1 · canonical Markdown witness']) if(!html.includes(token)) throw new Error(`Living Seed renderer missing ${token}`);
console.log('LIVING_SEED_RENDER=PASS version=v1.2 lineage=v1.0+v1.1+v1.2 body=APPROVED');
