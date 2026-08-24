import { existsSync, readFileSync } from 'node:fs';
const req=p=>{if(!existsSync(p)) throw new Error(`missing ${p}`); return readFileSync(p,'utf8');};
const base='documents/015-polytypic-thinking';
for(const [lang,upper,core] of [['en','EN','type is a projection, not an essence'],['ua','UA','тип є проєкцією, а не сутністю']]){
  const md=req(`${base}/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_${upper}_v1.0.md`);
  if(!md.toLowerCase().includes(core)) throw new Error(`core thesis missing ${lang}`);
  if(!md.includes('Needham') || !md.includes('Kleineberg') || !md.includes('Rosch')) throw new Error(`classification lineage missing ${lang}`);
  if(/(^|\n)\s*(?:[-*+]\s|\d+[.)]\s)/m.test(md.replace(/^---[\s\S]*?---/m,''))) throw new Error(`list marker found ${lang}`);
  const html=req(`${base}/${lang}/index.html`);
  if(html.includes('Loading canonical Markdown') || html.includes('Завантаження canonical Markdown')) throw new Error(`static render placeholder ${lang}`);
  if(!html.includes('issues/58') || !html.includes('data-reader-document="015"')) throw new Error(`reader response missing ${lang}`);
  const article=(html.match(/<article id="read-online"[\s\S]*?<\/article>/)||[])[0]||'';
  if(!article || /<(ul|ol)(\s|>)/.test(article)) throw new Error(`article lists/render missing ${lang}`);
  if(!existsSync(`${base}/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_${upper}_v1.0.pdf`)) throw new Error(`pdf missing ${lang}`);
}
const registry=req('publications/PUBLICATION_REGISTRY.yml');
if(!registry.includes('number: "015"') || !registry.includes('canonical_slug: polytypic-thinking')) throw new Error('registry 015 missing');
for(const path of ['index.html','uk/index.html','documents/index.html','uk/documents/index.html','research/index.html','uk/research/index.html','updates/index.html','uk/updates/index.html']){
  if(!req(path).includes('data-document-feature="015"')) throw new Error(`discovery surface missing 015: ${path}`);
}
for(const [path,needle] of [['sitemap.xml','015-polytypic-thinking/en/'],['llms.txt','Document 015 · Polytypic Thinking'],['feed.xml','015-polytypic-thinking/en/']]) if(!req(path).includes(needle)) throw new Error(`machine discovery missing ${path}`);
console.log('VERIFY_DOCUMENT_015=PASS editions=EN_UA article_lists=ZERO lineage=PASS reader_response=58 discovery=8 machine=PASS');
