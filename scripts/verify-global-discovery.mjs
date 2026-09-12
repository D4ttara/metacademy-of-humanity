import { existsSync, readFileSync } from 'node:fs';

const SITE='https://d4ttara.github.io/metacademy-of-humanity';
const must=(x,m)=>{ if(!x) throw new Error(m); };
const text=p=>readFileSync(p,'utf8');

for(const p of ['robots.txt','sitemap.xml','llms.txt','llms-full.txt','ai-index.json','feed.xml']) must(existsSync(p),`missing discovery surface: ${p}`);

const robots=text('robots.txt');
for(const bot of ['Googlebot','Bingbot','OAI-SearchBot','ChatGPT-User','GPTBot','PerplexityBot','Perplexity-User','Claude-SearchBot','Claude-User','ClaudeBot','Applebot','DuckDuckBot','Bravebot']){
  must(robots.includes(`User-agent: ${bot}`),`robots.txt missing explicit allow intent for ${bot}`);
}
must(robots.includes(`Sitemap: ${SITE}/sitemap.xml`),'robots.txt sitemap missing');

const index=JSON.parse(text('ai-index.json'));
must(index.schema==='metacademy-public-ai-index/v1','AI index schema mismatch');
must(index.site===SITE+'/','AI index canonical site mismatch');
must(Array.isArray(index.entries)&&index.entries.length>=40,`AI index unexpectedly small: ${index.entries?.length}`);
const urls=new Set(index.entries.map(x=>x.url));
for(const required of [SITE+'/',SITE+'/uk/',SITE+'/manifesto/',SITE+'/documents/',SITE+'/discover/',SITE+'/books/',SITE+'/uk/books/',SITE+'/uk/books/memories-of-humanity/book-1/free-reading/',SITE+'/uk/books/memories-of-humanity/book-1/free-reading/skuf-review/',SITE+'/uk/books/memories-of-humanity/book-1/free-reading/esthete-review/']) must(urls.has(required),`AI index missing ${required}`);

const sitemap=text('sitemap.xml');
for(const url of urls) must(sitemap.includes(`<loc>${url}</loc>`),`sitemap missing AI-index URL ${url}`);
const full=text('llms-full.txt');
for(const required of [SITE+'/manifesto/',SITE+'/documents/',SITE+'/uk/',SITE+'/discover/',SITE+'/books/',SITE+'/uk/books/']) must(full.includes(required),`llms-full missing ${required}`);

for(const e of index.entries){
  must(e.title&&e.description&&e.language&&e.type,`AI index incomplete entry: ${e.url}`);
  must(['en','uk'].includes(e.language),`unsupported public language label ${e.language}: ${e.url}`);
}

console.log(`GLOBAL_DISCOVERY_VERIFY=PASS pages=${index.entries.length} robots=SEARCH+AI sitemap=PASS llms_full=PASS ai_index=PASS`);
