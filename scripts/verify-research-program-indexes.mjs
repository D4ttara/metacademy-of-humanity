import { existsSync, readFileSync } from 'node:fs';
const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const checks=[
 ['research/msl/index.html',['MSL · Semantic Research Layer','ACTIVE PUBLIC RESEARCH','SEMANTIC AGREEMENT != EXECUTABLE EQUIVALENCE']],
 ['research/lineage/index.html',['Research Lineage','PUBLIC RESEARCH INFRASTRUCTURE','ARCHIVE != CANON']],
 ['research/system/index.html',['Experimental Systems Research','RESEARCH CANDIDATE FIELD','RESEARCH CANDIDATE != DEPLOYED SYSTEM','MOR}4{MER / M4M']]
];
for(const [path,tokens] of checks){
 assert(existsSync(path),`missing ${path}`);const h=readFileSync(path,'utf8');
 for(const t of tokens)assert(h.includes(t),`${path} missing ${t}`);
 for(const t of ['PUBLIC INDEX != INTERNAL CORPUS','VISIBLE DIRECTION != VERIFIED IMPLEMENTATION','../../programs/','../'])assert(h.includes(t),`${path} missing boundary/navigation ${t}`);
 assert(h.includes('application/ld+json'),`${path} missing JSON-LD`);
}
const machine=JSON.parse(readFileSync('discovery/research-program-indexes.json','utf8'));
assert(machine.schema==='metacademy-public-research-indexes/v1','bad research index schema');
assert(machine.indexes.length===3,'expected three research indexes');
for(const id of ['msl','lineage','system'])assert(machine.indexes.some(x=>x.id===id),`machine index missing ${id}`);
const programs=[readFileSync('programs/index.html','utf8'),readFileSync('uk/programs/index.html','utf8')];
for(const h of programs)for(const route of ['/research/msl/','/research/lineage/','/research/system/'])assert(h.includes(route),`Programs surface missing ${route}`);
console.log('RESEARCH_PROGRAM_INDEXES_VERIFY=PASS indexes=3 boundaries=PASS programs_links=PASS machine=PASS');
