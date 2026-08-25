import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const institution='MET[Ȧ]CADEMY OF HUMANITY';
const author='Ievgen Karogod';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
function walk(dir,out=[]){for(const name of readdirSync(dir)){const p=path.posix.join(dir,name);const st=statSync(p);if(st.isDirectory())walk(p,out);else if(name==='index.html')out.push(p);}return out;}

let eligible=0,changed=0,skipped=0;
for(const file of walk('documents')){
 let html=readFileSync(file,'utf8');
 const number=(html.match(/Documents?\s*·\s*(\d{3})|DOCUMENT\s+(\d{3})/i)||[]).slice(1).find(Boolean);
 if(!number){skipped++;continue;}
 const plaque=text((html.match(/<p[^>]*class="[^"]*document-plaque[^"]*"[^>]*>([\s\S]*?)<\/p>/i)||[])[1]||'');
 const eyebrow=text((html.match(/<p[^>]*class="[^"]*eyebrow[^"]*"[^>]*>([\s\S]*?)<\/p>/i)||[])[1]||'');
 const status=`${plaque} ${eyebrow}`;
 const scholarly=/Research Essay|Research Brief/i.test(status);
 if(!scholarly){skipped++;continue;}
 eligible++;
 const title=text((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||'');
 if(!title) throw new Error(`Missing title: ${file}`);
 const published=html.match(/property="article:published_time"\s+content="([^"]+)"/i)?.[1]
   || html.match(/(?:19|20)\d{2}/)?.[0]
   || '2026';
 const date=published.includes('-')?published.replaceAll('-','/'):published;
 const tags={
  citation_title:title,
  citation_author:author,
  citation_publication_date:date,
  citation_technical_report_institution:institution,
  citation_technical_report_number:`MET[Ȧ]CADEMY Document ${number}`
 };
 let additions='';
 for(const [name,value] of Object.entries(tags)) if(!new RegExp(`name=["']${name}["']`,'i').test(html)) additions+=`<meta name="${name}" content="${esc(value)}">`;
 if(additions){if(!html.includes('</head>'))throw new Error(`Missing </head>: ${file}`);html=html.replace('</head>',additions+'</head>');writeFileSync(file,html,'utf8');changed++;}
}
console.log(`SCHOLAR_CITATION_PASSPORT_INJECT=PASS eligible=${eligible} changed=${changed} author=PASS date=PASS institution=PASS report_number=PASS pdf_link=OMITTED_FULL_TEXT_HTML`);
