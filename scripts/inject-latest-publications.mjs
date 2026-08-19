import { readFileSync, writeFileSync } from 'node:fs';

const jobs = [
  {
    path: 'index.html',
    guard: 'documents/010-manifestation-time-genesis-time/en/',
    before: '<section><div class="wrap"><p class="eyebrow">New Research Essays · 17 August 2026 · v1.0RC</p>',
    block: '<section><div class="wrap"><p class="eyebrow">New · 19 August 2026 · v1.0</p><div class="cards essay-cards"><article class="card document-card"><div><h3>Manifestation Time ≠ Genesis Time</h3><p>Hidden causal history, state-dependent sensitivity, weak signals, and why an event may begin before it becomes visible.</p></div><a href="documents/010-manifestation-time-genesis-time/en/">Read Document 010 →</a></article><article class="card document-card"><div><h3>The Third Body</h3><p>What can emerge between people as shared memory, language, rhythm and possibility without erasing either person.</p></div><a href="documents/011-the-third-body/en/">Read Document 011 →</a></article><article class="card document-card"><div><h3>M{Y}OGA: What Happens If We Don’t Laugh at Astrology for the First Five Minutes</h3><p>A public route into M{Y}OGA JYOTISH across traditions, astronomy, mathematics, psychology and lived experience without evidence soup.</p></div><a href="documents/012-myoga-astrology-overview/en/">Read Document 012 →</a></article></div></div></section>'
  },
  {
    path: 'uk/index.html',
    guard: '../documents/010-manifestation-time-genesis-time/ua/',
    before: '<section><div class="wrap"><p class="eyebrow">Нові Research Essays · 17 серпня 2026 · v1.0RC</p>',
    block: '<section><div class="wrap"><p class="eyebrow">Нове · 19 серпня 2026 · v1.0</p><div class="cards essay-cards"><article class="card document-card"><div><h3>Час прояву ≠ час зародження</h3><p>Прихована причинна історія, стан-залежна чутливість, слабкі сигнали й питання про те, чому подія може початися раніше, ніж стане видимою.</p></div><a href="../documents/010-manifestation-time-genesis-time/ua/">Читати Document 010 →</a></article><article class="card document-card"><div><h3>Третє тіло</h3><p>Що може народжуватися між людьми як спільна пам’ять, мова, ритм і можливість, не стираючи жодну з них.</p></div><a href="../documents/011-the-third-body/ua/">Читати Document 011 →</a></article><article class="card document-card"><div><h3>M{Y}OGA: що буде, якщо перші п’ять хвилин не сміятися з астрології</h3><p>Публічний маршрут у M{Y}OGA JYOTISH через традиції, астрономію, математику, психологію та прожитий досвід без змішування evidence classes.</p></div><a href="../documents/012-myoga-astrology-overview/ua/">Читати Document 012 →</a></article></div></div></section>'
  },
  {
    path: 'updates/index.html',
    guard: '../documents/010-manifestation-time-genesis-time/en/',
    before: '<section><div class="wrap"><h2>2026-08-17 · Research Essays 007–008</h2>',
    block: '<section><div class="wrap"><h2>2026-08-19 · Documents 010–012</h2><p>Three new bilingual public bodies were added: Document 010 <em>Manifestation Time ≠ Genesis Time</em>, Document 011 <em>The Third Body</em>, and Document 012 <em>M{Y}OGA: What Happens If We Don’t Laugh at Astrology for the First Five Minutes</em>. Each has online HTML plus canonical Markdown and PDF editions, and their publication-registry provenance remains explicit.</p><div class="actions"><a class="button primary" href="../documents/010-manifestation-time-genesis-time/en/">Document 010</a><a class="button" href="../documents/011-the-third-body/en/">Document 011</a><a class="button" href="../documents/012-myoga-astrology-overview/en/">Document 012</a></div></div></section>'
  },
  {
    path: 'uk/updates/index.html',
    guard: '../../documents/010-manifestation-time-genesis-time/ua/',
    before: '<section><div class="wrap"><h2>2026-08-17 · Research Essays 007–008</h2>',
    block: '<section><div class="wrap"><h2>2026-08-19 · Documents 010–012</h2><p>Додано три нові двомовні публічні тіла: Document 010 «Час прояву ≠ час зародження», Document 011 «Третє тіло» та Document 012 «M{Y}OGA: що буде, якщо перші п’ять хвилин не сміятися з астрології». Кожне має HTML для онлайн-читання, canonical Markdown і PDF, а provenance у publication registry лишається явним.</p><div class="actions"><a class="button primary" href="../../documents/010-manifestation-time-genesis-time/ua/">Document 010</a><a class="button" href="../../documents/011-the-third-body/ua/">Document 011</a><a class="button" href="../../documents/012-myoga-astrology-overview/ua/">Document 012</a></div></div></section>'
  }
];

let changed = 0;
for (const job of jobs) {
  let html = readFileSync(job.path, 'utf8');
  if (html.includes(job.guard)) continue;
  if (!html.includes(job.before)) throw new Error(`Insertion anchor not found: ${job.path}`);
  html = html.replace(job.before, `${job.block}${job.before}`);
  writeFileSync(job.path, html, 'utf8');
  changed += 1;
}
console.log(`LATEST_PUBLICATIONS_INJECT=PASS changed=${changed} homes=EN_UKR updates=EN_UKR docs=010_011_012`);
