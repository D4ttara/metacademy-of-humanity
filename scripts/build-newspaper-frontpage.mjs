import { readFileSync, writeFileSync } from 'node:fs';

const issue = n => `https://github.com/D4ttara/metacademy-of-humanity/issues/${n}`;

const editions = {
  en: {
    path: 'index.html', css: 'assets/css/frontpage-news.css', why: 'Why MET[Ȧ]CADEMY?',
    masthead: 'THE MET[Ȧ]CADEMY REVIEW', date: 'Research edition · 24 August 2026',
    deck: 'A front page for the Academy’s public writing: one lead story, a few strong secondary pieces, and the full research archive below. Each text gets a short editorial standfirst, not a chopped opening paragraph, so a reader can understand why it matters before choosing a door.',
    read: 'Read', discuss: 'Reader question', archive: 'All documents', archiveHref: 'documents/',
    docs: [
      {n:'014',slug:'014-right-to-see-the-consequence',href:'documents/014-right-to-see-the-consequence/en/',issue:39,title:'The Right to See the Consequence',kind:'LEAD · Research Essay · 24 Aug',summary:'A cigarette pack becomes a doorway into a larger political and psychological question: when does care stop informing and start hurting people for their own good? The essay follows fear, stigma, self-models, alternatives and the uncomfortable possibility that a humane goal can still use an inhumane interface.'},
      {n:'013',slug:'013-room-that-answers',href:'documents/013-room-that-answers/en/',issue:51,title:'The Human in a Room That Answers',kind:'AI & reality · 20 Aug',summary:'Old filter bubbles chose what you saw. Generative AI can now shape how the world itself is explained to you. This essay asks whether personalization can help without quietly building a private reality around the user.'},
      {n:'011',slug:'011-the-third-body',href:'documents/011-the-third-body/en/',issue:49,title:'The Third Body',kind:'Relations · 19 Aug',summary:'Two people can create something neither possessed alone: shared memory, language, rhythm and possibility. The difficult question is where healthy friction grows a relation and where endurance merely teaches people to stay inside damage.'},
      {n:'010',slug:'010-manifestation-time-genesis-time',href:'documents/010-manifestation-time-genesis-time/en/',issue:48,title:'Manifestation Time ≠ Genesis Time',kind:'Time & causality · 19 Aug',summary:'The moment an event becomes visible may be much later than the moment its causal history began. Volcanoes, astronomy, psychology and relational sensitivity meet in a testable question about hidden preparation and dangerous hindsight.'},
      {n:'012',slug:'012-myoga-astrology-overview',href:'documents/012-myoga-astrology-overview/en/',issue:50,title:'M{Y}OGA: What Happens If We Don’t Laugh at Astrology for the First Five Minutes',kind:'Field overview · 19 Aug',summary:'Neither belief nor dismissal gets the first move. The piece opens astrology as a layered historical object made of astronomy, mathematics, tradition, symbolism, psychology and empirical claims that must not be blended into one evidence soup.'},
      {n:'009',slug:'009-elon-musk-mark-zuckerberg-ai-control',href:'documents/009-elon-musk-mark-zuckerberg-ai-control/en/',issue:47,title:'Metanauts on AI Control',kind:'AI governance · 17 Aug',summary:'Musk asks whether superintelligence can be controlled; Zuckerberg argues about access and distribution. The essay asks an earlier question: what if AI is already changing the meanings of tool, owner, user, subject and responsibility while we debate who gets the keys?'},
      {n:'008',slug:'008-the-interface-that-knows-you',href:'documents/008-the-interface-that-knows-you/en/',issue:46,title:'The Interface That Knows You',kind:'Personalization · 17 Aug',summary:'A system can know you intimately and still optimize for somebody else. This essay separates personalization from care and asks what an interface must preserve when it can predict your habits, weaknesses, attention and next click.'},
      {n:'007',slug:'007-after-vibe-coding',href:'documents/007-after-vibe-coding/en/',issue:45,title:'After Vibe Coding',kind:'AI engineering · 17 Aug',summary:'AI can make software astonishingly fast, which means meaning can now be lost astonishingly fast too. The essay asks what must survive while an intention becomes interpretation, architecture, code, behaviour and perhaps an entirely different computational body.'},
      {n:'006',slug:'006-myoga-jyotish',href:'documents/006-myoga-jyotish/',issue:55,title:'M{Y}OGA JYOTISH · Field Manifesto',kind:'Field manifesto · 14 Aug',summary:'A working constitution for joining traditions without erasing their origin. Classical sources, experimental extensions, mathematics, interpretation, lived experience and negative results are allowed to meet only if their evidence passports remain visible.'},
      {n:'004',slug:'004-when-science-reaches-a-plateau',href:'documents/004-when-science-reaches-a-plateau/en/',issue:54,title:'When Science Reaches a Plateau',kind:'Research Brief · 12 Aug',summary:'What happens when data keeps growing but explanation stops getting better? The brief treats a scientific plateau not as a declaration that physics is finished, but as a diagnostic moment when old questions, tools or categories may no longer be enough.'},
      {n:'003',slug:'003-life-as-organization',href:'documents/003-life-as-organization/en/',issue:53,title:'Life as Organization',kind:'Research Brief · 12 Aug',summary:'Synthetic life raises a deceptively simple question: when do nonliving parts become a new organized whole? Boundaries, degrees of autonomy, environment and communication are used to examine life as architecture rather than a magical ingredient.'}
    ]
  },
  ua: {
    path: 'uk/index.html', css: '../assets/css/frontpage-news.css', why: 'Навіщо MET[Ȧ]CADEMY?',
    masthead: 'THE MET[Ȧ]CADEMY REVIEW', date: 'Дослідницький випуск · 24 серпня 2026',
    deck: 'Головна як газета, а не як склад посилань: одна центральна історія, кілька сильних матеріалів поруч і весь публічний корпус нижче. Замість уривка з першого абзацу кожна стаття отримує короткий редакційний standfirst, який інтригує й одразу пояснює, навіщо туди заходити.',
    read: 'Читати', discuss: 'Питання до тексту', archive: 'Усі документи', archiveHref: 'documents/',
    docs: [
      {n:'014',slug:'014-right-to-see-the-consequence',href:'../documents/014-right-to-see-the-consequence/ua/',issue:39,title:'Право бачити наслідок',kind:'ГОЛОВНА · Research Essay · 24 серп',summary:'Сигаретна пачка стає входом у значно ширше питання: де турбота перестає інформувати й починає робити людині боляче заради її ж добра? Стаття проходить через страх, стигму, самоустановки, альтернативи й неприємну можливість, що гуманна мета все одно може користуватися негуманним інтерфейсом.'},
      {n:'013',slug:'013-room-that-answers',href:'../documents/013-room-that-answers/ua/',issue:51,title:'Людина в кімнаті, яка відповідає',kind:'AI і реальність · 20 серп',summary:'Стара інформаційна бульбашка вирішувала, що ти побачиш. Generative AI уже може вирішувати, як саме світ буде тобі пояснений. Есе питає, чи здатна персоналізація допомагати, не будуючи навколо користувача дедалі комфортнішу приватну реальність.'},
      {n:'011',slug:'011-the-third-body',href:'../documents/011-the-third-body/ua/',issue:49,title:'Третє тіло',kind:'Відношення · 19 серп',summary:'Між двома людьми може народитися те, чого не було в жодного окремо: спільна пам’ять, мова, ритм і нові можливості. Найважче питання тут не романтичне: де тертя ще вирощує відношення, а де терпіння вже просто вчить залишатися всередині шкоди.'},
      {n:'010',slug:'010-manifestation-time-genesis-time',href:'../documents/010-manifestation-time-genesis-time/ua/',issue:48,title:'Час прояву ≠ час зародження',kind:'Час і причинність · 19 серп',summary:'Момент, коли подія стала видимою, може бути значно пізнішим за початок її причинної історії. Вулкани, астрономія, психологія й реляційна чутливість сходяться в одному небезпечному питанні: як відрізнити приховану підготовку від красивої історії, придуманої заднім числом?'},
      {n:'012',slug:'012-myoga-astrology-overview',href:'../documents/012-myoga-astrology-overview/ua/',issue:50,title:'M{Y}OGA: що буде, якщо не сміятися з астрології перші п’ять хвилин',kind:'Огляд поля · 19 серп',summary:'Тут ні віра, ні скепсис не отримують право закрити питання до перевірки. Астрологія відкривається як багатошаровий історичний об’єкт, де астрономія, математика, традиція, символізм, психологія й empirical claims повинні зустрічатися без перетворення на evidence soup.'},
      {n:'009',slug:'009-elon-musk-mark-zuckerberg-ai-control',href:'../documents/009-elon-musk-mark-zuckerberg-ai-control/ua/',issue:47,title:'Метанавти про контроль AI',kind:'AI governance · 17 серп',summary:'Маск питає, чи можна контролювати суперінтелект, Цукерберг сперечається про доступ і розподіл сили. Есе заходить раніше: а що, коли AI уже змінює значення слів «інструмент», «власник», «користувач», «суб’єкт» і «відповідальність», поки ми ділимо ключі?'},
      {n:'008',slug:'008-the-interface-that-knows-you',href:'../documents/008-the-interface-that-knows-you/ua/',issue:46,title:'Інтерфейс, який знає тебе',kind:'Персоналізація · 17 серп',summary:'Система може знати тебе майже інтимно й усе одно оптимізувати не для тебе. Есе відділяє персоналізацію від турботи й питає, що повинен зберігати інтерфейс, коли вже вміє передбачати звички, слабкі місця, увагу й наступний клік.'},
      {n:'007',slug:'007-after-vibe-coding',href:'../documents/007-after-vibe-coding/ua/',issue:45,title:'Після Vibe Coding',kind:'AI engineering · 17 серп',summary:'AI тепер може робити software шалено швидко, а отже сенс теж можна втрачати шалено швидко. Стаття питає, що саме має пережити шлях, коли задум стає інтерпретацією, архітектурою, кодом, поведінкою, а іноді й зовсім іншим обчислювальним тілом.'},
      {n:'006',slug:'006-myoga-jyotish',href:'../documents/006-myoga-jyotish/',issue:55,title:'M{Y}OGA JYOTISH · Маніфест дисципліни',kind:'Маніфест поля · 14 серп',summary:'Робоча конституція для зустрічі традицій без стирання їхнього походження. Класичні джерела, експериментальні розширення, математика, інтерпретація, прожитий досвід і негативні результати можуть бути поруч лише тоді, коли їхні паспорти доказів не зникають.'},
      {n:'004',slug:'004-when-science-reaches-a-plateau',href:'../documents/004-when-science-reaches-a-plateau/ua/',issue:54,title:'Коли наука виходить на плато',kind:'Research Brief · 12 серп',summary:'Що відбувається, коли даних стає дедалі більше, а пояснення майже не покращується? Brief розглядає наукове плато не як заяву «фізика закінчилась», а як діагностичний момент, коли старих питань, інструментів або категорій може вже не вистачати.'},
      {n:'003',slug:'003-life-as-organization',href:'../documents/003-life-as-organization/',issue:53,title:'Життя як організація',kind:'Research Brief · 12 серп',summary:'Synthetic life повертає підозріло просте питання: коли неживі компоненти стають новим організованим цілим? Межі, ступені автономності, середовище й комунікація дозволяють дивитися на життя як на архітектуру процесів, а не на магічний інгредієнт.'}
    ]
  }
};

