import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root='uk/books/memories-of-humanity/book-1/free-reading';
const landingUrl='https://d4ttara.github.io/metacademy-of-humanity/uk/books/memories-of-humanity/book-1/free-reading/';
const fullBook='https://payhip.com/b/9GnpH';
const skufRoute='skuf-review/';
const skufUrl=`${landingUrl}${skufRoute}`;
const issue=71;

const estheteBlock=`<section class="literary-critic-outro" data-esthete-outro="v1"><div class="wrap literary-meta"><p class="eyebrow">КРИТИКА ЕСТЕТА · ДРУГА ОПТИКА</p><h2>Цинізм дешевший. Щирість завжди дорожча.</h2><p>Архівна позитивна критика Книги I бачить її не як загрозу порядку, а як зіткнення космічної опери, цифрової сатири, романтичної драми й розмови про ШІ в одному живому світі. Центральний нерв там не «перемогти систему», а вийти з формули: <strong>«я буду гідний любові, коли стану кимось»</strong>.</p><p>Так, текст навмисно щільний, інколи жарт забирає кадр у драми, а другорядний герой може за три сторінки заробити собі спін-оф. Але саме ця небезпечна щільність і є частиною голосу книги. <a href="../source/archive/ESTHETE_CRITIQUE_ORIGINAL_2026-04-27_UA.md">Архівний witness критики Естета →</a></p><div class="edition-links"><a class="button primary" href="${fullBook}" rel="external noopener noreferrer">Придбати повну книгу →</a><a class="button" href="/metacademy-of-humanity/support/">Підтримати MoH</a></div></div></section>`;

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
  if(injectBefore(path,'<section class="literary-support">',estheteBlock,'data-esthete-outro="v1"')) changed++;
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
    writeFileSync(landing,s,'utf8'); changed++;
  }
}

const prologue=`${root}/prologue/index.html`;
if(replaceOnce(prologue,'<a class="button" href="../">← Усі безкоштовні тексти</a>','<a class="button" href="../skuf-review/">← Перед читанням: Скуф</a>')) changed++;

const skufPage=`${root}/skuf-review/index.html`;
if(existsSync(skufPage)){
  let s=readFileSync(skufPage,'utf8');
  if(!s.includes('data-reader-document="LIT-000"')){
    const reader=`<section class="reader-response" data-reader-document="LIT-000" aria-labelledby="reader-response-LIT-000"><div class="wrap reader-response-inner"><p class="eyebrow">Твоя черга</p><h2 id="reader-response-LIT-000">Яку установу всередині голови впізнав Скуф?</h2><p class="response-question">Яка фраза Скуфа найточніше впізнає старий бюрократичний або пропагандистський рефлекс? І де сатира вже перебільшує настільки, що перестає бути дзеркалом?</p><p class="response-note">Читати можна без акаунта. Для публічної відповіді в GitHub-гілці потрібен GitHub-акаунт.</p><div class="edition-links"><a class="button primary" data-discuss-link="true" href="https://github.com/D4ttara/metacademy-of-humanity/issues/${issue}#issuecomment-new" rel="external noopener noreferrer">Написати відповідь</a><a class="button" href="https://github.com/D4ttara/metacademy-of-humanity/issues/${issue}" rel="external noopener noreferrer">Читати гілку</a></div><div class="reader-comments" data-github-issue-comments data-repo="D4ttara/metacademy-of-humanity" data-issue="${issue}"><p class="reader-comments-status" data-comment-status>Завантажуємо публічні відповіді…</p><div data-comment-stream></div></div></div></section>`;
    if(!s.includes('</main>')) throw new Error('Skuf page main closing tag missing');
    s=s.replace('</main>',`${reader}</main>`);
    writeFileSync(skufPage,s,'utf8'); changed++;
  }
}

{
  const path='sitemap.xml';
  if(existsSync(path)){let s=readFileSync(path,'utf8');if(!s.includes(skufUrl)){const row=`  <url><loc>${skufUrl}</loc><lastmod>2026-09-10</lastmod></url>\n`;s=s.replace('</urlset>',row+'</urlset>');writeFileSync(path,s,'utf8');changed++;}}
}
{
  const path='llms.txt';
  if(existsSync(path)){let s=readFileSync(path,'utf8');if(!s.includes(skufUrl)){s+=`\n- LIT-000 · Скуф проти майбутнього · Satirical Literary Criticism / Paratext: ${skufUrl}\n- Boundary: SATIRE != DEMOGRAPHIC CLAIM; ADAPTED PARATEXT != SOURCE WITNESS.\n`;writeFileSync(path,s,'utf8');changed++;}}
}
{
  const path='feed.xml';
  if(existsSync(path)){let s=readFileSync(path,'utf8');if(!s.includes(skufUrl)){const item=`    <item>\n      <title>Скуф проти майбутнього</title>\n      <link>${skufUrl}</link>\n      <guid isPermaLink="true">${skufUrl}</guid>\n      <pubDate>Thu, 10 Sep 2026 21:29:00 GMT</pubDate>\n      <description>Сатирична інверсна критика Книги I «Згадки про Людство» перед читанням.</description>\n    </item>\n`;const marker='    <item>';if(!s.includes(marker))throw new Error('RSS item marker missing');s=s.replace(marker,item+marker);writeFileSync(path,s,'utf8');changed++;}}
}

console.log(`MOH_PARATEXT_ENHANCE=PASS changed=${changed} skuf=LIT-000 esthete_outro=6 issue=${issue}`);
