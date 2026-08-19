import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const base = 'https://d4ttara.github.io/metacademy-of-humanity/';
const rss = `${base}feed.xml`;

const walk = directory => readdirSync(directory).flatMap(name => {
  const path = join(directory, name);
  return statSync(path).isDirectory() && !['.git', 'node_modules'].includes(name) ? walk(path) : [path];
});

const decode = text => text
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
const attr = text => text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let changed = 0;
let articleJsonLd = 0;
const pages = walk(root).filter(path => path.endsWith('index.html'));

for (const path of pages) {
  const rel = relative(root, path).replaceAll('\\', '/');
  let html = readFileSync(path, 'utf8');
  const lang = html.match(/<html[^>]*\blang="([^"]+)"/i)?.[1] || 'en';
  const route = rel === 'index.html' ? '' : rel.replace(/index\.html$/, '');
  const canonical = `${base}${route}`;
  const title = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || 'MET[Ȧ]CADEMY OF HUMANITY');
  const existingDescription = html.match(/<meta\s+name="description"\s+content="([^"]*)"[^>]*>/i)?.[1];
  const lede = decode(html.match(/<p[^>]*class="[^"]*lede[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '');
  const fallback = lang === 'uk'
    ? 'MET[Ȧ]CADEMY OF HUMANITY — публічне дослідницьке поле про знання, людський досвід, ШІ, культуру, provenance та невідоме.'
    : 'MET[Ȧ]CADEMY OF HUMANITY — a public research field for knowledge, human experience, AI, culture, provenance and the unknown.';
  const description = decode(existingDescription || lede || fallback);
  const hasReader = /<article[^>]+id="read-online"/i.test(html);
  const additions = [];

  if (!/name="description"/i.test(html)) additions.push(`<meta name="description" content="${attr(description)}">`);
  if (!/name="robots"/i.test(html)) additions.push('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">');
  if (!/rel="canonical"/i.test(html)) additions.push(`<link rel="canonical" href="${canonical}">`);
  if (!/type="application\/rss\+xml"/i.test(html)) additions.push(`<link rel="alternate" type="application/rss+xml" title="MET[Ȧ]CADEMY OF HUMANITY · Publications" href="${rss}">`);

  if (!/property="og:type"/i.test(html)) additions.push(`<meta property="og:type" content="${hasReader ? 'article' : 'website'}">`);
  if (!/property="og:site_name"/i.test(html)) additions.push('<meta property="og:site_name" content="MET[Ȧ]CADEMY OF HUMANITY">');
  if (!/property="og:title"/i.test(html)) additions.push(`<meta property="og:title" content="${attr(title)}">`);
  if (!/property="og:description"/i.test(html)) additions.push(`<meta property="og:description" content="${attr(description)}">`);
  if (!/property="og:url"/i.test(html)) additions.push(`<meta property="og:url" content="${canonical}">`);
  if (!/name="twitter:card"/i.test(html)) additions.push('<meta name="twitter:card" content="summary">');
  if (!/name="twitter:title"/i.test(html)) additions.push(`<meta name="twitter:title" content="${attr(title)}">`);
  if (!/name="twitter:description"/i.test(html)) additions.push(`<meta name="twitter:description" content="${attr(description)}">`);

  if (hasReader && !/type="application\/ld\+json"/i.test(html)) {
    const published = html.match(/property="article:published_time"\s+content="([^"]+)"/i)?.[1];
    const modified = html.match(/property="article:modified_time"\s+content="([^"]+)"/i)?.[1] || published;
    const data = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url: canonical,
      mainEntityOfPage: canonical,
      inLanguage: lang === 'uk' ? 'uk' : 'en',
      author: { '@type': 'Person', name: 'Ievgen Karogod', alternateName: 'Dattara' },
      publisher: { '@type': 'Organization', name: 'MET[Ȧ]CADEMY OF HUMANITY', url: base },
      isPartOf: { '@type': 'WebSite', name: 'MET[Ȧ]CADEMY OF HUMANITY', url: base }
    };
    if (published) data.datePublished = published;
    if (modified) data.dateModified = modified;
    additions.push(`<script type="application/ld+json">${JSON.stringify(data)}</script>`);
    articleJsonLd += 1;
  }

  if (additions.length) {
    if (!html.includes('</head>')) throw new Error(`Missing </head>: ${rel}`);
    html = html.replace('</head>', `${additions.join('\n')}\n</head>`);
    writeFileSync(path, html, 'utf8');
    changed += 1;
  }
}

console.log(`DISCOVERY_META_ENRICH=PASS pages=${pages.length} changed=${changed} article_jsonld_added=${articleJsonLd} rss_autodiscovery=PASS canonical_fallback=PASS social_meta_fallback=PASS`);
