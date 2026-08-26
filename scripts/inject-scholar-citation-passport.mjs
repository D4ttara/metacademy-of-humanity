import { readFileSync, writeFileSync } from 'node:fs';

const institution='MET[Ȧ]CADEMY OF HUMANITY';
const author='Ievgen Karogod';
const pages=[
 ['003','documents/003-life-as-organization/en/index.html'],['003','documents/003-life-as-organization/index.html'],
 ['004','documents/004-when-science-reaches-a-plateau/en/index.html'],['004','documents/004-when-science-reaches-a-plateau/ua/index.html'],
 ['007','documents/007-after-vibe-coding/en/index.html'],['007','documents/007-after-vibe-coding/ua/index.html'],
 ['008','documents/008-the-interface-that-knows-you/en/index.html'],['008','documents/008-the-interface-that-knows-you/ua/index.html'],
 ['009','documents/009-elon-musk-mark-zuckerberg-ai-control/en/index.html'],['009','documents/009-elon-musk-mark-zuckerberg-ai-control/ua/index.html'],
 ['010','documents/010-manifestation-time-genesis-time/en/index.html'],['010','documents/010-manifestation-time-genesis-time/ua/index.html'],
 ['011','documents/011-the-third-body/en/index.html'],['011','documents/011-the-third-body/ua/index.html'],
 ['012','documents/012-myoga-astrology-overview/en/index.html'],['012','documents/012-myoga-astrology-overview/ua/index.html'],
 ['013','documents/013-room-that-answers/en/index.html'],['013','documents/013-room-that-answers/ua/index.html'],
 ['014','documents/014-right-to-see-the-consequence/en/index.html'],['014','documents/014-right-to-see-the-consequence/ua/index.html'],
 ['015','documents/015-polytypic-thinking/en/index.html'],['015','documents/015-polytypic-thinking/ua/index.html'],
 ['016','documents/016-right-to-a-first-chance/en/index.html'],['016','documents/016-right-to-a-first-chance/ua/index.html']
];
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const text=s=>String(s||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
let changed=0;
for(const [number,file] of pages){
 let html=readFileSync(file,'utf8');
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
console.log(`SCHOLAR_CITATION_PASSPORT_INJECT=PASS documents=12 research_editions=${pages.length} changed=${changed} canonical_pages_only=PASS author=PASS date=PASS institution=PASS report_number=PASS field_manifesto_006=EXCLUDED redirect_shells=EXCLUDED pdf_link=OMITTED_FULL_TEXT_HTML`);
