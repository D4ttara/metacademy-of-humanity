import { readFileSync, existsSync } from 'node:fs';
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const base='https://d4ttara.github.io/metacademy-of-humanity/';
const numbers=['003','004','006','007','008','009','010','011','012','013','014','015','016'];
const editions=[
 ['003','documents/003-life-as-organization/en/index.html'],['003','documents/003-life-as-organization/index.html'],
 ['004','documents/004-when-science-reaches-a-plateau/en/index.html'],['004','documents/004-when-science-reaches-a-plateau/ua/index.html'],
 ['006','documents/006-myoga-jyotish/index.html'],
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
for(const p of ['corpus/index.html','uk/corpus/index.html','programs/index.html','uk/programs/index.html','discovery/public-corpus.json','discovery/public-programs.json'])assert(existsSync(p),`missing ${p}`);
const corpusEn=readFileSync('corpus/index.html','utf8'),corpusUa=readFileSync('uk/corpus/index.html','utf8');
for(const [h,label] of [[corpusEn,'EN corpus'],[corpusUa,'UA corpus']]){
 for(const n of numbers)assert(h.includes(`data-corpus-document="${n}"`),`${label} missing Document ${n}`);
 assert(h.includes('AI critique')||h.includes('ШІ-критика'),`${label} missing AI critique links`);
 assert(h.includes('github.com/D4ttara/metacademy-of-humanity/issues/'),`${label} missing challenge links`);
}
const pEn=readFileSync('programs/index.html','utf8'),pUa=readFileSync('uk/programs/index.html','utf8');
for(const token of ['human-ai','semantic','epistemology','agency-access','life-relations','myoga','memory-lineage','experimental-compute','culture-multilingual']){
 assert(pEn.includes(`data-public-program="${token}"`),`EN programs missing ${token}`);assert(pUa.includes(`data-public-program="${token}"`),`UA programs missing ${token}`);
}
for(const guard of ['PUBLIC DESCRIPTION != EXECUTABLE MATURITY','RESEARCH CANDIDATE != DEPLOYED SYSTEM','ARCHIVE != CANON']){assert(pEn.includes(guard),`EN programs missing guard ${guard}`);assert(pUa.includes(guard),`UA programs missing guard ${guard}`)}
assert(pEn.includes('MOR}4{MER')&&pEn.includes('RESEARCH CANDIDATE'),'experimental compute status lost');
assert(pEn.includes('IMAGO')&&pEn.includes('MSL + МІЖ')&&pEn.includes('M{Y}OGA JYOTISH'),'public program identities missing');
for(const [n,path] of editions){assert(existsSync(path),`missing edition ${path}`);const h=readFileSync(path,'utf8');assert(h.includes(`data-corpus-rail="${n}"`),`${path} missing corpus rail`);assert(h.includes(`data-breadcrumb-document="${n}"`),`${path} missing breadcrumb passport`);assert(h.includes(`#ai-reader-lab-${n}`),`${path} missing AI critique route`);assert(h.includes('/corpus/')&&h.includes('/programs/'),`${path} missing corpus/program routes`)}
assert(editions.length===25,'expected 25 canonical public editions');
const corpusMachine=JSON.parse(readFileSync('discovery/public-corpus.json','utf8'));assert(corpusMachine.schema==='metacademy-public-corpus/v1','bad corpus schema');assert(corpusMachine.count===13&&corpusMachine.documents.length===13,'bad corpus count');
const programMachine=JSON.parse(readFileSync('discovery/public-programs.json','utf8'));assert(programMachine.schema==='metacademy-public-programs/v1','bad programs schema');assert(programMachine.programs.length===9,'expected nine public programs');assert(programMachine.guards.length===3,'program guards missing');
const startEn=readFileSync('start/index.html','utf8'),startUa=readFileSync('uk/start/index.html','utf8');for(const n of numbers){assert(startEn.includes(`Document ${n}`),`Start EN missing ${n}`);assert(startUa.includes(`Document ${n}`),`Start UA missing ${n}`)}
const trails=JSON.parse(readFileSync('discovery/research-trails.json','utf8'));assert(trails.coverage?.public_documents===13,'Start Here machine coverage not thirteen');assert(trails.trails.length===6,'Start Here should have six trails');
for(const [path,ua] of [['index.html',false],['uk/index.html',true],['research/index.html',false],['uk/research/index.html',true],['documents/index.html',false],['uk/documents/index.html',true]]){const h=readFileSync(path,'utf8');assert(h.includes('data-corpus-programs-entry'),`${path} missing corpus/program entry`)}
const sitemap=readFileSync('sitemap.xml','utf8');for(const route of ['corpus/','uk/corpus/','programs/','uk/programs/'])assert(sitemap.includes(base+route),`sitemap missing ${route}`);
const llms=readFileSync('llms.txt','utf8');assert(llms.includes('## Public Corpus & Research Programs'),'llms missing corpus/program section');assert(llms.includes('discovery/public-corpus.json')&&llms.includes('discovery/public-programs.json'),'llms missing machine passports');
console.log(`CORPUS_PROGRAMS_VERIFY=PASS documents=${numbers.length} editions=${editions.length} programs=${programMachine.programs.length} corpus_rails=PASS breadcrumbs=PASS start_here=13 sitemap=PASS llms=PASS`);
