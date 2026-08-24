import { readFileSync, writeFileSync } from 'node:fs';
const path='documents/015-polytypic-thinking/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_UA_v1.0.md';
let s=readFileSync(path,'utf8');
const replacements=[
  ['паспорти знання й доказів (Knowledge / Evidence Passports)','паспорти знання й доказів'],
  ['[Огляд J. David Smith](https://pmc.ncbi.nlm.nih.gov/articles/PMC3947400/)','[Огляд Дж. Девіда Сміта](https://pmc.ncbi.nlm.nih.gov/articles/PMC3947400/)'],
  ['[«ШІ generates covertly racist decisions about people based on their dialect»](https://www.nature.com/articles/s41586-024-07856-5)','[дослідженні про приховано расистські рішення ШІ на основі діалекту](https://www.nature.com/articles/s41586-024-07856-5)'],
  ['широке використання LLM як writing assistants','широке використання мовних моделей як помічників у письмі'],
  ['і ставить мітку ERROR.','і ставить мітку «ПОМИЛКА».']
];
for (const [a,b] of replacements) {
  if (!s.includes(a)) throw new Error(`Document 015 UA final-language anchor missing: ${a}`);
  s=s.replace(a,b);
}
writeFileSync(path,s,'utf8');
console.log('DOCUMENT_015_UA_FINAL_LANGUAGE_POLISH=PASS');