const escapeHtml = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

const story = (doc, cfg, cls='newspaper-story') => `<article class="${cls}" data-frontpage-document="${doc.n}"><p class="newspaper-label">${escapeHtml(doc.kind)}</p><h3>${escapeHtml(doc.title)}</h3><p class="newspaper-summary">${escapeHtml(doc.summary)}</p><div class="newspaper-actions"><a href="${doc.href}">${cfg.read} ${doc.n} →</a><a data-reader-discussion="${doc.n}" href="${issue(doc.issue)}">${cfg.discuss} →</a></div></article>`;

const makeFrontpage = cfg => {
  const lead = cfg.docs[0], secondary = cfg.docs.slice(1,3), rest = cfg.docs.slice(3);
  return `<section class="research-frontpage" data-newspaper-frontpage="true"><div class="wrap"><header class="newspaper-masthead"><h2>${escapeHtml(cfg.masthead)}</h2><p>${escapeHtml(cfg.date)}</p></header><p class="newspaper-deck">${escapeHtml(cfg.deck)}</p><div class="newspaper-top">${story(lead,cfg,'newspaper-lead')}<div>${secondary.map(d=>story(d,cfg,'newspaper-secondary')).join('')}</div></div><div class="newspaper-grid">${rest.map(d=>story(d,cfg)).join('')}</div><p class="newspaper-footer-note"><a href="${cfg.archiveHref}">${escapeHtml(cfg.archive)} →</a></p></div></section>`;
};

