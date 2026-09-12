import { createHash } from 'node:crypto';
import { basename } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';

// Build-generated pages are deliberately enhanced here too, so Pages and any direct verifier
// see the same LIT-000 -> six book units -> LIT-007 publication frame.
await import('./enhance-moh-free-reading-paratexts.mjs');
// Global search/AI metadata is built after all public literary routes exist, so the same
// canonical surfaces reach ordinary search engines and answer engines.
await import('./build-global-discovery.mjs');

const cfg=JSON.parse(readFileSync('publications/MOH_FREE_READING_UA_v76.json','utf8'));
const root='uk/books/memories-of-humanity/book-1/free-reading';
const must=(x,m)=>{if(!x)throw new Error(m)};
const text=p=>readFileSync(p,'utf8');
const hash=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const exists=p=>must(existsSync(p),`missing ${p}`);

must(cfg.language==='uk','language must remain uk only');
must(cfg.pieces.length===6,'expected exactly six free-reading book units');
must(cfg.research_boundary==='FICTION != RESEARCH EVIDENCE','research boundary changed');
must(cfg.translation_policy.includes('No English edition'),'English publication boundary missing');

for(const [i,p] of cfg.pieces.entries()){
  exists(p.source_path);
  const got=hash(p.source_path);
  if(got!==p.sha256){
    const b=readFileSync(p.source_path);
    const plusLf=createHash('sha256').update(Buffer.concat([b,Buffer.from('\n')])).digest('hex');
    must(plusLf===p.sha256,`${p.id} source SHA mismatch direct=${got} +LF=${plusLf} expected=${p.sha256}`);
  }
  const reader=`${root}/readers/${p.id}.md`; exists(reader);
  if(p.id==='LIT-005'){
    must(text(p.source_path).includes('](#section-19)'),`${p.id} source witness lost original internal anchor`);
    must(!text(reader).includes('](#section-19)'),`${p.id} reader still has broken standalone anchor`);
    must(text(reader).includes(cfg.full_book_url),`${p.id} route repair does not point to full book`);
  }else must(text(reader)===text(p.source_path),`${p.id} reader differs from source without declared transform`);
  const page=`${root}/${p.slug}/index.html`; exists(page); const h=text(page);
  must(h.includes(`${p.id} ·`),`${p.id} plaque missing`);
  must(h.includes(p.sha256),`${p.id} visible source receipt missing`);
  must(h.includes(`data-issue="${p.discussion_issue}"`),`${p.id} reader-response issue missing`);
  must(h.includes(`issues/${p.discussion_issue}`),`${p.id} discussion link missing`);
  must(h.includes(cfg.full_book_url),`${p.id} full-book link missing`);
  must(h.includes('/metacademy-of-humanity/support/'),`${p.id} support route missing`);
  must(h.includes(cfg.support.monobank),`${p.id} Monobank missing`);
  must(h.includes(cfg.support.paypal),`${p.id} PayPal missing`);
  must(h.includes(cfg.support.usdt_trc20),`${p.id} USDT missing`);
  must(h.includes('isAccessibleForFree'),`${p.id} free-access structured metadata missing`);
  must(h.includes('hreflang="uk"'),`${p.id} Ukrainian hreflang missing`);
  must(!h.includes('hreflang="en"'),`${p.id} fabricated English sibling found`);
  must(h.includes('data-esthete-outro="v2"'),`${p.id} Esthete bridge missing`);
  must(h.includes('../esthete-review/'),`${p.id} Esthete closing route missing`);
  const sourceName=basename(p.source_path);
  must(h.includes(`../source/${sourceName}`),`${p.id} source Markdown route missing`);
  for(const ext of ['pdf','epub']) exists(`${root}/formats/MOH_FREE_READING_UA_v76_${p.id}.${ext}`);
  if(i<cfg.pieces.length-1) must(h.includes(`../${cfg.pieces[i+1].slug}/`),`${p.id} next navigation missing`);
}

for(const p of cfg.pieces) must(!text(p.source_path).includes('## Глава IV.'),`${p.id} crosses free boundary into Chapter IV`);

const landing=text(`${root}/index.html`);
for(const p of cfg.pieces){must(landing.includes(`${p.slug}/`),`landing missing ${p.id}`);must(landing.includes(p.title),`landing title missing ${p.id}`)}
must(landing.includes(cfg.source.sha256),'landing master provenance missing');
must(landing.includes('FREE ACCESS != COPYRIGHT WAIVER'),'copyright boundary missing');
must(landing.includes('data-skuf-preface="LIT-000"'),'opening Skuf card missing');
must(landing.includes('data-esthete-closing="LIT-007"'),'closing Esthete card missing');
must(landing.includes('Скуф → шість художніх текстів → Естет'),'literary frame order missing');
must(!landing.includes('hreflang="en"'),'landing fabricated English sibling found');

for(const f of ['MOH_LIT_000_SKUF_REVIEW_UA','MOH_LIT_007_ESTHETE_REVIEW_UA']){
  for(const ext of ['pdf','epub']) exists(`${root}/formats/${f}.${ext}`);
}

const books=text('uk/books/index.html');must(books.includes('data-moh-free-reading="v76"'),'UA Books discovery missing');must(books.includes('memories-of-humanity/book-1/free-reading/'),'UA Books route missing');
const updates=text('uk/updates/index.html');must(updates.includes('data-moh-free-reading-update="v76"'),'UA Updates discovery missing');
const home=text('uk/index.html');must(home.includes('data-moh-free-reading-home="v76"'),'UA Home discovery missing');
const sitemap=text('sitemap.xml'), llms=text('llms.txt'), feed=text('feed.xml');
const landingUrl='https://d4ttara.github.io/metacademy-of-humanity/uk/books/memories-of-humanity/book-1/free-reading/';
must(sitemap.includes(landingUrl),'sitemap landing missing');
must(llms.includes('MoH Free Reading · Book I · UA v76'),'llms literary section missing');
for(const p of cfg.pieces){const url=`${landingUrl}${p.slug}/`;must(sitemap.includes(url),`sitemap missing ${p.id}`);must(llms.includes(url),`llms missing ${p.id}`);must(feed.includes(url),`RSS missing ${p.id}`)}
for(const slug of ['skuf-review','esthete-review']){const url=`${landingUrl}${slug}/`;must(sitemap.includes(url),`sitemap missing ${slug}`);must(llms.includes(url),`llms missing ${slug}`);must(feed.includes(url),`RSS missing ${slug}`)}

exists('publications/MOH_FREE_READING_UA_v76_BUILD_RECEIPT.json');
exists('publications/MOH_FREE_READING_UA_v76_FORMAT_RECEIPT.json');
exists('publications/MOH_LIT_000_SKUF_REVIEW_UA_FORMAT_RECEIPT.json');
exists('publications/MOH_LIT_007_ESTHETE_REVIEW_UA_FORMAT_RECEIPT.json');

const enBooks=text('books/index.html');
must(!enBooks.includes('MOH-FREE-READING-UA-v76'),'English books index received UA publication marker');

await import('./verify-moh-lit-000-skuf.mjs');
await import('./verify-moh-lit-007-esthete.mjs');
await import('./verify-global-discovery.mjs');
console.log(`MOH_FREE_READING_VERIFY=PASS book_units=${cfg.pieces.length} frame=LIT-000..007 public_routes=9 pdf=8 epub=8 issues=63-68,71,72 english=ZERO free_boundary=BEFORE_CHAPTER_IV`);
