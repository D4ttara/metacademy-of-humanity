import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const assert=(ok,msg)=>{if(!ok) throw new Error(msg)};
const expected=[
 ['003',53,'003-life-as-organization',['documents/003-life-as-organization/en/index.html','documents/003-life-as-organization/index.html']],
 ['004',54,'004-when-science-reaches-a-plateau',['documents/004-when-science-reaches-a-plateau/en/index.html','documents/004-when-science-reaches-a-plateau/ua/index.html']],
 ['006',55,'006-myoga-jyotish',['documents/006-myoga-jyotish/index.html']],
 ['007',45,'007-after-vibe-coding',['documents/007-after-vibe-coding/en/index.html','documents/007-after-vibe-coding/ua/index.html']],
 ['008',46,'008-the-interface-that-knows-you',['documents/008-the-interface-that-knows-you/en/index.html','documents/008-the-interface-that-knows-you/ua/index.html']],
 ['009',47,'009-elon-musk-mark-zuckerberg-ai-control',['documents/009-elon-musk-mark-zuckerberg-ai-control/en/index.html','documents/009-elon-musk-mark-zuckerberg-ai-control/ua/index.html']],
 ['010',48,'010-manifestation-time-genesis-time',['documents/010-manifestation-time-genesis-time/en/index.html','documents/010-manifestation-time-genesis-time/ua/index.html']],
 ['011',49,'011-the-third-body',['documents/011-the-third-body/en/index.html','documents/011-the-third-body/ua/index.html']],
 ['012',50,'012-myoga-astrology-overview',['documents/012-myoga-astrology-overview/en/index.html','documents/012-myoga-astrology-overview/ua/index.html']],
 ['013',51,'013-room-that-answers',['documents/013-room-that-answers/en/index.html','documents/013-room-that-answers/ua/index.html']],
 ['014',39,'014-right-to-see-the-consequence',['documents/014-right-to-see-the-consequence/en/index.html','documents/014-right-to-see-the-consequence/ua/index.html']],
 ['015',58,'015-polytypic-thinking',['documents/015-polytypic-thinking/en/index.html','documents/015-polytypic-thinking/ua/index.html']],
 ['016',59,'016-right-to-a-first-chance',['documents/016-right-to-a-first-chance/en/index.html','documents/016-right-to-a-first-chance/ua/index.html']]
];
let editions=0;
for(const [n,issue,slug,pages] of expected) for(const file of pages){
 const h=readFileSync(file,'utf8'); editions++;
 for(const token of [`id="ai-reader-lab-${n}"`,`data-ai-reader-lab="${n}"`,'data-ai-reader-mode="tailored"','data-ai-reader-jump',`href="#ai-reader-lab-${n}"`,'data-copy-ai-prompt','data-copy-citation','data-share-reader','data-ai-prompt','aria-live="polite"',`aria-labelledby="ai-reader-title-${n}"`,'ai-reader-lab.js',`issues/${issue}`]) assert(h.includes(token),`${file} missing ${token}`);
 const isUA=file.includes('/ua/')||file.endsWith('/003-life-as-organization/index.html')||file.endsWith('/006-myoga-jyotish/index.html');
 assert(h.includes(isUA?'Не погоджуйся автоматично':'Do not agree automatically'),`${file} missing adversarial instruction`);
}
function walk(dir,out=[]){for(const name of readdirSync(dir)){const p=path.posix.join(dir,name);const s=statSync(p);if(s.isDirectory())walk(p,out);else if(name==='index.html')out.push(p);}return out;}
let readerPages=0;
for(const file of walk('documents')){const h=readFileSync(file,'utf8'); const m=h.match(/data-reader-document="(\d{3})"/); if(!m) continue; readerPages++; const n=m[1]; assert(h.includes(`data-ai-reader-lab="${n}"`),`${file} is reader-enabled but AI Reader Lab is missing`); assert(h.includes('data-copy-ai-prompt')&&h.includes('data-copy-citation')&&h.includes('data-share-reader'),`${file} missing zero-service AI controls`);}
const surfaces=[['index.html','en'],['uk/index.html','ua'],['documents/index.html','en'],['uk/documents/index.html','ua'],['research/index.html','en'],['uk/research/index.html','ua'],['updates/index.html','en'],['uk/updates/index.html','ua']];
let discovery=0;
for(const [file] of surfaces){const h=readFileSync(file,'utf8'); for(const [n,,slug] of expected){if(!h.includes(slug)) continue; assert(h.includes(`data-ai-reader-discovery="${n}"`)||h.includes(`data-ai-reader-frontpage="${n}"`),`${file} mentions ${slug} but has no AI critique entry`); discovery++;}}
const js=readFileSync('assets/js/ai-reader-lab.js','utf8');
for(const token of ['navigator.share','navigator.clipboard','replaceAll','{URL}','shareCard','citation_technical_report_number','data-copy-citation']) assert(js.includes(token),`ai-reader-lab.js missing ${token}`);
assert(expected.length===13,'public publication map changed unexpectedly');
console.log(`AI_READER_LAB_VERIFY=PASS publications=${expected.length} editions=${editions} reader_pages=${readerPages} discovery_checks=${discovery} tailored=PASS future_reader_guard=PASS copy_prompt=PASS copy_citation=PASS share_card=PASS aria=PASS critical_prompts=PASS backend=ZERO`);
