import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const meta=JSON.parse(readFileSync('publications/MOH_LIT_007_ESTHETE_REVIEW_UA.json','utf8'));
const root='uk/books/memories-of-humanity/book-1/free-reading';
const must=(x,m)=>{if(!x) throw new Error(m)};
const bytes=p=>readFileSync(p);
const text=p=>readFileSync(p,'utf8');
const hash=b=>createHash('sha256').update(b).digest('hex');
const exists=p=>must(existsSync(p),`missing ${p}`);
const exactOrTerminalLf=(path,expected,label)=>{
  exists(path);const b=bytes(path),direct=hash(b);
  if(direct===expected){console.log(`${label}=EXACT sha256=${direct}`);return;}
  const withLf=Buffer.concat([b,Buffer.from('\n')]);
  must(hash(withLf)===expected,`${label} hash mismatch direct=${direct} +LF=${hash(withLf)} expected=${expected}`);
  console.log(`${label}=TEXT_EXACT_TERMINAL_LF_NORMALIZED repo_sha256=${direct} canonical_sha256=${expected}`);
};

must(meta.id==='LIT-007','wrong LIT id');
must(meta.language==='uk','LIT-007 must remain Ukrainian only');
must(meta.class==='Literary Criticism / Closing Paratext','wrong publication class');
must(meta.preceding_publication_count===7,'LIT-007 must close the seven preceding LIT publications');
must(meta.sequence==='LIT-000 opening + LIT-001..006 book units + LIT-007 closing','literary sequence changed');
for(const b of ['CRITIQUE != VERDICT','DIALOGUE PARATEXT != INDEPENDENT EXTERNAL REVIEW','ADAPTED PARATEXT != SOURCE WITNESS','FICTION != RESEARCH EVIDENCE']) must(meta.boundaries.includes(b),`missing boundary ${b}`);
must(meta.discussion_issue===72,'reader issue must be 72');
must(meta.book_source.sha256==='5331cc387ad6500f8a6491d0a9798d6ef6f091e41e825b5b64289afeaac1d4c9','wrong Book I v76 master receipt');

exactOrTerminalLf(meta.public_markdown.path,meta.public_markdown.sha256,'ESTHETE_PUBLIC_MD');
exactOrTerminalLf(`${root}/source/archive/ESTHETE_CRITIQUE_ORIGINAL_2026-04-27_UA.md`,meta.source_origin.esthete_original_sha256,'ESTHETE_ARCHIVE_WITNESS');

const md=text(meta.public_markdown.path);
for(const needle of ['Алієна','Том Туз','Шийко','Cloud Imperror','Редактор','ДІМ / ДІМ','Третє тіло','Печиво','Марс','щільність','афористичність','Продовжимо.']) must(md.includes(needle),`current-v76 critical reading missing ${needle}`);
must(md.includes('не незалежну газетну рецензію'),'independent-review disclosure missing');

const page=`${root}/esthete-review/index.html`;exists(page);const h=text(page);
for(const needle of ['LIT-007','CRITIQUE != VERDICT','DIALOGUE PARATEXT != INDEPENDENT EXTERNAL REVIEW','MOH_LIT_007_ESTHETE_REVIEW_UA.pdf','MOH_LIT_007_ESTHETE_REVIEW_UA.epub','data-reader-document="LIT-007"','data-issue="72"',meta.full_book_url]) must(h.includes(needle),`Esthete page missing ${needle}`);
must(h.includes('hreflang="uk"'),'Esthete Ukrainian hreflang missing');
must(!h.includes('hreflang="en"'),'fabricated English Esthete sibling found');

const landing=text(`${root}/index.html`);
must(landing.includes('data-esthete-closing="LIT-007"'),'landing closing Esthete card missing');
must(landing.includes('Скуф → шість художніх текстів → Естет'),'landing frame order missing');

const interlude=text(`${root}/interlude/index.html`);
must(interlude.includes('../esthete-review/'),'Interlude does not point to Esthete');
must(interlude.includes('Далі: Естет'),'Interlude next label is not Esthete');

for(const slug of ['prologue','chapter-1','chapter-2','chapter-3','afterlude','interlude']){
  const s=text(`${root}/${slug}/index.html`);
  must(s.includes('data-esthete-outro="v2"'),`${slug}: Esthete v2 teaser missing`);
  must(s.includes('../esthete-review/'),`${slug}: Esthete link missing`);
}

const url='https://d4ttara.github.io/metacademy-of-humanity/uk/books/memories-of-humanity/book-1/free-reading/esthete-review/';
for(const p of ['sitemap.xml','llms.txt','feed.xml']){exists(p);must(text(p).includes(url),`${p}: Esthete discovery route missing`);}

console.log('MOH_LIT_007_VERIFY=PASS master=v76 archive=EXPLICIT expanded=YES countercritique=YES preceding=7 issue=72 frame=LIT-000..007 english=ZERO');
