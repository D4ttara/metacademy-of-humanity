import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root='uk/books/memories-of-humanity/book-1/free-reading';
const landingUrl='https://d4ttara.github.io/metacademy-of-humanity/uk/books/memories-of-humanity/book-1/free-reading/';
const fullBook='https://payhip.com/b/9GnpH';
const skufRoute='skuf-review/';
const estheteRoute='esthete-review/';
const skufUrl=`${landingUrl}${skufRoute}`;
const estheteUrl=`${landingUrl}${estheteRoute}`;
const skufIssue=71;
const estheteIssue=72;

const estheteBlock=`<section class="literary-critic-outro" data-esthete-outro="v2"><div class="wrap literary-meta"><p class="eyebrow">КРИТИКА ЕСТЕТА · ДРУГА ОПТИКА</p><h2>Цинізм дешевший. Щирість завжди дорожча.</h2><p>Після актуальної редакції v76 ця оптика вже не зводиться до «книга дивна, але класна». Вона читає Алекса, Алієну, Тома Туза, Шийка, Cloud Imperror, Редактора, Поріг і те, чому живе постійно чинить опір красивій оптимізації.</p><p>У фіналі free-reading на тебе чекає повна розширена критика з окремим розділом про сильні місця, перенасиченість, гумор, політичну температуру, «Третє тіло» й навіть печиво, яке вже має вагоміші causal credentials за половину людських інституцій. <a href="../${estheteRoute}">Читати LIT-007 «Естет після фіналу» →</a></p><p class="meta"><code>CRITIQUE != VERDICT</code> · <code>DIALOGUE PARATEXT != INDEPENDENT EXTERNAL REVIEW</code></p><div class="edition-links"><a class="button" href="../${estheteRoute}">Повна критика Естета →</a><a class="button primary" href="${fullBook}" rel="external noopener noreferrer">Придбати повну книгу →</a><a class="button" href="/metacademy-of-humanity/support/">Підтримати MoH</a></div></div></section>`;

function replaceOnce(path,needle,replacement){
  if(!existsSync(path)) return false;
  let s=readFileSync(path,'utf8');
  if(!s.includes(needle)) return false;
  s=s.replace(needle,replacement);
  writeFileSync(path,s,'utf8');
  return true;
}

function injectBefore(path,marker,block,guard){
  if(!existsSync(path)) return false;
  let s=readFileSync(path,'utf8');
  if(s.includes(guard)) return false;
  if(!s.includes(marker)) throw new Error(`${path}: marker not found`);
  s=s.replace(marker,`${block}${marker}`);
  writeFileSync(path,s,'utf8');
  return true;
}

let changed=0;
const slugs=['prologue','chapter-1','chapter-2','chapter-3','afterlude','interlude'];
for(const slug of slugs){
  const path=`${root}/${slug}/index.html`;
  if(injectBefore(path,'<section class="literary-support">',estheteBlock,'data-esthete-outro="v2"')) changed++;
}

const landing=`${root}/index.html`;
if(existsSync(landing)){
  let s=readFileSync(landing,'utf8');
  if(!s.includes('data-skuf-preface="LIT-000"')){
    const card=`<article class="free-reading-card" data-skuf-preface="LIT-000"><div><p class="eyebrow">LIT-000 · ПЕРЕД ЧИТАННЯМ · САТИРИЧНА КРИТИКА</p><h2>Скуф проти майбутнього</h2><p>Інверсна рецензія як криве дзеркало закостенілої свідомості, бюрократичного рефлексу й страху перед свободою. <code>SATIRE != DEMOGRAPHIC CLAIM</code>.</p></div><p class="meta"><a class="button primary" href="${skufRoute}">Почати звідси →</a> <a class="button" href="source/MOH_LIT_000_SKUF_REVIEW_UA.md">Publication MD</a></p></article>`;
    const marker='<div class="free-reading-grid">';
    if(!s.includes(marker)) throw new Error('free-reading landing grid marker missing');
    s=s.replace(marker,`${marker}${card}`);
    s=s.replace('href="prologue/">Почати з Прологу →','href="skuf-review/">Почати зі Скуфа →');
    changed++;
  }
  if(!s.includes('data-esthete-closing="LIT-007"')){
    const card=`<article class="free-reading-card" data-esthete-closing="LIT-007"><div><p class="eyebrow">LIT-007 · ПІСЛЯ ЧИТАННЯ · КРИТИЧНИЙ ПАРАТЕКСТ</p><h2>Естет після фіналу</h2><p>Розширена критика після повного перечитування Book I UA v76: персонажі, ШІ, любов, політика, гумор, слабкі місця й право живого не бути функцією. <code>CRITIQUE != VERDICT</code>.</p></div><p class="meta"><a class="button" href="${estheteRoute}">Завершити Естетом →</a> <a class="button" href="source/MOH_LIT_007_ESTHETE_REVIEW_UA.md">Publication MD</a></p></article>`;
    const gridStart=s.indexOf('<div class="free-reading-grid">');
    if(gridStart<0) throw new Error('free-reading landing grid start missing');
    const gridEnd=s.indexOf('</div><p class="meta">',gridStart);
    if(gridEnd<0) throw new Error('free-reading landing grid end missing');
    s=s.slice(0,gridEnd)+card+s.slice(gridEnd);
    changed++;
  }
  if(!s.includes('Скуф → шість художніх текстів → Естет')){
    s=s.replace('<p><code>FICTION != RESEARCH EVIDENCE</code> · <code>FREE ACCESS != COPYRIGHT WAIVER</code></p>','<p><code>FICTION != RESEARCH EVIDENCE</code> · <code>FREE ACCESS != COPYRIGHT WAIVER</code></p><p class="meta">Критична рамка: <strong>Скуф → шість художніх текстів → Естет</strong>. Дві протилежні оптики не замінюють читача, а залишають йому місце між ними.</p>');
  }
  writeFileSync(landing,s,'utf8');
}

