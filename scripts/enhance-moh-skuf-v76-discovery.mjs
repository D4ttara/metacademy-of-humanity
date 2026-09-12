import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root='uk/books/memories-of-humanity/book-1/free-reading';
const page=`${root}/skuf-review/index.html`;
const addendum='../source/MOH_LIT_000_SKUF_V76_ADDENDUM_UA.md';
const canonical='https://d4ttara.github.io/metacademy-of-humanity/uk/books/memories-of-humanity/book-1/free-reading/skuf-review/';
const modified='2026-09-11';
const keywords=['Згадки про Людство','Memories of Humanity','Скуф проти майбутнього','українська фантастика','сатирична критика','сатира про ШІ','штучний інтелект','цифрова влада','бюрократія','свобода','Алекс Штольман','Алієна','Том Туз','Шийко','Cloud Imperror','Редактор','ДІМ / ДІМ','Третє тіло','METACADEMY OF HUMANITY'];
const must=(x,m)=>{if(!x) throw new Error(m)};

must(existsSync(page),`missing ${page}`);
let h=readFileSync(page,'utf8');

if(!h.includes('data-skuf-discovery="v76"')){
  const headMeta=`<meta data-skuf-discovery="v76" name="keywords" content="${keywords.join(', ')}"><meta name="citation_title" content="Скуф проти майбутнього"><meta name="citation_author" content="Ievgen Karogod / Dattara"><meta name="citation_publication_date" content="2026-09-10"><meta name="citation_language" content="uk"><meta property="article:modified_time" content="${modified}"><meta property="article:tag" content="Memories of Humanity"><meta property="article:tag" content="Ukrainian science fiction"><meta property="article:tag" content="AI satire"><meta property="article:tag" content="digital power"><meta property="article:tag" content="bureaucracy"><meta property="article:tag" content="freedom"><link rel="alternate" type="application/rss+xml" title="MET[Ȧ]CADEMY OF HUMANITY RSS" href="/metacademy-of-humanity/feed.xml"><link rel="related" type="text/markdown" href="${addendum}" title="Skuf v76 canon reread addendum">`;
  must(h.includes('<meta name="author" content="Ievgen Karogod / Dattara">'),'Skuf author meta marker missing');
  h=h.replace('<meta name="author" content="Ievgen Karogod / Dattara">',`<meta name="author" content="Ievgen Karogod / Dattara">${headMeta}`);
}

const ldMatch=h.match(/<script type="application\/ld\+json">(\{.*?\})<\/script>/);
must(ldMatch,'Skuf JSON-LD missing');
const ld=JSON.parse(ldMatch[1]);
ld.dateModified=modified;
ld.mainEntityOfPage={'@type':'WebPage','@id':canonical};
ld.reviewBody='Сатирична інверсна критика Книги I «Згадки про Людство», доповнена після перечитування української редакції v76: Алекс Штольман, Алієна, Том Туз, Шийко, Cloud Imperror, Редактор, ДІМ / ДІМ, третій варіант і «Третє тіло».';
ld.keywords=keywords;
ld.about=[
  {'@type':'Thing','name':'Artificial intelligence in fiction'},
  {'@type':'Thing','name':'Bureaucracy and digital power'},
  {'@type':'Thing','name':'Freedom and responsibility'},
  {'@type':'Thing','name':'Ukrainian speculative fiction'}
];
if(ld.itemReviewed && typeof ld.itemReviewed==='object'){
  ld.itemReviewed.bookEdition='UA v76';
  ld.itemReviewed.author={'@type':'Person','name':'Ievgen Karogod / Dattara'};
}
h=h.replace(ldMatch[0],`<script type="application/ld+json">${JSON.stringify(ld)}</script>`);

