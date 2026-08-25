import { readFileSync, existsSync } from 'node:fs';
const read=p=>readFileSync(p,'utf8'), fail=m=>{throw new Error(m)}, root='documents/016-right-to-a-first-chance';
for(const lang of ['en','ua']){
 const U=lang.toUpperCase(), md=`${root}/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_${U}_v1.0.md`, pdf=md.replace('.md','.pdf'), html=`${root}/${lang}/index.html`;
 if(!existsSync(md)||!existsSync(pdf)||!existsSync(html)) fail(`missing 016 artifact ${lang}`);
 const m=read(md), h=read(html);
 if(/^(?:[-*]\s+|\d+\.\s+)/m.test(m)) fail(`list marker in ${md}`);
 for(const t of ['data-static-render="true"','Download','issues/59','data-issue="59"','data-github-issue-comments','application/ld+json','canonical','application/pdf','text/markdown']) if(lang==='en'&&!h.includes(t)) fail(`${html} missing ${t}`);
 for(const t of ['data-static-render="true"','Завантажити','issues/59','data-issue="59"','data-github-issue-comments','application/ld+json','canonical','application/pdf','text/markdown']) if(lang==='ua'&&!h.includes(t)) fail(`${html} missing ${t}`);
 if(h.includes('<ul')||h.includes('<ol')) fail(`forbidden list markup in ${html}`);
 if(lang==='ua') for(const t of ['Заслуга людини не дорівнює попередньому доступу до системи','не всяка цифровізація є людинизацією','А може, замість однієї лише людинизації нам іноді потрібна людинація?','у майбутнього немає попереднього досвіду бути майбутнім']) if(!m.includes(t)) fail(`UA anchor missing ${t}`);
 if(lang==='en') for(const t of ["A person’s merit is not the same thing as previous access to a system",'bureaucratisation with an electronic signature','humanation','the future has no previous experience of being the future']) if(!m.includes(t)) fail(`EN anchor missing ${t}`);
}
for(const [p,tokens] of [['sitemap.xml',['016-right-to-a-first-chance/en/','016-right-to-a-first-chance/ua/']],['llms.txt',['Document 016 · The Right to a First Chance','METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_UA_v1.0.pdf','issues/59']],['feed.xml',['The Right to a First Chance','016-right-to-a-first-chance/en/']],['publications/PUBLICATION_REGISTRY.yml',['number: "016"','right-to-a-first-chance','issues/59']]]){const s=read(p); for(const t of tokens) if(!s.includes(t)) fail(`${p} missing ${t}`);}
for(const p of ['index.html','uk/index.html','documents/index.html','uk/documents/index.html','research/index.html','uk/research/index.html','updates/index.html','uk/updates/index.html']) if(!read(p).includes('016-right-to-a-first-chance')) fail(`${p} missing Document 016`);
console.log('DOCUMENT_016_VERIFY=PASS md=EN_UA pdf=EN_UA html=EN_UA lists=ZERO comments=59 downloads=PASS support=PASS registry=PASS discovery=PASS surfaces=8 relational_anchors=PASS');