const prologue=`${root}/prologue/index.html`;
if(replaceOnce(prologue,'<a class="button" href="../">← Усі безкоштовні тексти</a>','<a class="button" href="../skuf-review/">← Перед читанням: Скуф</a>')) changed++;

const interlude=`${root}/interlude/index.html`;
if(existsSync(interlude)){
  let s=readFileSync(interlude,'utf8');
  const old=`<a class="button primary" href="${fullBook}" rel="external noopener noreferrer">Далі у повній книзі →</a>`;
  const next=`<a class="button primary" href="../${estheteRoute}">Далі: Естет →</a>`;
  if(s.includes(old)){s=s.replaceAll(old,next);writeFileSync(interlude,s,'utf8');changed++;}
}

const skufPage=`${root}/skuf-review/index.html`;
if(existsSync(skufPage)){
  let s=readFileSync(skufPage,'utf8');
  if(!s.includes('data-reader-document="LIT-000"')){
    const reader=`<section class="reader-response" data-reader-document="LIT-000" aria-labelledby="reader-response-LIT-000"><div class="wrap reader-response-inner"><p class="eyebrow">Твоя черга</p><h2 id="reader-response-LIT-000">Яку установу всередині голови впізнав Скуф?</h2><p class="response-question">Яка фраза Скуфа найточніше впізнає старий бюрократичний або пропагандистський рефлекс? І де сатира вже перебільшує настільки, що перестає бути дзеркалом?</p><p class="response-note">Читати можна без акаунта. Для публічної відповіді в GitHub-гілці потрібен GitHub-акаунт.</p><div class="edition-links"><a class="button primary" data-discuss-link="true" href="https://github.com/D4ttara/metacademy-of-humanity/issues/${skufIssue}#issuecomment-new" rel="external noopener noreferrer">Написати відповідь</a><a class="button" href="https://github.com/D4ttara/metacademy-of-humanity/issues/${skufIssue}" rel="external noopener noreferrer">Читати гілку</a></div><div class="reader-comments" data-github-issue-comments data-repo="D4ttara/metacademy-of-humanity" data-issue="${skufIssue}"><p class="reader-comments-status" data-comment-status>Завантажуємо публічні відповіді…</p><div data-comment-stream></div></div></div></section>`;
    if(!s.includes('</main>')) throw new Error('Skuf page main closing tag missing');
    s=s.replace('</main>',`${reader}</main>`);
    writeFileSync(skufPage,s,'utf8'); changed++;
  }
}