if(!h.includes('data-skuf-v76-addendum="true"')){
  const marker='</article><section><div class="wrap literary-meta"><p class="meta">© 2026 Ievgen Karogod / Dattara.';
  must(h.includes(marker),'Skuf article/end marker missing');
  const block=`</article><article id="skuf-v76-reread" class="prose document-prose document-reading literary-reading literary-skuf-addendum" data-skuf-v76-addendum="true" data-markdown-source="${addendum}" data-markdown-render="true" aria-label="Скуф дочитав українську редакцію v76"><p>Завантаження v76-додатка Скуфа…</p></article><section><div class="wrap literary-meta literary-topics" data-literary-topics="LIT-000-v76"><p class="eyebrow">ТЕМИ · ДЛЯ ЛЮДЕЙ, ПОШУКУ Й МАШИННОГО ЧИТАННЯ</p><p><strong>Згадки про Людство · Memories of Humanity · українська фантастика · сатира про ШІ · цифрова влада · бюрократія · свобода · відповідальність · Алекс Штольман · Алієна · Том Туз · Шийко · Cloud Imperror · Редактор · ДІМ / ДІМ · Третє тіло.</strong></p><p class="meta">Це не набір SEO-заклинань. Це короткий семантичний паспорт того, про що реально йдеться на сторінці.</p><div class="edition-links"><a class="button primary" href="../prologue/">Почати книгу: Пролог →</a><a class="button" href="https://payhip.com/b/9GnpH" rel="external noopener noreferrer">Повна книга</a><a class="button" href="/metacademy-of-humanity/support/">Підтримати MoH</a><a class="button" href="https://github.com/D4ttara/metacademy-of-humanity/issues/71" rel="external noopener noreferrer">Обговорити LIT-000</a></div></div></section><section><div class="wrap literary-meta"><p class="meta">© 2026 Ievgen Karogod / Dattara.`;
  h=h.replace(marker,block);
}

writeFileSync(page,h,'utf8');

const robots='robots.txt';
if(existsSync(robots)){
  let r=readFileSync(robots,'utf8');
  if(!r.includes('User-agent: Claude-SearchBot')){
    const block=`\n# Claude user-directed retrieval. Separate from model-training ClaudeBot.\nUser-agent: Claude-User\nAllow: /\n\n# Claude search indexing / search quality. Separate from model-training ClaudeBot.\nUser-agent: Claude-SearchBot\nAllow: /\n`;
    const marker='\nSitemap: https://d4ttara.github.io/metacademy-of-humanity/sitemap.xml';
    must(r.includes(marker),'robots sitemap marker missing');
    r=r.replace(marker,`${block}${marker}`);
    writeFileSync(robots,r,'utf8');
  }
}

const sitemap='sitemap.xml';
if(existsSync(sitemap)){
  let s=readFileSync(sitemap,'utf8');
  const escaped=canonical.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const re=new RegExp(`(<url><loc>${escaped}<\\/loc><lastmod>)([^<]+)(<\\/lastmod><\\/url>)`);
  if(re.test(s)) s=s.replace(re,`$1${modified}$3`);
  else {
    const row=`  <url><loc>${canonical}</loc><lastmod>${modified}</lastmod></url>\n`;
    must(s.includes('</urlset>'),'sitemap closing marker missing');
    s=s.replace('</urlset>',row+'</urlset>');
  }
  writeFileSync(sitemap,s,'utf8');
}

const llms='llms.txt';
if(existsSync(llms)){
  let s=readFileSync(llms,'utf8');
  const marker='## MoH Book I · LIT-000 current-v76 reading';
  if(!s.includes(marker)){
    s+=`\n${marker}\n- Canonical page: ${canonical}\n- Public Markdown: ${canonical}../source/MOH_LIT_000_SKUF_REVIEW_UA.md\n- v76 canon reread addendum: ${canonical}../source/MOH_LIT_000_SKUF_V76_ADDENDUM_UA.md\n- Class: Satirical Literary Criticism / Paratext; language: Ukrainian; Book I context: UA v76.\n- Current-v76 anchors: Алекс Штольман; Алієна; Том Туз; Шийко; Cloud Imperror; Редактор; ДІМ / ДІМ; третій варіант; Третє тіло.\n- Boundaries: SATIRE != DEMOGRAPHIC CLAIM; ADAPTED PARATEXT != SOURCE WITNESS; FICTION != RESEARCH EVIDENCE.\n`;
    writeFileSync(llms,s,'utf8');
  }
}

console.log(`MOH_SKUF_V76_DISCOVERY=PASS page=LIT-000 addendum=VISIBLE modified=${modified} claude_search=ALLOW semantic_topics=${keywords.length}`);
