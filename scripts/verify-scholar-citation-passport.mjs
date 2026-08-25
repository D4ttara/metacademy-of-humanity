import { readFileSync } from 'node:fs';
const pages=[
 'documents/003-life-as-organization/en/index.html','documents/003-life-as-organization/index.html',
 'documents/004-when-science-reaches-a-plateau/en/index.html','documents/004-when-science-reaches-a-plateau/ua/index.html',
 'documents/007-after-vibe-coding/en/index.html','documents/007-after-vibe-coding/ua/index.html',
 'documents/008-the-interface-that-knows-you/en/index.html','documents/008-the-interface-that-knows-you/ua/index.html',
 'documents/009-elon-musk-mark-zuckerberg-ai-control/en/index.html','documents/009-elon-musk-mark-zuckerberg-ai-control/ua/index.html',
 'documents/010-manifestation-time-genesis-time/en/index.html','documents/010-manifestation-time-genesis-time/ua/index.html',
 'documents/011-the-third-body/en/index.html','documents/011-the-third-body/ua/index.html',
 'documents/012-myoga-astrology-overview/en/index.html','documents/012-myoga-astrology-overview/ua/index.html',
 'documents/013-room-that-answers/en/index.html','documents/013-room-that-answers/ua/index.html',
 'documents/014-right-to-see-the-consequence/en/index.html','documents/014-right-to-see-the-consequence/ua/index.html',
 'documents/015-polytypic-thinking/en/index.html','documents/015-polytypic-thinking/ua/index.html',
 'documents/016-right-to-a-first-chance/en/index.html','documents/016-right-to-a-first-chance/ua/index.html'
];
const required=['citation_title','citation_author','citation_publication_date','citation_technical_report_institution','citation_technical_report_number'];
for(const file of pages){const h=readFileSync(file,'utf8');for(const name of required)if(!new RegExp(`<meta name=["']${name}["']`,'i').test(h))throw new Error(`${file} missing ${name}`);if(!h.includes('content="Ievgen Karogod"'))throw new Error(`${file} missing canonical citation author`);if(!h.includes('MET[Ȧ]CADEMY Document'))throw new Error(`${file} missing report number`);}
const manifesto=readFileSync('documents/006-myoga-jyotish/index.html','utf8');
if(manifesto.includes('citation_technical_report_number'))throw new Error('Field Manifesto 006 must not be mislabeled as a Scholar technical report');
console.log(`SCHOLAR_CITATION_PASSPORT_VERIFY=PASS research_editions=${pages.length} required_tags=${required.length} field_manifesto_006=EXCLUDED pdf_link=OMITTED_FULL_TEXT_HTML`);
