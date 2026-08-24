import { readFileSync } from 'node:fs';

const docs = [
  ['003','003-life-as-organization',53],['004','004-when-science-reaches-a-plateau',54],['006','006-myoga-jyotish',55],['007','007-after-vibe-coding',45],['008','008-the-interface-that-knows-you',46],['009','009-elon-musk-mark-zuckerberg-ai-control',47],['010','010-manifestation-time-genesis-time',48],['011','011-the-third-body',49],['012','012-myoga-astrology-overview',50],['013','013-room-that-answers',51],['014','014-right-to-see-the-consequence',39]
];

const assert = (ok,msg) => { if(!ok) throw new Error(msg); };
for (const path of ['index.html','uk/index.html']) {
  const html = readFileSync(path,'utf8');
  assert(html.includes('data-newspaper-frontpage="true"'), `${path}: newspaper front page missing`);
  assert(html.includes('frontpage-news.css'), `${path}: newspaper stylesheet missing`);
  assert(html.includes('newspaper-lead') && html.includes('data-frontpage-document="014"'), `${path}: Document 014 is not lead story`);
  for (const [n,slug,issue] of docs) {
    assert(html.includes(`data-frontpage-document="${n}"`), `${path}: Document ${n} missing`);
    assert(html.includes(slug), `${path}: Document ${n} route missing`);
    assert(html.includes(`data-reader-discussion="${n}"`), `${path}: Document ${n} discussion link missing`);
    assert(html.includes(`issues/${issue}`), `${path}: Document ${n} issue ${issue} missing`);
    const re = new RegExp(`data-frontpage-document="${n}"[\\s\\S]*?<p class="newspaper-summary">([\\s\\S]*?)<\\/p>`);
    const m = html.match(re);
    assert(m && m[1].replace(/<[^>]+>/g,'').trim().length >= 110, `${path}: Document ${n} summary too short`);
  }
}

const legacy = [
  ['documents/003-life-as-organization/en/index.html','003',53],
  ['documents/003-life-as-organization/index.html','003',53],
  ['documents/004-when-science-reaches-a-plateau/en/index.html','004',54],
  ['documents/004-when-science-reaches-a-plateau/ua/index.html','004',54],
  ['documents/006-myoga-jyotish/index.html','006',55]
];
for (const [path,n,issue] of legacy) {
  const html = readFileSync(path,'utf8');
  assert(html.includes(`data-reader-document="${n}"`), `${path}: reader response missing`);
  assert(html.includes(`issues/${issue}`), `${path}: issue link missing`);
  assert(html.includes('data-github-issue-comments'), `${path}: inline comment hydration missing`);
}
console.log('NEWSPAPER_FRONTPAGE_VERIFY=PASS home=EN_UA documents=003,004,006-014 summaries=PASS discussions=PASS legacy_questions=PASS');
