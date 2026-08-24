import { readFileSync, writeFileSync } from 'node:fs';

const repo = 'D4ttara/metacademy-of-humanity';
const docs = [
  {
    number: '007', slug: '007-after-vibe-coding', issue: 45,
    en: { title: 'What must survive the translation?', question: 'AI can turn an intention into a working system astonishingly fast. What must remain invariant while intention becomes interpretation, architecture, code and behaviour? If the essay’s idea of a semantic passport is wrong, point to the exact place where meaning can be checked more reliably.' },
    ua: { title: 'Що має пережити переклад?', question: 'AI може перетворити задум на робочу систему майже миттєво. Що саме має лишитися незмінним, поки задум стає інтерпретацією, архітектурою, кодом і поведінкою? Якщо ідея семантичного паспорта хибна, покажи конкретне місце, де сенс можна перевіряти надійніше.' }
  },
  {
    number: '008', slug: '008-the-interface-that-knows-you', issue: 46,
    en: { title: 'When does personalization become steering?', question: 'If a system knows your preferences, vulnerabilities and habits, what should it never optimize without explicit permission? Where does personalization stop serving the person and start serving someone else through the person?' },
    ua: { title: 'Коли персоналізація стає керуванням?', question: 'Якщо система знає твої вподобання, слабкі місця й звички, що саме вона не повинна оптимізувати без прямої згоди? Де персоналізація перестає служити людині й починає служити комусь іншому через людину?' }
  },
  {
    number: '009', slug: '009-elon-musk-mark-zuckerberg-ai-control', issue: 47,
    en: { title: 'Are we arguing with old verbs?', question: 'If control, access and ownership are already downstream questions, which concept should be rebuilt first: tool, user, owner, subject or responsibility? And where does the essay become too abstract to govern real AI systems?' },
    ua: { title: 'Ми вже сперечаємося старими дієсловами?', question: 'Якщо контроль, доступ і власність уже є питаннями другого порядку, яке поняття треба перебудувати першим: інструмент, користувач, власник, суб’єкт чи відповідальність? І де ця рамка стає надто абстрактною для реальних AI-систем?' }
  },
  {
    number: '010', slug: '010-manifestation-time-genesis-time', issue: 48,
    en: { title: 'How do we stop hidden history becoming hindsight?', question: 'What observation would make you reject the claim that a system entered a temporary window of increased sensitivity before a visible event? Where does manifestation time ≠ genesis time become useful science, and where does it become an unfalsifiable story told after the fact?' },
    ua: { title: 'Як не перетворити приховану історію на hindsight?', question: 'Яке спостереження змусило б тебе відкинути гіпотезу, що система увійшла в тимчасове вікно підвищеної чутливості ще до видимої події? Де «час прояву ≠ час зародження» стає корисною наукою, а де вже неперевірною історією заднім числом?' }
  },
  {
    number: '011', slug: '011-the-third-body', issue: 49,
    en: { title: 'When is friction growth, and when is it damage?', question: 'What distinguishes the difficult friction from which a shared “third body” can grow from a relationship that is simply damaging? If the essay romanticizes endurance, point to the boundary it misses; if exit culture sometimes destroys something too early, describe how.' },
    ua: { title: 'Коли тертя вирощує, а коли руйнує?', question: 'Як відрізнити складне тертя, з якого може вирости спільне «третє тіло», від стосунку, який просто руйнує людей? Якщо есе романтизує терпіння, покажи пропущену межу; якщо культура швидкого виходу іноді вбиває щось зарано, опиши механізм.' }
  },
  {
    number: '012', slug: '012-myoga-astrology-overview', issue: 50,
    en: { title: 'What would a fair test of astrology look like?', question: 'What would count as a fair test of an astrological claim that neither assumes astrology is true nor dismisses it before the test starts? Which layer should be tested first, and what result would genuinely make you revise your position?' },
    ua: { title: 'Як виглядав би чесний тест астрології?', question: 'Що було б чесним тестом астрологічного твердження, який не припускає наперед, що астрологія істинна, але й не закриває питання до початку перевірки? Який шар треба тестувати першим і який результат справді змусив би тебе змінити позицію?' }
  },
  {
    number: '013', slug: '013-room-that-answers', issue: 51,
    en: { title: 'Can AI adapt to you without adapting reality?', question: 'What must remain visible in an AI answer so that adaptation of tone, examples and route does not become adaptation of evidence, uncertainty or alternatives? If USER MODEL != USER is right, when should a system stop trusting its own model of you?' },
    ua: { title: 'Чи може AI адаптуватися до тебе, не адаптуючи реальність?', question: 'Що має залишатися видимим у відповіді AI, щоб адаптація тону, прикладів і маршруту не стала адаптацією доказів, невизначеності чи альтернатив? Якщо USER MODEL != USER, коли система повинна перестати довіряти власній моделі тебе?' }
  },
  {
    number: '014', slug: '014-right-to-see-the-consequence', issue: 39,
    en: { title: 'Where does care become control?', question: 'If fear-based warnings are justified because they reduce harm, where should the ethical limit on deliberate psychological discomfort sit? If the essay draws the boundary badly, point to the paragraph where it fails.' },
    ua: { title: 'Де турбота стає контролем?', question: 'Якщо попередження через страх виправдані тим, що зменшують шкоду, де має проходити етична межа навмисного психологічного дискомфорту? Якщо есе проводить межу невдало, покажи місце, де вона ламається.' }
  }
];

