import { readFileSync, writeFileSync } from 'node:fs';
const base='https://d4ttara.github.io/metacademy-of-humanity/';
const en=`${base}documents/016-right-to-a-first-chance/en/`, ua=`${base}documents/016-right-to-a-first-chance/ua/`;
const lastmod='2026-08-25';
{
 const path='sitemap.xml'; let s=readFileSync(path,'utf8'); if(!s.includes(en)){const a='</urlset>'; if(!s.includes(a)) throw new Error('sitemap closing tag missing'); s=s.replace(a,`  <url><loc>${en}</loc><lastmod>${lastmod}</lastmod></url>\n  <url><loc>${ua}</loc><lastmod>${lastmod}</lastmod></url>\n`+a); writeFileSync(path,s,'utf8');}
}
{
 const path='llms.txt'; let s=readFileSync(path,'utf8'); if(!s.includes('Document 016 · The Right to a First Chance')){const a='## Current public documents\n'; if(!s.includes(a)) throw new Error('llms documents anchor missing'); const b=[
 '- Document 016 · The Right to a First Chance · EN HTML: '+en,
 '- Document 016 · Canonical EN Markdown: '+base+'documents/016-right-to-a-first-chance/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_EN_v1.0.md',
 '- Document 016 · EN PDF: '+base+'documents/016-right-to-a-first-chance/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_EN_v1.0.pdf',
 '- Document 016 · Право на перший шанс · UA HTML: '+ua,
 '- Document 016 · Canonical UA Markdown: '+base+'documents/016-right-to-a-first-chance/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_UA_v1.0.md',
 '- Document 016 · UA PDF: '+base+'documents/016-right-to-a-first-chance/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_UA_v1.0.pdf',
 '- Document 016 · Reader response: https://github.com/D4ttara/metacademy-of-humanity/issues/59',''].join('\n'); s=s.replace(a,a+b); writeFileSync(path,s,'utf8');}
}
{
 const path='feed.xml'; let s=readFileSync(path,'utf8'); if(!s.includes(en)){const a='    <item>'; if(!s.includes(a)) throw new Error('RSS item anchor missing'); const item=`    <item>\n      <title>The Right to a First Chance</title>\n      <link>${en}</link>\n      <guid isPermaLink="true">${en}</guid>\n      <pubDate>Tue, 25 Aug 2026 09:00:00 GMT</pubDate>\n      <description>Art funding, entry-level work, administrative burden, digitalisation and cumulative advantage meet in a question about who gets a fair first chance.</description>\n    </item>\n`; s=s.replace(a,item+a); writeFileSync(path,s,'utf8');}
}
console.log('DOCUMENT_016_MACHINE_DISCOVERY_INJECT=PASS sitemap=EN_UA lastmod=2026-08-25 llms=HTML_MD_PDF_DISCUSSION rss=PASS');
