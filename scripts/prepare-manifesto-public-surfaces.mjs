import { readFileSync, writeFileSync } from 'node:fs';

function patch(path, transform, checks=[]){
  const before=readFileSync(path,'utf8');
  const after=transform(before);
  if(after===before) console.log(`PUBLIC_SURFACE_NOOP path=${path}`);
  writeFileSync(path,after,'utf8');
  for(const [label,test] of checks){
    if(!test(after)) throw new Error(`${label} failed for ${path}`);
  }
  console.log(`PUBLIC_SURFACE=PASS path=${path}`);
}

patch('manifesto/index.html', s=>{
  if(s.includes('MET_A_CADEMY_MANIFEST_V1.2_UA_PUBLIC.pdf')) return s;
  const md='<a class="button" href="../manifestos/archive/metacademy-continuity/v1.2/MET_A_CADEMY_MANIFEST_V1.2_UA.md">Canonical Markdown</a>';
  if(!s.includes(md)) throw new Error('UA manifesto canonical MD button not found');
  return s.replace(md, md+'<a class="button" href="../manifestos/archive/metacademy-continuity/v1.2/MET_A_CADEMY_MANIFEST_V1.2_UA_PUBLIC.pdf">PDF</a><a class="button" href="../manifestos/archive/metacademy-continuity/v1.2/MET_A_CADEMY_MANIFEST_V1.2_UA_PUBLIC.epub">EPUB</a><a class="button" href="../manifestos/archive/metacademy-continuity/v1.2/MET_A_CADEMY_MANIFEST_V1.2_UA_PUBLIC.docx">DOCX</a>');
},[['UA PDF link',s=>s.includes('V1.2_UA_PUBLIC.pdf')],['UA EPUB link',s=>s.includes('V1.2_UA_PUBLIC.epub')]]);

patch('manifesto/en/index.html', s=>{
  if(s.includes('MET_A_CADEMY_MANIFEST_V1.2_EN_PUBLIC.pdf')) return s;
  const md='<a class="button" href="../../manifestos/archive/metacademy-continuity/v1.2/MET_A_CADEMY_MANIFEST_V1.2_EN.md">Canonical Markdown</a>';
  if(!s.includes(md)) throw new Error('EN manifesto canonical MD button not found');
  return s.replace(md, md+'<a class="button" href="../../manifestos/archive/metacademy-continuity/v1.2/MET_A_CADEMY_MANIFEST_V1.2_EN_PUBLIC.pdf">PDF</a><a class="button" href="../../manifestos/archive/metacademy-continuity/v1.2/MET_A_CADEMY_MANIFEST_V1.2_EN_PUBLIC.epub">EPUB</a><a class="button" href="../../manifestos/archive/metacademy-continuity/v1.2/MET_A_CADEMY_MANIFEST_V1.2_EN_PUBLIC.docx">DOCX</a>');
},[['EN PDF link',s=>s.includes('V1.2_EN_PUBLIC.pdf')],['EN EPUB link',s=>s.includes('V1.2_EN_PUBLIC.epub')]]);

patch('documents/017-human-ai-what-or-we/ua/index.html', s=>{
  s=s.replace(/<meta property="og:image"[^>]*>/g,'');
  s=s.replace(/<meta name="twitter:image"[^>]*>/g,'');
  s=s.replace(/,"image":"https:\/\/d4ttara\.github\.io\/metacademy-of-humanity\/documents\/017-human-ai-what-or-we\/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_COVER_UA_v1\.0\.jpg"/g,'');
  s=s.replace(/<section class="document-hero">[\s\S]*?<\/section>\s*/,'');
  s=s.replaceAll('METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0.pdf','METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.pdf');
  s=s.replace('title="PDF reader edition"','title="Generated public PDF reader edition"');
  if(!s.includes('type="application/epub+zip"')){
    const pdfalt='<link rel="alternate" type="application/pdf" href="../METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.pdf" title="Generated public PDF reader edition">';
    s=s.replace(pdfalt,pdfalt+'<link rel="alternate" type="application/epub+zip" href="../METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.epub" title="EPUB reader edition">');
  }
  s=s.replace('>PDF · 29 сторінок</a>','>PDF</a>');
  if(!s.includes('>EPUB</a>')){
    const pdfbtn='<a class="button" href="../METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.pdf">PDF</a>';
    if(!s.includes(pdfbtn)) throw new Error('017 PDF button not found');
    s=s.replace(pdfbtn,pdfbtn+'<a class="button" href="../METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.epub">EPUB</a><a class="button" href="../METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.docx">DOCX</a>');
  }
  s=s.replace('Публічний список показує тільки вже оприлюднені маніфести. Архівний матеріал не стає публічним автоматично.','Публічний список розрізняє чинний канон і відкритий історичний lineage; архів не стає публічним автоматично, але вибрані історичні маніфести відкриті прямим рішенням автора.');
  return s;
},[
  ['017 public PDF',s=>s.includes('UA_v1.0_PUBLIC.pdf')],
  ['017 EPUB',s=>s.includes('UA_v1.0_PUBLIC.epub')],
  ['017 DOCX',s=>s.includes('UA_v1.0_PUBLIC.docx')],
  ['017 no broken cover',s=>!s.includes('HUMAN_AI_WHAT_OR_WE_COVER_UA_v1.0.jpg')]
]);

console.log('MANIFESTO_PUBLIC_SURFACES=PASS current_manifest=UA,EN document_017=UA cover_dependency=REMOVED formats=PDF,EPUB,DOCX');
