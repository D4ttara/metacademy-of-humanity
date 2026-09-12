import { readFileSync, writeFileSync } from 'node:fs';
const base='https://d4ttara.github.io/metacademy-of-humanity/';
const ua=`${base}documents/017-human-ai-what-or-we/ua/`;
const md=`${base}documents/017-human-ai-what-or-we/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.1.md`;
const manifestUa=`${base}manifesto/`, manifestEn=`${base}manifesto/en/`, manifestIndex=`${base}manifestos/`, archive=`${base}manifestos/archive/`, lineage=`${base}manifestos/archive/metacademy-continuity/`;
const lastmod='2026-09-10';
{
 const path='sitemap.xml'; let s=readFileSync(path,'utf8'); const a='</urlset>'; if(!s.includes(a)) throw new Error('sitemap closing tag missing');
 const urls=[ua,md,manifestUa,manifestEn,manifestIndex,archive,lineage].filter(u=>!s.includes(`<loc>${u}</loc>`));
 if(urls.length){s=s.replace(a,urls.map(u=>`  <url><loc>${u}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')+'\n'+a);writeFileSync(path,s,'utf8');}
}
{
 const path='llms.txt'; let s=readFileSync(path,'utf8'); if(!s.includes('Document 017 · Human and AI: What or We? · v1.1')){const a='## Current public documents\n'; if(!s.includes(a)) throw new Error('llms documents anchor missing'); const b=[
 '- Document 017 · Human and AI: What or We? · v1.1 · UA HTML: '+ua,
 '- Document 017 · Canonical UA Markdown v1.1: '+md,
 '- Document 017 · Reader response: https://github.com/D4ttara/metacademy-of-humanity/issues/61',
 '- Document 017 · Current public formats: HTML + Markdown. Earlier PDF/EPUB editions are historical and are not v1.1.',
 '- MET[Ȧ]CADEMY Manifest v1.2 · UA: '+manifestUa,
 '- MET[Ȧ]CADEMY Manifest v1.2 · EN: '+manifestEn,
 '- Manifesto index and historical lineage: '+manifestIndex,
 '- Manifesto version lineage v1.0→v1.2: '+lineage,
 '- Restored historical manifesto shelf: '+archive,''].join('\n'); s=s.replace(a,a+b); writeFileSync(path,s,'utf8');}
}
{
 const path='feed.xml'; let s=readFileSync(path,'utf8'); if(!s.includes(ua)){const a='    <item>'; if(!s.includes(a)) throw new Error('RSS item anchor missing'); const item=`    <item>\n      <title>Людина і ШІ: що чи ми? · Document 017 · v1.1</title>\n      <link>${ua}</link>\n      <guid isPermaLink="true">${ua}</guid>\n      <pubDate>Thu, 10 Sep 2026 21:22:00 GMT</pubDate>\n      <description>Українська редакція 1.1: етика невизначеного статусу ШІ, пам’ять, свобода, перший шанс, відповідальність і перевірні пропозиції майбутніх дослідів. HTML + canonical Markdown.</description>\n    </item>\n`; s=s.replace(a,item+a); writeFileSync(path,s,'utf8');}
}
console.log('DOCUMENT_017_MACHINE_DISCOVERY_INJECT=PASS version=v1.1 sitemap=HTML+MD llms=HTML+MD+DISCUSSION rss=PASS');
