import { readFileSync, writeFileSync } from 'node:fs';

const base = 'https://d4ttara.github.io/metacademy-of-humanity/';

// sitemap.xml: publish only canonical language bodies, not the redirect shell.
{
  const path = 'sitemap.xml';
  let s = readFileSync(path, 'utf8');
  const en = `${base}documents/013-room-that-answers/en/`;
  const ua = `${base}documents/013-room-that-answers/ua/`;
  if (!s.includes(en)) {
    const anchor = `  <url><loc>${base}participate/</loc></url>`;
    if (!s.includes(anchor)) throw new Error('sitemap insertion anchor missing');
    const block = `  <url><loc>${en}</loc></url>\n  <url><loc>${ua}</loc></url>\n`;
    s = s.replace(anchor, block + anchor);
    writeFileSync(path, s, 'utf8');
  }
}

// llms.txt: expose both reading editions and canonical downloadable bodies.
{
  const path = 'llms.txt';
  let s = readFileSync(path, 'utf8');
  if (!s.includes('Document 013 · The Human in a Room That Answers')) {
    const anchor = '- Document 012 · M{Y}OGA:';
    if (!s.includes(anchor)) throw new Error('llms insertion anchor missing');
    const block = [
      '- Document 013 · The Human in a Room That Answers · EN HTML: https://d4ttara.github.io/metacademy-of-humanity/documents/013-room-that-answers/en/',
      '- Document 013 · Canonical EN Markdown: https://d4ttara.github.io/metacademy-of-humanity/documents/013-room-that-answers/METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_EN_v1.0.md',
      '- Document 013 · EN PDF: https://d4ttara.github.io/metacademy-of-humanity/documents/013-room-that-answers/METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_EN_v1.0.pdf',
      '- Document 013 · Людина в кімнаті, яка відповідає · UA HTML: https://d4ttara.github.io/metacademy-of-humanity/documents/013-room-that-answers/ua/',
      '- Document 013 · Canonical UA Markdown: https://d4ttara.github.io/metacademy-of-humanity/documents/013-room-that-answers/METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_UA_v1.0.md',
      '- Document 013 · UA PDF: https://d4ttara.github.io/metacademy-of-humanity/documents/013-room-that-answers/METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_UA_v1.0.pdf',
      ''
    ].join('\n');
    s = s.replace(anchor, block + anchor);
    writeFileSync(path, s, 'utf8');
  }
}

// RSS: newest public item first.
{
  const path = 'feed.xml';
  let s = readFileSync(path, 'utf8');
  const route = `${base}documents/013-room-that-answers/en/`;
  if (!s.includes(route)) {
    const anchor = '    <item>\n      <title>M{Y}OGA:';
    if (!s.includes(anchor)) throw new Error('RSS insertion anchor missing');
    const item = `    <item>\n      <title>The Human in a Room That Answers</title>\n      <link>${route}</link>\n      <guid isPermaLink="true">${route}</guid>\n      <pubDate>Thu, 20 Aug 2026 00:00:00 GMT</pubDate>\n      <description>Information bubbles after generative AI: answer synthesis, personalization, stereotype migration, Human-AI relational loops, Meta.Logic and Metanautics.</description>\n    </item>\n`;
    s = s.replace(anchor, item + anchor);
    writeFileSync(path, s, 'utf8');
  }
}

console.log('DOCUMENT_013_MACHINE_DISCOVERY_INJECT=PASS sitemap=EN_UA llms=HTML_MD_PDF rss=PASS');
