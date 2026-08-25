import { readFileSync, writeFileSync } from 'node:fs';
const issue='https://github.com/D4ttara/metacademy-of-humanity/issues/59';
const jobs=[
 ['index.html','Research edition · 25 August 2026',`<article class="newspaper-lead" data-frontpage-document="016" data-document-feature="016"><p class="newspaper-label">LEAD · DOCUMENT 016 · RESEARCH ESSAY · 25 AUG</p><h3>The Right to a First Chance</h3><p class="newspaper-summary">A cultural fund, an entry-level vacancy, a research grant and a digital welfare portal look like different machines. They can share one bug: the door may reward evidence that somebody has already been inside. This essay asks how a system can test potential without pretending that an unrealised future should already have a CV.</p><div class="newspaper-actions"><a href="documents/016-right-to-a-first-chance/en/">Read Document 016 →</a><a data-reader-discussion="016" href="${issue}">Reader question →</a></div></article>`],
 ['uk/index.html','Дослідницький випуск · 25 серпня 2026',`<article class="newspaper-lead" data-frontpage-document="016" data-document-feature="016"><p class="newspaper-label">ГОЛОВНА · DOCUMENT 016 · ДОСЛІДНИЦЬКЕ ЕСЕ · 25 СЕРП</p><h3>Право на перший шанс</h3><p class="newspaper-summary">Культурний фонд, вакансія junior, науковий грант і цифровий соціальний портал виглядають різними машинами. Але в них може бути спільний глюк: двері винагороджують докази того, що людина вже якось була всередині. Есе питає, як перевіряти потенціал, не вимагаючи від ще не реалізованого майбутнього готового CV.</p><div class="newspaper-actions"><a href="../documents/016-right-to-a-first-chance/ua/">Читати Document 016 →</a><a data-reader-discussion="016" href="${issue}">Питання до тексту →</a></div></article>`]
];
for(const [path,date,lead] of jobs){
 let h=readFileSync(path,'utf8'); const re=/<article class="newspaper-lead"[\s\S]*?<\/article>/; const m=h.match(re); if(!m) throw new Error(`newspaper lead missing: ${path}`);
 const previous=m[0].replace('class="newspaper-lead"','class="newspaper-story"');
 h=h.replace(re,lead).replace(/Research edition · 24 August 2026|Дослідницький випуск · 24 серпня 2026/,date);
 const grid='<div class="newspaper-grid">'; if(!h.includes(grid)) throw new Error(`newspaper grid missing: ${path}`); h=h.replace(grid,grid+previous);
 writeFileSync(path,h,'utf8');
}
console.log('DOCUMENT_016_NEWSPAPER_PROMOTION=PASS lead=016 preserved_previous_lead=014 editions=EN_UA discussion=59');
