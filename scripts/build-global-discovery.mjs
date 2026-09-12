import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, posix, relative, sep } from 'node:path';

const SITE='https://d4ttara.github.io/metacademy-of-humanity';
const AUTHOR='Ievgen Karogod / Dattara';
const ORG='MET[Ȧ]CADEMY OF HUMANITY';
const ROOTS=['index.html','manifesto','manifestos','documents','research','science-aperture','fields','library','participate','updates','support','legal','uk','topics','start','corpus','programs','questions','memory','identity','discover'];
const SKIP_SEGMENTS=new Set(['source','source_parts','node_modules','.git']);

function walk(path){
  if(!existsSync(path)) return [];
  const st=statSync(path);
  if(st.isFile()) return path.endsWith('.html')?[path]:[];
  const out=[];
  for(const name of readdirSync(path)){
    if(SKIP_SEGMENTS.has(name)) continue;
    const p=join(path,name);
    const s=statSync(p);
    if(s.isDirectory()) out.push(...walk(p));
    else if(name==='index.html') out.push(p);
  }
  return out;
}

const files=[...new Set(ROOTS.flatMap(walk))].sort();
const fileSet=new Set(files.map(p=>relative('.',p).split(sep).join('/')));
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const strip=s=>String(s??'').replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const cap=(s,n=220)=>s.length<=n?s:s.slice(0,n-1).replace(/\s+\S*$/,'')+'…';
const has=(s,re)=>re.test(s);

