import { readFileSync, writeFileSync } from 'node:fs';
const base='https://d4ttara.github.io/metacademy-of-humanity/';
{
 const path='sitemap.xml'; let s=readFileSync(path,'utf8'); const en=`${base}documents/014-right-to-see-the-consequence/en/`; const ua=`${base}documents/014-right-to-see-the-consequence/ua/`;
 if(!s.includes(en)){const anchor=`  <url><loc>${base}documents/013-room-that-answers/en/</loc></url>`; if(!s.includes(anchor)) throw new Error('sitemap 013 anchor missing'); s=s.replace(anchor,`  <url><loc>${en}</loc></url>\n  <url><loc>${ua}</loc></url>\n`+anchor); writeFileSync(path,s,'utf8');}
}
{
 const path='llms.txt'; let s=readFileSync(path,'utf8'); if(!s.includes('Document 014 · The Right to See the Consequence')){const anchor='- Document 013 · The Human in a Room That Answers'; if(!s.includes(anchor)) throw new Error('llms 013 anchor missing'); const block=[
 '- Document 014 · The Right to See the Consequence · EN HTML: https://d4ttara.github.io/metacademy-of-humanity/documents/014-right-to-see-the-consequence/en/',
 '- Document 014 · Canonical EN Markdown: https://d4ttara.github.io/metacademy-of-humanity/documents/014-right-to-see-the-consequence/METACADEMY_DOCUMENT_014_RIGHT_TO_SEE_THE_CONSEQUENCE_EN_v1.0.md',
 '- Document 014 · EN PDF: https://d4ttara.github.io/metacademy-of-humanity/documents/014-right-to-see-the-consequence/METACADEMY_DOCUMENT_014_RIGHT_TO_SEE_THE_CONSEQUENCE_EN_v1.0.pdf',
 '- Document 014 · Право бачити наслідок · UA HTML: https://d4ttara.github.io/metacademy-of-humanity/documents/014-right-to-see-the-consequence/ua/',
 '- Document 014 · Canonical UA Markdown: https://d4ttara.github.io/metacademy-of-humanity/documents/014-right-to-see-the-consequence/METACADEMY_DOCUMENT_014_RIGHT_TO_SEE_THE_CONSEQUENCE_UA_v1.0.md',
 '- Document 014 · UA PDF: https://d4ttara.github.io/metacademy-of-humanity/documents/014-right-to-see-the-consequence/METACADEMY_DOCUMENT_014_RIGHT_TO_SEE_THE_CONSEQUENCE_UA_v1.0.pdf',''].join('\n'); s=s.replace(anchor,block+anchor); writeFileSync(path,s,'utf8');}
}
{
 const path='feed.xml'; let s=readFileSync(path,'utf8'); const route=`${base}documents/014-right-to-see-the-consequence/en/`; if(!s.includes(route)){const anchor='    <item>\n      <title>The Human in a Room That Answers</title>'; if(!s.includes(anchor)) throw new Error('RSS 013 anchor missing'); const item=`    <item>\n      <title>The Right to See the Consequence</title>\n      <link>${route}</link>\n      <guid isPermaLink="true">${route}</guid>\n      <pubDate>Mon, 24 Aug 2026 00:00:00 GMT</pubDate>\n      <description>Punitive humanism, graphic health warnings, stigma, self-models, alternative apertures and the design of consequence visibility without humiliation.</description>\n    </item>\n`; s=s.replace(anchor,item+anchor); writeFileSync(path,s,'utf8');}
}
console.log('DOCUMENT_014_MACHINE_DISCOVERY_INJECT=PASS sitemap=EN_UA llms=HTML_MD_PDF rss=PASS');