const htmlEscape = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const issueUrl = issue => `https://github.com/${repo}/issues/${issue}`;

let changed = 0;
for (const doc of docs) {
  for (const lang of ['en', 'ua']) {
    const path = `documents/${doc.slug}/${lang}/index.html`;
    let html = readFileSync(path, 'utf8');
    const copy = doc[lang];
    const replyLabel = lang === 'ua' ? 'Відповісти' : 'Reply';
    const writeLabel = lang === 'ua' ? 'Написати відповідь' : 'Write a reply';
    const threadLabel = lang === 'ua' ? 'Читати гілку' : 'Read the thread';
    const eyebrow = lang === 'ua' ? 'Твоя черга' : 'Your turn';
    const note = lang === 'ua'
      ? 'Читати можна без акаунта. Для публічної відповіді в GitHub-гілці зараз потрібен GitHub-акаунт. Одного сильного абзацу достатньо; українська й англійська однаково доречні.'
      : 'Reading needs no account. Posting a public reply in the GitHub thread currently requires a GitHub account. One sharp paragraph is enough; English and Ukrainian are equally welcome.';

    const edition = /(<div class="edition-links">)([\s\S]*?)(<\/div>)/;
    html = html.replace(edition, (whole, open, body, close) => {
      if (body.includes(`issues/${doc.issue}`) || body.includes('data-discuss-link="true"')) return whole;
      return `${open}${body}<a class="button" data-discuss-link="true" href="${issueUrl(doc.issue)}#issuecomment-new" rel="external noopener noreferrer">${replyLabel}</a>${close}`;
    });

    if (!html.includes(`data-reader-document="${doc.number}"`)) {
      const response = `\n<section class="reader-response" data-reader-document="${doc.number}" aria-labelledby="reader-response-title-${doc.number}"><div class="wrap reader-response-inner"><p class="eyebrow">${eyebrow}</p><h2 id="reader-response-title-${doc.number}">${htmlEscape(copy.title)}</h2><p class="response-question">${htmlEscape(copy.question)}</p><p class="response-note">${htmlEscape(note)}</p><div class="edition-links"><a class="button primary" data-discuss-link="true" href="${issueUrl(doc.issue)}#issuecomment-new" rel="external noopener noreferrer">${writeLabel}</a><a class="button" href="${issueUrl(doc.issue)}" rel="external noopener noreferrer">${threadLabel}</a></div><div class="reader-comments" data-github-issue-comments data-repo="${repo}" data-issue="${doc.issue}"><p class="reader-comments-status" data-comment-status>${lang === 'ua' ? 'Завантажуємо публічні відповіді…' : 'Loading public replies…'}</p><div data-comment-stream></div></div></div></section>`;
      if (!html.includes('</main>')) throw new Error(`Missing </main>: ${path}`);
      html = html.replace('</main>', `${response}\n</main>`);
    }

    writeFileSync(path, html, 'utf8');
    changed += 1;
  }
}

for (const [path, lang] of [['index.html', 'en'], ['uk/index.html', 'ua'], ['documents/index.html', 'en'], ['uk/documents/index.html', 'ua']]) {
  let html = readFileSync(path, 'utf8');
  for (const doc of docs) {
    if (!html.includes(doc.slug) || html.includes(`data-reader-discussion="${doc.number}"`)) continue;
    const cardPattern = new RegExp(`(<article class="card document-card">[\\s\\S]*?${doc.slug}[\\s\\S]*?)(</article>)`);
    if (!cardPattern.test(html)) continue;
    const label = lang === 'ua' ? 'Питання до тексту →' : 'Reader question →';
    html = html.replace(cardPattern, `$1<a data-reader-discussion="${doc.number}" href="${issueUrl(doc.issue)}">${label}</a>$2`);
  }
  writeFileSync(path, html, 'utf8');
}

console.log(`READER_RESPONSE_INJECT=PASS changed=${changed} documents=007-014 editions=EN_UA issues=39,45-51`);
