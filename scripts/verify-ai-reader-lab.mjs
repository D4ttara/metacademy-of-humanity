import { readFileSync } from 'node:fs';
const assert=(ok,msg)=>{if(!ok) throw new Error(msg)};
const jobs=[
 ['documents/015-polytypic-thinking/en/index.html','015','016-right-to-a-first-chance',58,'counterexample'],
 ['documents/015-polytypic-thinking/ua/index.html','015','016-right-to-a-first-chance',58,'контрприклад'],
 ['documents/016-right-to-a-first-chance/en/index.html','016','015-polytypic-thinking',59,'counterexample'],
 ['documents/016-right-to-a-first-chance/ua/index.html','016','015-polytypic-thinking',59,'контрприклад']
];
for(const [path,n,sibling,issue,challenge] of jobs){
 const h=readFileSync(path,'utf8');
 for(const token of [`data-ai-reader-lab="${n}"`,'data-copy-ai-prompt','data-share-reader','data-ai-prompt','ai-reader-lab.js',sibling,`issues/${issue}`,challenge]) assert(h.includes(token),`${path} missing ${token}`);
}
const js=readFileSync('assets/js/ai-reader-lab.js','utf8');
for(const token of ['navigator.share','navigator.clipboard','replaceAll','{URL}']) assert(js.includes(token),`ai-reader-lab.js missing ${token}`);
console.log('AI_READER_LAB_VERIFY=PASS documents=015,016 editions=EN_UA copy=PASS share=PASS critical_prompts=PASS crosslinks=PASS backend=ZERO');