function canonicalFor(file){
  const r=relative('.',file).split(sep).join('/');
  if(r==='index.html') return SITE+'/';
  return SITE+'/'+r.replace(/index\.html$/,'');
}
function languageOf(html,file){
  const m=html.match(/<html[^>]*\blang=["']([^"']+)["']/i);
  if(m) return m[1].toLowerCase().startsWith('uk')?'uk':'en';
  const r='/'+relative('.',file).split(sep).join('/');
  return r.includes('/uk/')||r.includes('/ua/')?'uk':'en';
}
function titleOf(html){
  const t=html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]||html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]||ORG;
  return strip(t);
}
function descOf(html,title,lang){
  const m=html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)||html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i);
  if(m) return cap(strip(m[1]));
  const body=html.match(/<main[^>]*>([\s\S]*?)<\/main>/i)?.[1]||html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]||'';
  const ps=[...body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(x=>strip(x[1])).filter(x=>x.length>80);
  if(ps[0]) return cap(ps[0]);
  return lang==='uk'?`${title}. Публічна сторінка ${ORG}: дослідження, книги, маніфести та відкриті матеріали з перевірним походженням.`:`${title}. Public ${ORG} page: research, books, manifestos and open materials with explicit provenance.`;
}
function typeOf(file){
  const r='/'+relative('.',file).split(sep).join('/');
  if(/\/documents\/|\/manifesto\/|\/free-reading\//.test(r)) return 'Article';
  if(/\/books\/|\/library\//.test(r)) return 'CreativeWork';
  if(/\/topics\/|\/corpus\/|\/programs\/|\/research\/|\/start\//.test(r)) return 'CollectionPage';
  return 'WebPage';
}
function relFileFromUrl(url){
  if(!url.startsWith(SITE+'/')) return null;
  const p=url.slice((SITE+'/').length);
  return p?`${p}index.html`:'index.html';
}
function languageAlternates(canonical){
  const out=[];
  if(canonical.endsWith('/en/')){
    const ua=canonical.slice(0,-4)+'/ua/'; if(fileSet.has(relFileFromUrl(ua))) out.push(['uk',ua]);
  } else if(canonical.endsWith('/ua/')){
    const en=canonical.slice(0,-4)+'/en/'; if(fileSet.has(relFileFromUrl(en))) out.push(['en',en]);
  } else if(canonical===SITE+'/'){
    if(fileSet.has('uk/index.html')) out.push(['uk',SITE+'/uk/']);
  } else if(canonical===SITE+'/uk/'){
    out.push(['en',SITE+'/']);
  }
  return out;
}
function insertHead(html,chunk){ return html.replace(/<\/head>/i,chunk+'\n</head>'); }
function ensure(html,re,chunk){ return has(html,re)?html:insertHead(html,chunk); }

const entries=[];
let changed=0;
for(const file of files){
  let html=readFileSync(file,'utf8');
  const before=html;
  const canonical=html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1]||canonicalFor(file);
  const lang=languageOf(html,file);
  const title=titleOf(html);
  const description=descOf(html,title,lang);
  const schemaType=typeOf(file);
  const ogType=schemaType==='Article'?'article':'website';

  html=ensure(html,/<link[^>]+rel=["']canonical["']/i,`<link rel="canonical" href="${esc(canonical)}">`);
  html=ensure(html,/<meta[^>]+name=["']description["']/i,`<meta name="description" content="${esc(description)}">`);
  html=ensure(html,/<meta[^>]+name=["']author["']/i,`<meta name="author" content="${AUTHOR}">`);
  html=ensure(html,/<meta[^>]+name=["']robots["']/i,'<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">');
  html=ensure(html,/<meta[^>]+name=["']googlebot["']/i,'<meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">');
  html=ensure(html,/<meta[^>]+name=["']bingbot["']/i,'<meta name="bingbot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">');
  html=ensure(html,/<link[^>]+rel=["']author["']/i,`<link rel="author" href="${SITE}/identity/">`);
  html=ensure(html,/<link[^>]+type=["']application\/rss\+xml["']/i,`<link rel="alternate" type="application/rss+xml" href="${SITE}/feed.xml" title="${ORG} updates">`);
  html=ensure(html,/<link[^>]+href=["'][^"']*llms\.txt["']/i,`<link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="AI discovery index">`);
  html=ensure(html,/<meta[^>]+property=["']og:site_name["']/i,`<meta property="og:site_name" content="${ORG}">`);
  html=ensure(html,/<meta[^>]+property=["']og:type["']/i,`<meta property="og:type" content="${ogType}">`);
  html=ensure(html,/<meta[^>]+property=["']og:title["']/i,`<meta property="og:title" content="${esc(title)}">`);
  html=ensure(html,/<meta[^>]+property=["']og:description["']/i,`<meta property="og:description" content="${esc(description)}">`);
  html=ensure(html,/<meta[^>]+property=["']og:url["']/i,`<meta property="og:url" content="${esc(canonical)}">`);
  html=ensure(html,/<meta[^>]+name=["']twitter:card["']/i,'<meta name="twitter:card" content="summary">');
  html=ensure(html,/<meta[^>]+name=["']twitter:title["']/i,`<meta name="twitter:title" content="${esc(title)}">`);
  html=ensure(html,/<meta[^>]+name=["']twitter:description["']/i,`<meta name="twitter:description" content="${esc(description)}">`);

  for(const [hreflang,href] of languageAlternates(canonical)){
    if(!html.includes(`hreflang="${hreflang}"`)&&!html.includes(`hreflang='${hreflang}'`)) html=insertHead(html,`<link rel="alternate" hreflang="${hreflang}" href="${href}">`);
  }
  if(!/hreflang=["']x-default["']/i.test(html)) html=insertHead(html,`<link rel="alternate" hreflang="x-default" href="${canonical}">`);

  if(!html.includes('data-global-discovery-jsonld="v1"')){
    const graph={
      '@context':'https://schema.org','@graph':[
        {'@type':'Organization','@id':SITE+'/#organization','name':ORG,'alternateName':['METACADEMY OF HUMANITY','MetaAcademy of Humanity','MoH'],'url':SITE+'/','founder':{'@id':SITE+'/#author'},'sameAs':['https://github.com/D4ttara/metacademy-of-humanity']},
        {'@type':'Person','@id':SITE+'/#author','name':AUTHOR,'url':SITE+'/identity/'},
        {'@type':'WebSite','@id':SITE+'/#website','url':SITE+'/','name':ORG,'publisher':{'@id':SITE+'/#organization'},'inLanguage':['en','uk']},
        {'@type':schemaType,'@id':canonical+'#webpage','url':canonical,'name':title,'description':description,'inLanguage':lang,'isPartOf':{'@id':SITE+'/#website'},'publisher':{'@id':SITE+'/#organization'},'author':{'@id':SITE+'/#author'}}
      ]
    };
    html=insertHead(html,`<script type="application/ld+json" data-global-discovery-jsonld="v1">${JSON.stringify(graph)}</script>`);
  }

  if(!html.includes('data-global-discovery-nav="v1"')&&/<\/main>/i.test(html)){
    const label=lang==='uk'?'ПОШУК + ШІ':'SEARCH + AI';
    const heading=lang==='uk'?'Знайти, процитувати, передати іншій системі':'Find, cite, or pass this page to another system';
    const ai=lang==='uk'?'AI-індекс':'AI index';
    const identity=lang==='uk'?'Авторство й цитування':'Identity & citation';
    const block=`<section class="related-publication-links ai-discovery-links" data-global-discovery-nav="v1"><div class="wrap"><p class="eyebrow">${label}</p><h2>${heading}</h2><div class="edition-links"><a class="button" href="${SITE}/ai-index.json">${ai}</a><a class="button" href="${SITE}/llms.txt">llms.txt</a><a class="button" href="${SITE}/feed.xml">RSS</a><a class="button" href="${SITE}/identity/">${identity}</a><a class="button" href="${SITE}/topics/">Topics</a></div></div></section>`;
    html=html.replace(/<\/main>/i,block+'\n</main>');
  }

  if(html!==before){ writeFileSync(file,html,'utf8'); changed++; }
  const md=html.match(/<link[^>]+type=["']text\/markdown["'][^>]+href=["']([^"']+)["']/i)?.[1]||null;
  entries.push({url:canonical,title,description,language:lang,type:schemaType,markdown:md});
}

const unique=[...new Map(entries.map(x=>[x.url,x])).values()].sort((a,b)=>a.url.localeCompare(b.url));
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+unique.map(x=>`  <url><loc>${esc(x.url)}</loc></url>`).join('\n')+'\n</urlset>\n';
writeFileSync('sitemap.xml',sitemap,'utf8');

const aiIndex={schema:'metacademy-public-ai-index/v1',site:SITE+'/',name:ORG,author:AUTHOR,languages:['en','uk'],discovery:{sitemap:SITE+'/sitemap.xml',rss:SITE+'/feed.xml',llms:SITE+'/llms.txt',llms_full:SITE+'/llms-full.txt',identity:SITE+'/identity/',repository:'https://github.com/D4ttara/metacademy-of-humanity'},boundaries:['PUBLIC INDEX != INTERNAL CORPUS','ARCHIVE != CANON','RESEARCH CANDIDATE != DEPLOYED SYSTEM'],entries:unique};
writeFileSync('ai-index.json',JSON.stringify(aiIndex,null,2)+'\n','utf8');

const llmsFull=[`# ${ORG} · full public URL index`,'',`Canonical site: ${SITE}/`,`Author: ${AUTHOR}`,'Languages: English, Ukrainian','Status: public research and cultural corpus; preserve provenance, status and uncertainty labels when citing.','',`Machine index: ${SITE}/ai-index.json`,`Sitemap: ${SITE}/sitemap.xml`,`RSS: ${SITE}/feed.xml`,`Repository: https://github.com/D4ttara/metacademy-of-humanity`,'','## Public pages',...unique.map(x=>`- [${x.language.toUpperCase()} · ${x.type}] ${x.title}: ${x.url}`),'','## Citation boundary','PUBLIC INDEX != INTERNAL CORPUS. ARCHIVE != CANON. RESEARCH CANDIDATE != DEPLOYED SYSTEM.',''].join('\n');
writeFileSync('llms-full.txt',llmsFull,'utf8');

console.log(`GLOBAL_DISCOVERY_BUILD=PASS html=${unique.length} changed=${changed} sitemap=${unique.length} ai_index=${unique.length} llms_full=${unique.length}`);
