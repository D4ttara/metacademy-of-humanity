import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const siteBase = new URL('https://d4ttara.github.io/metacademy-of-humanity/');
const sitePrefix = siteBase.pathname;

const walk = directory => readdirSync(directory).flatMap(name => {
  const path = join(directory, name);
  return statSync(path).isDirectory() && !['.git', 'node_modules'].includes(name) ? walk(path) : [path];
});
const pages = walk(root).filter(path => path.endsWith('.html'));
const hrefPattern = /<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi;
const failures = [];
let checked = 0;
let fragments = 0;

const localPathForUrl = url => {
  if (url.origin !== siteBase.origin) return null;
  if (!url.pathname.startsWith(sitePrefix)) return null;
  const relativePath = decodeURIComponent(url.pathname.slice(sitePrefix.length));
  if (!relativePath) return join(root, 'index.html');
  const absolute = resolve(root, relativePath);
  if (!absolute.startsWith(resolve(root))) return null;
  if (url.pathname.endsWith('/')) return join(absolute, 'index.html');
  return absolute;
};

for (const page of pages) {
  const rel = relative(root, page).replaceAll('\\', '/');
  const route = rel === 'index.html' ? '' : rel.replace(/index\.html$/, '');
  const pageUrl = new URL(route, siteBase);
  const html = readFileSync(page, 'utf8');
  for (const match of html.matchAll(hrefPattern)) {
    const href = (match[1] ?? match[2] ?? match[3] ?? '').trim();
    if (!href || /^(?:mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    let url;
    try { url = new URL(href, pageUrl); }
    catch { failures.push(`${rel} -> invalid href ${href}`); continue; }
    const local = localPathForUrl(url);
    if (!local) continue;
    checked += 1;
    if (!existsSync(local)) {
      failures.push(`${rel} -> missing ${href} (${relative(root, local).replaceAll('\\', '/')})`);
      continue;
    }
    if (url.hash && local.endsWith('.html')) {
      fragments += 1;
      let id;
      try { id = decodeURIComponent(url.hash.slice(1)); } catch { id = url.hash.slice(1); }
      if (!id) continue;
      const target = readFileSync(local, 'utf8');
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const hasTarget = new RegExp(`(?:id|name)=["']${escaped}["']`, 'i').test(target);
      if (!hasTarget) failures.push(`${rel} -> missing fragment ${href}`);
    }
  }
}

if (failures.length) {
  console.error(`INTERNAL_LINK_VERIFY=FAIL count=${failures.length}`);
  failures.slice(0, 50).forEach(item => console.error(item));
  if (failures.length > 50) console.error(`... ${failures.length - 50} more`);
  process.exit(1);
}

console.log(`INTERNAL_LINK_VERIFY=PASS html_pages=${pages.length} local_hrefs=${checked} fragments=${fragments}`);
