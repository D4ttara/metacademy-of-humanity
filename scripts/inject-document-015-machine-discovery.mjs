import { readFileSync, writeFileSync } from 'node:fs';
const base='https://d4ttara.github.io/metacademy-of-humanity/';
const en=`${base}documents/015-polytypic-thinking/en/`;
const ua=`${base}documents/015-polytypic-thinking/ua/`;

{
  const path='sitemap.xml'; let s=readFileSync(path,'utf8');
  if(!s.includes(en)){
    const anchor='</urlset>';
    if(!s.includes(anchor)) throw new Error('sitemap closing tag missing');
    const block=`  <url><loc>${en}</loc></url>\n  <url><loc>${ua}</loc></url>\n`;
    s=s.replace(anchor,block+anchor); writeFileSync(path,s,'utf8');
  }
}
{
  const path='llms.txt'; let s=readFileSync(path,'utf8');
  if(!s.includes('Document 015 · Polytypic Thinking')){
    const anchor='## Current public documents\n';
    if(!s.includes(anchor)) throw new Error('llms documents anchor missing');
    const block=[
      '- Document 015 · Polytypic Thinking · EN HTML: https://d4ttara.github.io/metacademy-of-humanity/documents/015-polytypic-thinking/en/',
      '- Document 015 · Canonical EN Markdown: https://d4ttara.github.io/metacademy-of-humanity/documents/015-polytypic-thinking/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_EN_v1.0.md',
      '- Document 015 · EN PDF: https://d4ttara.github.io/metacademy-of-humanity/documents/015-polytypic-thinking/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_EN_v1.0.pdf',
      '- Document 015 · Політипічне мислення · UA HTML: https://d4ttara.github.io/metacademy-of-humanity/documents/015-polytypic-thinking/ua/',
      '- Document 015 · Canonical UA Markdown: https://d4ttara.github.io/metacademy-of-humanity/documents/015-polytypic-thinking/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_UA_v1.0.md',
      '- Document 015 · UA PDF: https://d4ttara.github.io/metacademy-of-humanity/documents/015-polytypic-thinking/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_UA_v1.0.pdf',
      '- Document 015 · Reader response: https://github.com/D4ttara/metacademy-of-humanity/issues/58',
      ''
    ].join('\n');
    s=s.replace(anchor,anchor+block); writeFileSync(path,s,'utf8');
  }
}
{
  const path='feed.xml'; let s=readFileSync(path,'utf8');
  if(!s.includes(en)){
    const anchor='    <item>';
    if(!s.includes(anchor)) throw new Error('RSS item anchor missing');
    const item=`    <item>\n      <title>Polytypic Thinking</title>\n      <link>${en}</link>\n      <guid isPermaLink="true">${en}</guid>\n      <pubDate>Tue, 25 Aug 2026 00:00:00 GMT</pubDate>\n      <description>When one correct answer becomes a framing error: categorization, stereotypes, human-AI feedback loops, novelty and the right of a typology to be revised by the phenomenon.</description>\n    </item>\n`;
    s=s.replace(anchor,item+anchor); writeFileSync(path,s,'utf8');
  }
}
console.log('DOCUMENT_015_MACHINE_DISCOVERY_INJECT=PASS sitemap=EN_UA llms=HTML_MD_PDF_DISCUSSION rss=PASS');
