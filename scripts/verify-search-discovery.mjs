import { readFileSync, existsSync } from 'node:fs';

const topics = ['artificial-intelligence','human-ai','semantic-computing','epistemology','agency-and-behavior','complex-systems','myoga-jyotish','time-and-causality'];
const requiredDocs = ['003','004','006','007','008','009','010','011','012','013','014'];
const fail = message => { throw new Error(message); };

for (const slug of topics) {
  for (const path of [`topics/${slug}/index.html`,`uk/topics/${slug}/index.html`]) {
    if (!existsSync(path)) fail(`Missing topic page ${path}`);
    const html = readFileSync(path,'utf8');
    if (!html.includes('CollectionPage')) fail(`Missing CollectionPage JSON-LD ${path}`);
    if (!html.includes('rel="canonical"')) fail(`Missing canonical ${path}`);
    if (!html.includes('index,follow')) fail(`Missing index/follow ${path}`);
  }
}
for (const path of ['topics/index.html','uk/topics/index.html']) if (!existsSync(path)) fail(`Missing topic index ${path}`);

for (const path of ['index.html','uk/index.html']) {
  const html = readFileSync(path,'utf8');
  if (!html.includes('data-topic-desk="true"')) fail(`Missing topic desk ${path}`);
  for (const slug of topics) if (!html.includes(`topics/${slug}/`)) fail(`Missing topic link ${slug} in ${path}`);
}

const articleFiles = [
  'documents/003-life-as-organization/en/index.html','documents/003-life-as-organization/index.html',
  'documents/004-when-science-reaches-a-plateau/en/index.html','documents/004-when-science-reaches-a-plateau/ua/index.html',
  'documents/006-myoga-jyotish/index.html',
  'documents/007-after-vibe-coding/en/index.html','documents/007-after-vibe-coding/ua/index.html',
  'documents/008-the-interface-that-knows-you/en/index.html','documents/008-the-interface-that-knows-you/ua/index.html',
  'documents/009-elon-musk-mark-zuckerberg-ai-control/en/index.html','documents/009-elon-musk-mark-zuckerberg-ai-control/ua/index.html',
  'documents/010-manifestation-time-genesis-time/en/index.html','documents/010-manifestation-time-genesis-time/ua/index.html',
  'documents/011-the-third-body/en/index.html','documents/011-the-third-body/ua/index.html',
  'documents/012-myoga-astrology-overview/en/index.html','documents/012-myoga-astrology-overview/ua/index.html',
  'documents/013-room-that-answers/en/index.html','documents/013-room-that-answers/ua/index.html',
  'documents/014-right-to-see-the-consequence/en/index.html','documents/014-right-to-see-the-consequence/ua/index.html'
];
for (const path of articleFiles) {
  const html = readFileSync(path,'utf8');
  if (!html.includes('data-search-taxonomy="true"')) fail(`Missing article topic strip ${path}`);
  if (!html.includes('article:tag')) fail(`Missing article tags ${path}`);
}

const sitemap = readFileSync('sitemap.xml','utf8');
for (const slug of topics) {
  if (!sitemap.includes(`/topics/${slug}/`)) fail(`Sitemap missing EN ${slug}`);
  if (!sitemap.includes(`/uk/topics/${slug}/`)) fail(`Sitemap missing UA ${slug}`);
}
const llms = readFileSync('llms.txt','utf8');
if (!llms.includes('Topic hubs')) fail('llms.txt missing topic hubs');
if (!llms.includes('Document 014')) fail('llms.txt missing Document 014');
const robots = readFileSync('robots.txt','utf8');
if (!robots.includes('OAI-SearchBot')) fail('robots missing OAI-SearchBot');
if (!robots.includes('PerplexityBot')) fail('robots missing PerplexityBot');
const indexnow = readFileSync('scripts/notify-indexnow.sh','utf8');
if (!indexnow.includes('sitemap.xml')) fail('IndexNow is not sitemap-driven');

console.log(`SEARCH_DISCOVERY_VERIFY=PASS topics=${topics.length} topic_pages=${topics.length*2+2} tagged_article_editions=${articleFiles.length} docs=${requiredDocs.join(',')} google=CRAWLABLE bing_indexnow=WIRED chatgpt_search=OAI_SEARCHBOT perplexity=PERPLEXITYBOT`);