const esthetePage=`${root}/esthete-review/index.html`;
if(existsSync(esthetePage)){
  let s=readFileSync(esthetePage,'utf8');
  if(!s.includes('data-reader-document="LIT-007"')){
    const reader=`<section class="reader-response" data-reader-document="LIT-007" aria-labelledby="reader-response-LIT-007"><div class="wrap reader-response-inner"><p class="eyebrow">Твоя черга</p><h2 id="reader-response-LIT-007">Що лишилося після фіналу?</h2><p class="response-question">Що для тебе виявилося справжнім центром v76: любов, свобода, пам’ять, ШІ, право живого не бути функцією чи щось інше? І де книга вже перевантажує власний двигун?</p><p class="response-note">Естет не є фінальним суддею. Третя оптика після Скуфа й Естета — твоя.</p><div class="edition-links"><a class="button primary" data-discuss-link="true" href="https://github.com/D4ttara/metacademy-of-humanity/issues/${estheteIssue}#issuecomment-new" rel="external noopener noreferrer">Написати відповідь</a><a class="button" href="https://github.com/D4ttara/metacademy-of-humanity/issues/${estheteIssue}" rel="external noopener noreferrer">Читати гілку</a></div><div class="reader-comments" data-github-issue-comments data-repo="D4ttara/metacademy-of-humanity" data-issue="${estheteIssue}"><p class="reader-comments-status" data-comment-status>Завантажуємо публічні відповіді…</p><div data-comment-stream></div></div></div></section>`;
    if(!s.includes('</main>')) throw new Error('Esthete page main closing tag missing');
    s=s.replace('</main>',`${reader}</main>`);
    writeFileSync(esthetePage,s,'utf8'); changed++;
  }
}

for(const [url,lastmod] of [[skufUrl,'2026-09-10'],[estheteUrl,'2026-09-10']]){
  const path='sitemap.xml';
  if(existsSync(path)){let s=readFileSync(path,'utf8');if(!s.includes(url)){const row=`  <url><loc>${url}</loc><lastmod>${lastmod}</lastmod></url>\n`;s=s.replace('</urlset>',row+'</urlset>');writeFileSync(path,s,'utf8');changed++;}}
}
{
  const path='llms.txt';
  if(existsSync(path)){let s=readFileSync(path,'utf8');
    if(!s.includes(skufUrl)){s+=`\n- LIT-000 · Скуф проти майбутнього · Satirical Literary Criticism / Opening Paratext: ${skufUrl}\n- Boundary: SATIRE != DEMOGRAPHIC CLAIM; ADAPTED PARATEXT != SOURCE WITNESS.\n`;changed++;}
    if(!s.includes(estheteUrl)){s+=`- LIT-007 · Естет після фіналу · Literary Criticism / Closing Paratext: ${estheteUrl}\n- Boundary: CRITIQUE != VERDICT; DIALOGUE PARATEXT != INDEPENDENT EXTERNAL REVIEW.\n`;changed++;}
    writeFileSync(path,s,'utf8');
  }
}
{
  const path='feed.xml';
  if(existsSync(path)){let s=readFileSync(path,'utf8');const marker='    <item>';if(!s.includes(marker))throw new Error('RSS item marker missing');
    if(!s.includes(skufUrl)){const item=`    <item>\n      <title>Скуф проти майбутнього</title>\n      <link>${skufUrl}</link>\n      <guid isPermaLink="true">${skufUrl}</guid>\n      <pubDate>Thu, 10 Sep 2026 21:29:00 GMT</pubDate>\n      <description>Сатирична інверсна критика Книги I «Згадки про Людство» перед читанням.</description>\n    </item>\n`;s=s.replace(marker,item+marker);changed++;}
    if(!s.includes(estheteUrl)){const item=`    <item>\n      <title>Естет після фіналу</title>\n      <link>${estheteUrl}</link>\n      <guid isPermaLink="true">${estheteUrl}</guid>\n      <pubDate>Thu, 10 Sep 2026 22:02:00 GMT</pubDate>\n      <description>Розширена критична оптика після повного перечитування Book I UA v76.</description>\n    </item>\n`;s=s.replace(marker,item+marker);changed++;}
    writeFileSync(path,s,'utf8');
  }
}

for(const path of ['uk/books/index.html','uk/updates/index.html','uk/index.html']){
  if(!existsSync(path)) continue;
  let s=readFileSync(path,'utf8');
  if(s.includes('data-moh-free-reading="v76"') && !s.includes('data-moh-paratext-frame="000-007"')){
    s=s.replace('Пролог, Глави I–III, Афтерлюдія та Інтерлюдія перед Главою IV. Шість окремих художніх публікацій','Критична рамка Скуф → шість художніх текстів → Естет: Пролог, Глави I–III, Афтерлюдія та Інтерлюдія перед Главою IV. Шість художніх публікацій');
    s=s.replace('data-moh-free-reading="v76"','data-moh-free-reading="v76" data-moh-paratext-frame="000-007"');
    writeFileSync(path,s,'utf8'); changed++;
  }
}

console.log(`MOH_PARATEXT_ENHANCE=PASS changed=${changed} opening=LIT-000 closing=LIT-007 esthete_teasers=6 issues=${skufIssue},${estheteIssue}`);
