import { readFileSync, writeFileSync } from 'node:fs';

const repo='https://github.com/D4ttara/metacademy-of-humanity/issues/58';
const slug='015-polytypic-thinking';

function insertAfterMainLead(html, block) {
  if (html.includes(`id="featured-015"`) || html.includes(`data-document-feature="015"`)) return html;
  const m=html.indexOf('<main');
  if (m<0) throw new Error('missing <main>');
  const openEnd=html.indexOf('>',m)+1;
  if (!openEnd) throw new Error('broken <main>');
  const nextHeader=html.indexOf('<header',openEnd);
  const nextSection=html.indexOf('<section',openEnd);
  if (nextHeader>=0 && (nextSection<0 || nextHeader<nextSection)) {
    const close=html.indexOf('</header>',nextHeader);
    if (close<0) throw new Error('broken main header');
    const at=close+'</header>'.length;
    return html.slice(0,at)+block+html.slice(at);
  }
  return html.slice(0,openEnd)+block+html.slice(openEnd);
}

const jobs=[
  {
    path:'index.html',
    block:`<section id="featured-015" data-document-feature="015"><div class="wrap grid"><div class="copy"><p class="eyebrow">NEW · DOCUMENT 015 · RESEARCH ESSAY · 25 AUGUST 2026</p><h2>What if AI recognizes your type correctly, but the type itself is part of the error?</h2><p><em>Polytypic Thinking</em> asks where classification stops explaining and starts closing the future. A type can be a useful projection without being an essence, and sometimes the typology itself must become the object of research.</p><div class="actions"><a class="button primary" href="documents/${slug}/en/">Read Document 015</a><a class="button" href="${repo}">Reader question →</a></div></div><aside class="aside"><strong>Main question</strong><br>If AI assigns a familiar type correctly, how do we tell whether it understood the phenomenon or merely returned a well-polished version of the past?</aside></div></section>`
  },
  {
    path:'uk/index.html',
    block:`<section id="featured-015" data-document-feature="015"><div class="wrap grid"><div class="copy"><p class="eyebrow">НОВЕ · DOCUMENT 015 · RESEARCH ESSAY · 25 СЕРПНЯ 2026</p><h2>Що, якщо AI правильно впізнав твій тип, але саме тип є частиною помилки?</h2><p>«Політипічне мислення» питає, де класифікація перестає пояснювати й починає закривати майбутнє. Тип може бути корисною проєкцією, не будучи сутністю, а іноді об’єктом дослідження має стати сама типологія.</p><div class="actions"><a class="button primary" href="../documents/${slug}/ua/">Читати Document 015</a><a class="button" href="${repo}">Питання до тексту →</a></div></div><aside class="aside"><strong>Головне питання</strong><br>Якщо AI правильно впізнав знайомий тип, як відрізнити момент, коли він справді побачив явище, від моменту, коли лише повернув нам добре відполіроване минуле?</aside></div></section>`
  },
  {
    path:'documents/index.html',
    block:`<section id="featured-015" data-document-feature="015"><div class="wrap"><p class="eyebrow">NEW · 25 AUGUST 2026 · v1.0</p><div class="cards essay-cards"><article class="card document-card"><div><p class="eyebrow">015 · Research Essay · v1.0</p><h3>Polytypic Thinking</h3><p>When one correct answer becomes a framing error: stereotypes, categorization, human–AI feedback loops, cultural diversity, novelty and the point at which the type system itself must become an object of research.</p></div><a href="${slug}/en/">Read English →</a><a href="${slug}/ua/">Українське видання →</a><a data-reader-discussion="015" href="${repo}">Reader question →</a></article></div></div></section>`
  },
  {
    path:'uk/documents/index.html',
    block:`<section id="featured-015" data-document-feature="015"><div class="wrap"><p class="eyebrow">НОВЕ · 25 СЕРПНЯ 2026 · v1.0</p><div class="cards essay-cards"><article class="card document-card"><div><p class="eyebrow">015 · Research Essay · v1.0</p><h3>Політипічне мислення</h3><p>Коли одна правильна відповідь стає помилкою рамки: стереотипи, категоризація, людсько-AI петлі, культурне різноманіття, новизна й момент, коли об’єктом дослідження має стати сама система типів.</p></div><a href="../../documents/${slug}/ua/">Читати українською →</a><a href="../../documents/${slug}/en/">English edition →</a><a data-reader-discussion="015" href="${repo}">Питання до тексту →</a></article></div></div></section>`
  },
  {
    path:'research/index.html',
    block:`<section id="featured-015" data-document-feature="015"><div class="wrap grid"><div class="copy"><p class="eyebrow">NEW RESEARCH ESSAY · DOCUMENT 015</p><h2>When does a type stop explaining?</h2><p><em>Polytypic Thinking</em> connects categorization research, stereotypes, human–AI feedback, cultural diversity and the problem of novelty. The proposal is not “many labels are better.” The stronger claim is that time, scale, observer and relation may change the lawful type, and sometimes the grammar of types itself has to be revised.</p><div class="actions"><a class="button primary" href="../documents/${slug}/en/">Read Document 015</a><a class="button" href="${repo}">Challenge the thesis</a></div></div><aside class="aside">TYPE IS A PROJECTION, NOT AN ESSENCE. Useful as a guard, dangerous as a slogan: the essay asks where this principle breaks.</aside></div></section>`
  },
  {
    path:'uk/research/index.html',
    block:`<section id="featured-015" data-document-feature="015"><div class="wrap grid"><div class="copy"><p class="eyebrow">НОВЕ RESEARCH ESSAY · DOCUMENT 015</p><h2>Коли тип перестає пояснювати?</h2><p>«Політипічне мислення» з’єднує дослідження категоризації, стереотипи, людсько-AI петлі, культурне різноманіття й проблему новизни. Теза не в тому, що «більше ярликів краще». Сильніша думка: час, масштаб, спостерігач і відношення можуть змінювати закономірний тип, а іноді перегляду потребує сама граматика типів.</p><div class="actions"><a class="button primary" href="../../documents/${slug}/ua/">Читати Document 015</a><a class="button" href="${repo}">Заперечити тезу</a></div></div><aside class="aside">ТИП Є ПРОЄКЦІЄЮ, А НЕ СУТНІСТЮ. Корисно як guard, небезпечно як новий лозунг: стаття прямо питає, де цей принцип ламається.</aside></div></section>`
  },
  {
    path:'updates/index.html',
    block:`<section id="featured-015" data-document-feature="015"><div class="wrap"><h2>2026-08-25 · Document 015</h2><p><em>Polytypic Thinking</em> is now public in English and Ukrainian. The essay starts with ordinary categorization, follows stereotypes through human–AI feedback loops and cultural homogenization, and ends at a research problem: when should a system stop forcing the world through its existing categories and investigate the category system itself?</p><div class="actions"><a class="button primary" href="../documents/${slug}/en/">Read Document 015</a><a class="button" href="${repo}">Reader question</a></div></div></section>`
  },
  {
    path:'uk/updates/index.html',
    block:`<section id="featured-015" data-document-feature="015"><div class="wrap"><h2>2026-08-25 · Document 015</h2><p>«Політипічне мислення» опубліковане українською й англійською. Есе починає зі звичайної категоризації, проходить через стереотипи, людсько-AI зворотні петлі й культурну уніфікацію та приходить до дослідницького питання: коли система повинна перестати насильно проводити світ через наявні категорії й дослідити саму систему категорій?</p><div class="actions"><a class="button primary" href="../../documents/${slug}/ua/">Читати Document 015</a><a class="button" href="${repo}">Питання до тексту</a></div></div></section>`
  }
];

let changed=0;
for (const job of jobs) {
  let html=readFileSync(job.path,'utf8');
  if (html.includes('data-document-feature="015"')) continue;
  html=insertAfterMainLead(html,job.block);
  writeFileSync(job.path,html,'utf8');
  changed++;
}
console.log(`DOCUMENT_015_DISCOVERY_INJECT=PASS changed=${changed} surfaces=${jobs.length}`);