for (const cfg of Object.values(editions)) {
  let html = readFileSync(cfg.path, 'utf8');
  if (!html.includes('frontpage-news.css')) html = html.replace('</head>', `<link rel="stylesheet" href="${cfg.css}">\n</head>`);
  const marker = `<p class="eyebrow">${cfg.why}</p>`;
  const whyAt = html.indexOf(marker);
  if (whyAt < 0) throw new Error(`Why section not found in ${cfg.path}`);
  const whyStart = html.lastIndexOf('<section>', whyAt);
  const heroStart = html.indexOf('<section class="hero">');
  const heroEnd = html.indexOf('</section>', heroStart) + '</section>'.length;
  if (heroStart < 0 || heroEnd < 0 || whyStart < 0) throw new Error(`Front page anchors missing in ${cfg.path}`);
  html = html.slice(0, heroEnd) + makeFrontpage(cfg) + html.slice(whyStart);

  html = html.replace(/<section><div class="wrap grid"><div class="copy"><p class="eyebrow">New field · Document 006<\/p>[\s\S]*?<\/section>/g, '');
  html = html.replace(/<section><div class="wrap grid"><div class="copy"><p class="eyebrow">Document 004<\/p>[\s\S]*?<\/section>/g, '');
  writeFileSync(cfg.path, html, 'utf8');
}

console.log('NEWSPAPER_FRONTPAGE_BUILD=PASS editions=EN_UA documents=003,004,006-014 lead=014 summaries=editorial');
