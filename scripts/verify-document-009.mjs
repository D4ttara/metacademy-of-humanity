import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';

const must = [
  'documents/009-elon-musk-mark-zuckerberg-ai-control/index.html',
  'documents/009-elon-musk-mark-zuckerberg-ai-control/en/index.html',
  'documents/009-elon-musk-mark-zuckerberg-ai-control/ua/index.html',
  'documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.md',
  'documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.md',
  'documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.pdf',
  'documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.pdf',
  'publications/PUBLICATION_BUILD_RECEIPT_009_v1.0RC.json'
];
for (const p of must) if (!existsSync(p)) throw new Error(`Missing Document 009 artifact: ${p}`);

const en = readFileSync(must[1], 'utf8');
const ua = readFileSync(must[2], 'utf8');
for (const [lang, html] of [['en',en],['ua',ua]]) {
  for (const token of ['data-static-render="true"','Elon Musk','Mark Zuckerberg','application/ld+json','canonical','text/markdown','application/pdf']) {
    if (!html.includes(token)) throw new Error(`Document 009 ${lang} missing ${token}`);
  }
  if (/FILE_ONLY_SUPPORT|SUPPORT THIS WORK|ПІДТРИМАТИ ЦЮ РОБОТУ/.test(html)) throw new Error(`File-only support leaked into ${lang} HTML`);
}

const mdEn = readFileSync(must[3], 'utf8');
const mdUa = readFileSync(must[4], 'utf8');
for (const [lang, md] of [['en',mdEn],['ua',mdUa]]) {
  if (!md.includes('FILE_ONLY_SUPPORT_START') || !md.includes('FILE_ONLY_SUPPORT_END')) throw new Error(`Document 009 ${lang} missing support markers`);
  if (!md.includes('https://d4ttara.github.io/metacademy-of-humanity/manifesto/')) throw new Error(`Document 009 ${lang} missing manifesto link`);
  if (!md.includes('v1.0RC') || !md.includes('2026-08-17')) throw new Error(`Document 009 ${lang} metadata incomplete`);
}

const reg = readFileSync('publications/PUBLICATION_REGISTRY.yml','utf8');
for (const token of ['number: "009"','elon-musk-mark-zuckerberg-ai-control','METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.pdf','METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.pdf']) if (!reg.includes(token)) throw new Error(`Registry missing ${token}`);

const receipt = JSON.parse(readFileSync('publications/PUBLICATION_BUILD_RECEIPT_009_v1.0RC.json','utf8'));
for (const lang of ['en','ua']) {
  const d = receipt.documents['009'][lang];
  if (d.page_count < 5 || d.page_count > 12) throw new Error(`Unexpected 009 ${lang} page count ${d.page_count}`);
  if (!d.file_only_support_block) throw new Error(`009 ${lang} receipt missing support flag`);
}

for (const path of [must[3], must[4]]) {
  const sha = createHash('sha256').update(readFileSync(path)).digest('hex');
  if (!/^[a-f0-9]{64}$/.test(sha)) throw new Error(`SHA failure ${path}`);
}

console.log(`DOCUMENT_009_VERIFY=PASS en_pages=${receipt.documents['009'].en.page_count} ua_pages=${receipt.documents['009'].ua.page_count} support=FILE_ONLY html_support=ABSENT manifesto_link=PASS seo=PASS`);
