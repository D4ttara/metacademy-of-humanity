import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const base = 'https://d4ttara.github.io/metacademy-of-humanity/';
const editions = [
  ['uk','uk/','UA'],['en','','EN'],['de','de/','DE'],
  ['es','es/','ES'],['fr','fr/','FR'],['ru','ru/','RU']
];
const read = p => fs.readFileSync(path.join(root,p),'utf8');
const check = (ok,msg) => {if(!ok) throw new Error('MESONET publication: '+msg);};
const urls = editions.map(([language,dir])=>base+dir+'commons/manifesto/');
const hreflangs = [...editions.map(([lang])=>lang),'x-default'];
const copyright = '© 2026 Ievgen Karogod / Dattara · MET[Ȧ]CADEMY OF HUMANITY (MoH)';
for(let i=0;i<editions.length;i++){
 const [lang,dir,sourceCode] = editions[i];
 const htmlPath=dir+'commons/manifesto/index.html';
 const mdPath=dir+'commons/manifesto/source/METACADEMY_MESONET_COMMONS_MANIFEST_'+sourceCode+'_v0.3_2026-10-15.md';
 const html=read(htmlPath),md=read(mdPath);
 const match=html.match(/<nav class="manifest-languages"[\s\S]*?<\/nav>/);
 check(!!match,lang+' no language navigation');
 const links=[...match[0].matchAll(/<a\s+[^>]*href="([^"]+)"/g)].map(m=>m[1]);
 check(links.length===6,lang+' must expose exactly six language links');
 check(urls.every(u=>links.includes(u)),lang+' missing cross-edition link');
 check(match[0].includes('aria-current="page"'),lang+' current edition not distinguished');
 check(html.includes('<html lang="'+lang+'">'),lang+' wrong HTML language');
 check(html.includes('<link rel="canonical" href="'+urls[i]+'">'),lang+' canonical URL wrong');
 for(const code of hreflangs) check(html.includes('hreflang="'+code+'"'),lang+' missing hreflang '+code);
 check(html.includes('href="source/'+path.basename(mdPath)+'"'),lang+' source link missing');
 check(md.includes(lang==='uk'?'### XVIII.':'### XIX.'),lang+' full text possibly truncated (final chapter)');
 if(lang==='ru')check(md.includes('### XX.'),lang+' Russian XX missing');
 check(html.includes(copyright)&&md.includes(copyright),lang+' rights missing');
 check(!/docs\.google\.com\/document\/d\//.test(html+md),lang+' private source URL leaked');
 check(md.includes('## '+({uk:'Читати іншою мовою',en:'Read in another language',de:'In einer anderen Sprache lesen',es:'Leer en otro idioma',fr:'Lire dans une autre langue',ru:'Читать на другом языке'})[lang]),lang+' markdown links missing');
}
for(const [p,eyebrow] of [['index.html','MESONET COMMONS · Public working manifesto v0.3'],['uk/index.html','MESONET COMMONS · Публічна робоча редакція']]){
 const s=read(p),hero=s.indexOf('<section class="hero">'),feature=s.indexOf(eyebrow),following=s.indexOf('id="featured-017"');
 check(hero>=0&&feature>hero&&following>feature,p+' feature not directly after hero');
 check(s.indexOf(eyebrow)===s.lastIndexOf(eyebrow),p+' duplicate feature');
}
for(const p of ['manifesto/index.html','uk/manifesto/index.html']) check(read(p).includes('MESONET COMMONS · '+(p.startsWith('uk/')?'Повний маніфест UA v0.3':'Full Manifesto EN v0.3')),p+' missing separate card');
const sitemap=read('sitemap.xml'),llms=read('llms.txt'),readme=read('README.md');
for(const u of urls)check(sitemap.includes('<loc>'+u+'</loc>')&&llms.includes(u),u+' missing from public indexes');
check(editions.every(([lang,dir])=>readme.includes(']('+dir+'commons/manifesto/)')),'README manifest index incomplete');
console.log('MESONET v0.3: 6 editions / 36 links / six-language metadata / source and privacy checks PASS');
