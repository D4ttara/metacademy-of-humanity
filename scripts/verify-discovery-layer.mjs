import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const read = path => readFileSync(join(root, path), 'utf8');
const fail = message => { throw new Error(message); };
const base = 'https://d4ttara.github.io/metacademy-of-humanity/';

const docs = [
  ['007-after-vibe-coding', 'METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING'],
  ['008-the-interface-that-knows-you', 'METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU'],
  ['009-elon-musk-mark-zuckerberg-ai-control', 'METACADEMY_DOCUMENT_009_AI_CONTROL'],
  ['010-manifestation-time-genesis-time', 'METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME'],
  ['011-the-third-body', 'METACADEMY_DOCUMENT_011_THIRD_BODY'],
  ['012-myoga-astrology-overview', 'METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW']
];

for (const [slug] of docs) {
  for (const lang of ['en', 'ua']) {
    const page = `documents/${slug}/${lang}/index.html`;
    if (!existsSync(join(root, page))) fail(`Missing public article page: ${page}`);
    const html = read(page);
    for (const token of ['rel="canonical"', 'name="robots"', 'hreflang="x-default"', 'data-markdown-source=', 'data-static-render="true"']) {
      if (!html.includes(token)) fail(`Article discovery/static token missing ${token}: ${page}`);
    }
    if (html.includes('Loading canonical Markdown') || html.includes('Завантаження canonical Markdown')) fail(`JS placeholder survived deployment render: ${page}`);
    if (!/<article id="read-online"[\s\S]*?<a\s+[^>]*href=/i.test(html)) fail(`Static article has no clickable links: ${page}`);
  }
}

const sitemap = read('sitemap.xml');
for (const slug of ['010-manifestation-time-genesis-time', '011-the-third-body', '012-myoga-astrology-overview']) {
  for (const suffix of ['', 'en/', 'ua/']) {
    const url = `${base}documents/${slug}/${suffix}`;
    if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`sitemap.xml missing ${url}`);
  }
}
for (const url of sitemap.match(/<loc>([^<]+)<\/loc>/g) ?? []) {
  const absolute = url.slice(5, -6);
  if (!absolute.startsWith(base)) continue;
  const relative = absolute.slice(base.length);
  const local = relative === '' ? 'index.html' : relative.endsWith('/') ? `${relative}index.html` : relative;
  if (!existsSync(join(root, local))) fail(`sitemap.xml points to missing local file: ${local}`);
}

const llms = read('llms.txt');
for (const token of ['Document 010', 'Document 011', 'Document 012', 'sitemap.xml', 'PUBLICATION_REGISTRY.yml']) {
  if (!llms.includes(token)) fail(`llms.txt missing discovery token: ${token}`);
}
for (const absolute of llms.match(/https:\/\/d4ttara\.github\.io\/metacademy-of-humanity\/[^\s]+/g) ?? []) {
  const clean = absolute.replace(/[),.;]+$/, '');
  const relative = clean.slice(base.length);
  const local = relative === '' ? 'index.html' : relative.endsWith('/') ? `${relative}index.html` : relative;
  if (!existsSync(join(root, local))) fail(`llms.txt points to missing local file: ${local}`);
}

const feed = read('feed.xml');
for (const token of ['<rss version="2.0"', '<atom:link', '010-manifestation-time-genesis-time', '011-the-third-body', '012-myoga-astrology-overview']) {
  if (!feed.includes(token)) fail(`RSS feed missing token: ${token}`);
}

const siteJs = read('assets/js/site.js');
for (const token of ['dataset.staticRender === "true"', 'data-copy-link', 'navigator.share', 'safeHref', 'https?:\\/\\/']) {
  if (!siteJs.includes(token)) fail(`site.js discovery/share guard missing: ${token}`);
}

console.log('DISCOVERY_LAYER_VERIFY=PASS articles=007-012 static_html=PASS links=CLICKABLE sitemap=PASS llms=PASS rss=PASS share=COPY_NATIVE');
