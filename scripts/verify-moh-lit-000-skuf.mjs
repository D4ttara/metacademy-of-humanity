import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const meta=JSON.parse(readFileSync('publications/MOH_LIT_000_SKUF_REVIEW_UA.json','utf8'));
const root='uk/books/memories-of-humanity/book-1/free-reading';
const must=(x,m)=>{if(!x) throw new Error(m)};
const bytes=p=>readFileSync(p);
const text=p=>readFileSync(p,'utf8');
const hash=b=>createHash('sha256').update(b).digest('hex');
const exists=p=>must(existsSync(p),`missing ${p}`);
const exactOrTerminalLf=(path,expected,label)=>{
  exists(path);
  const b=bytes(path), direct=hash(b);
  if(direct===expected){console.log(`${label}=EXACT sha256=${direct}`);return 'exact';}
  const withLf=Buffer.concat([b,Buffer.from('\n')]);
  must(hash(withLf)===expected,`${label} hash mismatch direct=${direct} +LF=${hash(withLf)} expected=${expected}`);
  console.log(`${label}=TEXT_EXACT_TERMINAL_LF_NORMALIZED repo_sha256=${direct} canonical_sha256=${expected}`);
  return 'terminal-lf-normalized';
};

must(meta.id==='LIT-000','wrong LIT id');
must(meta.language==='uk','LIT-000 must remain Ukrainian only');
must(meta.class==='Satirical Literary Criticism / Paratext','wrong publication class');
must(meta.book_edition_context==='UA v76','Skuf must target current Book I UA v76');
must(meta.modified_date==='2026-09-11','Skuf modified date must track v76 reread');
must(meta.boundaries.includes('SATIRE != DEMOGRAPHIC CLAIM'),'satire boundary missing');
must(meta.boundaries.includes('ADAPTED PARATEXT != SOURCE WITNESS'),'adaptation/source boundary missing');
must(meta.translation_policy.includes('Ukrainian publication only'),'translation boundary missing');

exactOrTerminalLf(meta.public_markdown.path,meta.public_markdown.sha256,'SKUF_PUBLIC_MD');
exactOrTerminalLf(`${root}/source/archive/SKUF_CRITIQUE_ORIGINAL_2026-04-27_RU.md`,meta.source_origin.skuf_original_sha256,'SKUF_ARCHIVE_WITNESS');
exactOrTerminalLf(`${root}/source/archive/ESTHETE_CRITIQUE_ORIGINAL_2026-04-27_UA.md`,meta.source_origin.esthete_original_sha256,'ESTHETE_ARCHIVE_WITNESS');

const addPath=meta.v76_canon_reread?.path;
must(addPath,'v76 reread path missing from registry');
exists(addPath);
const publicBase=text(meta.public_markdown.path);
const add=text(addPath);
for(const stale of ['Альона','Том Круз']){
  must(!publicBase.includes(stale),`public Skuf base leaked stale canon name: ${stale}`);
  must(!add.includes(stale),`Skuf v76 reread leaked stale canon name: ${stale}`);
}
for(const current of ['Алієна','Том Туз','Шийко','Cloud Imperror','Редактор','ДІМ / ДІМ','третій варіант','Третє тіло']){
  must(add.includes(current),`Skuf v76 reread missing current canon anchor: ${current}`);
}
for(const needle of ['СПОЙЛЕРНА ЗОНА','Скуф дочитав v76','PDF залиште. Для службового користування.']) must(add.includes(needle),`Skuf v76 reread missing ${needle}`);
must(meta.v76_canon_reread.source_master_sha256==='5331cc387ad6500f8a6491d0a9798d6ef6f091e41e825b5b64289afeaac1d4c9','wrong Book I v76 source master hash');

const page=`${root}/skuf-review/index.html`; exists(page); const h=text(page);
for(const needle of ['LIT-000','SATIRE != DEMOGRAPHIC CLAIM','FICTION != RESEARCH EVIDENCE','https://payhip.com/b/9GnpH','/support/','data-reader-document="LIT-000"','data-issue="71"','data-skuf-v76-addendum="true"','data-skuf-discovery="v76"','article:modified_time','citation_title','application/rss+xml','Cloud Imperror','Шийко']) must(h.includes(needle),`Skuf page missing ${needle}`);
must(h.includes('hreflang="uk"'),'Skuf page Ukrainian hreflang missing');
must(!h.includes('hreflang="en"'),'fabricated English Skuf sibling found');

const landing=text(`${root}/index.html`);
must(landing.includes('data-skuf-preface="LIT-000"'),'free-reading landing does not start with Skuf');
must(landing.includes('data-esthete-closing="LIT-007"'),'free-reading landing does not close with Esthete');
must(landing.includes('href="skuf-review/">Почати зі Скуфа'),'landing primary entry is not Skuf');
must(landing.includes('Скуф → шість художніх текстів → Естет'),'critical frame line missing');

const prologue=text(`${root}/prologue/index.html`);
must(prologue.includes('href="../skuf-review/">← Перед читанням: Скуф'),'Prologue does not link back to Skuf preface');

for(const slug of ['prologue','chapter-1','chapter-2','chapter-3','afterlude','interlude']){
  const p=`${root}/${slug}/index.html`; exists(p); const s=text(p);
  must(s.includes('data-esthete-outro="v2"'),`${slug}: Esthete v2 teaser missing`);
  must(s.includes('../esthete-review/'),`${slug}: full Esthete route missing`);
  must(s.includes(meta.full_book_url),`${slug}: full-book invitation missing`);
  must(s.includes('/metacademy-of-humanity/support/'),`${slug}: support route missing from Esthete/outro layer`);
}

const skufUrl='https://d4ttara.github.io/metacademy-of-humanity/uk/books/memories-of-humanity/book-1/free-reading/skuf-review/';
const estheteUrl='https://d4ttara.github.io/metacademy-of-humanity/uk/books/memories-of-humanity/book-1/free-reading/esthete-review/';
for(const path of ['sitemap.xml','llms.txt','feed.xml']){exists(path);const s=text(path);must(s.includes(skufUrl),`${path}: Skuf discovery route missing`);must(s.includes(estheteUrl),`${path}: Esthete discovery route missing`);}
const robots=text('robots.txt');
for(const agent of ['OAI-SearchBot','Googlebot','Bingbot','PerplexityBot','Claude-User','Claude-SearchBot']) must(robots.includes(`User-agent: ${agent}`),`robots.txt missing explicit search/retrieval agent ${agent}`);
const llms=text('llms.txt');
for(const needle of ['LIT-000 current-v76 reading','Шийко','Cloud Imperror','Редактор','ДІМ / ДІМ']) must(llms.includes(needle),`llms.txt missing ${needle}`);

console.log('MOH_LIT_000_VERIFY=PASS source=ARCHIVED adaptation=DECLARED v76_reread=PASS stale_names=ZERO current_canon=PASS discovery=PASS satire_boundary=PASS closing=LIT-007 issue=71 english=ZERO');
