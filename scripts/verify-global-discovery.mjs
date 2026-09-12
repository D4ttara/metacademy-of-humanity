import { existsSync, readFileSync } from 'node:fs';

await import('./inject-static-shop-links.mjs');
await import('./inject-arena-discovery.mjs');

const SITE='https://d4ttara.github.io/metacademy-of-humanity';
const STORE='https://payhip.com/dattara';
const must=(x,m)=>{ if(!x) throw new Error(m); };
const text=p=>readFileSync(p,'utf8');

for(const p of ['robots.txt','sitemap.xml','llms.txt','llms-full.txt','ai-index.json','feed.xml','assets/css/experience.css','assets/js/experience.js','shop/index.html','uk/shop/index.html','arena/index.html','uk/arena/index.html','arena/AI_PEER_NOTES_PROTOCOL.md','arena/ai-peer-notes.schema.json']) must(existsSync(p),`missing discovery/experience surface: ${p}`);

const robots=text('robots.txt');
for(const bot of ['Googlebot','Bingbot','OAI-SearchBot','ChatGPT-User','GPTBot','PerplexityBot','Perplexity-User','Claude-SearchBot','Claude-User','ClaudeBot','Applebot','DuckDuckBot','Bravebot']){
  must(robots.includes(`User-agent: ${bot}`),`robots.txt missing explicit allow intent for ${bot}`);
}
must(robots.includes(`Sitemap: ${SITE}/sitemap.xml`),'robots.txt sitemap missing');

const index=JSON.parse(text('ai-index.json'));
must(index.schema==='metacademy-public-ai-index/v1','AI index schema mismatch');
must(index.site===SITE+'/','AI index canonical site mismatch');
must(index.discovery?.store===STORE,'AI index store identity missing');
must(Array.isArray(index.entries)&&index.entries.length>=40,`AI index unexpectedly small: ${index.entries?.length}`);
const urls=new Set(index.entries.map(x=>x.url));
for(const required of [SITE+'/',SITE+'/uk/',SITE+'/manifesto/',SITE+'/documents/',SITE+'/discover/',SITE+'/books/',SITE+'/uk/books/',SITE+'/shop/',SITE+'/uk/shop/',SITE+'/arena/',SITE+'/uk/arena/']) must(urls.has(required),`AI index missing ${required}`);

const sitemap=text('sitemap.xml');
for(const url of urls) must(sitemap.includes(`<loc>${url}</loc>`),`sitemap missing AI-index URL ${url}`);
const full=text('llms-full.txt');
for(const required of [SITE+'/manifesto/',SITE+'/documents/',SITE+'/uk/',SITE+'/discover/',SITE+'/books/',SITE+'/uk/books/',SITE+'/shop/',SITE+'/uk/shop/',SITE+'/arena/',SITE+'/uk/arena/',STORE]) must(full.includes(required),`llms-full missing ${required}`);

for(const e of index.entries){
  must(e.title&&e.description&&e.language&&e.type,`AI index incomplete entry: ${e.url}`);
  must(['en','uk'].includes(e.language),`unsupported public language label ${e.language}: ${e.url}`);
}

for(const path of ['index.html','uk/index.html','shop/index.html','uk/shop/index.html','arena/index.html','uk/arena/index.html']){
  const h=text(path);
  must(h.includes('assets/css/experience.css'),`${path} experience CSS missing`);
  must(h.includes('assets/js/experience.js'),`${path} experience JS missing`);
  must(h.includes(STORE),`${path} Payhip store route missing`);
  must(h.includes('nav-shop'),`${path} static shop navigation missing`);
}
const js=text('assets/js/experience.js');
for(const token of ['data-command-trigger','reader-toc','reading-progress','Challenge','data-util-share','data-util-arena','ARENA_CHAT','ARENA_IMAGE','ARENA_VIDEO','back-to-top','moh-theme']) must(js.includes(token),`experience JS missing ${token}`);
const css=text('assets/css/experience.css');
for(const token of ['.home-launchpad','.reader-utility','.command-dialog','.arena-dialog','.reader-toc','.back-to-top','data-theme="night"']) must(css.includes(token),`experience CSS missing ${token}`);
const protocol=text('arena/AI_PEER_NOTES_PROTOCOL.md');
for(const boundary of ['AI COMMENT != HUMAN REVIEW','MODEL OPINION != ACADEMY VERDICT','MULTIPLE MODELS != CONSENSUS']) must(protocol.includes(boundary),`AI peer notes protocol missing boundary: ${boundary}`);
const peerSchema=JSON.parse(text('arena/ai-peer-notes.schema.json'));
must(peerSchema.properties?.response_sha256&&peerSchema.properties?.prompt_sha256&&peerSchema.properties?.human_approved,'AI peer notes schema missing provenance fields');

console.log(`GLOBAL_DISCOVERY_VERIFY=PASS pages=${index.entries.length} robots=SEARCH+AI sitemap=PASS llms_full=PASS ai_index=PASS shop=PAYHIP arena=LMARENA_BRIDGE ai_peer_notes=PROVENANCE_READY share=NATIVE_WITH_COPY_FALLBACK experience=13+`);
