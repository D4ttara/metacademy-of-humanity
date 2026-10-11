import { readFileSync, existsSync } from 'node:fs';
const root='documents/017-sar-sanskrit-semantic-recognition';
const must=[
 `${root}/en/index.html`,
 `${root}/ua/index.html`,
 `${root}/METACADEMY_DOCUMENT_017_SAR_SANSKRIT_SEMANTIC_RECOGNITION_EN_v1.0.md`,
 `${root}/METACADEMY_DOCUMENT_017_SAR_SANSKRIT_SEMANTIC_RECOGNITION_UA_v1.0.md`,
 'publications/PUBLICATION_BUILD_RECEIPT_017_v1.0.json'
];
for(const p of must) if(!existsSync(p)) throw new Error(`missing ${p}`);
for(const [p,tokens] of [
 [`${root}/en/index.html`,['S{Ȧ}R','issues/77','support/','data-static-render="true"']],
 [`${root}/ua/index.html`,['S{Ȧ}R','issues/77','support/','data-static-render="true"']],
 ['sitemap.xml',['017-sar-sanskrit-semantic-recognition/en/','017-sar-sanskrit-semantic-recognition/ua/']],
 ['llms.txt',['Document 017','issues/77']],
 ['feed.xml',["S{Ȧ}R: Don't Translate Sanskrit Too Early",'017-sar-sanskrit-semantic-recognition/en/']],
 ['publications/PUBLICATION_REGISTRY.yml',['number: "017"','sar-sanskrit-semantic-recognition','issues/77']]
]){ const s=readFileSync(p,'utf8'); for(const t of tokens) if(!s.includes(t)) throw new Error(`${p} missing ${t}`); }
console.log('DOCUMENT_017_VERIFY=PASS editions=EN,UA discovery=PASS support=PASS discussion=77');