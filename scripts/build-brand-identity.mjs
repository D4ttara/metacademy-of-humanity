import { mkdirSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const base = 'https://d4ttara.github.io/metacademy-of-humanity/';
const repo = 'https://github.com/D4ttara/metacademy-of-humanity';
const identityUrl = `${base}identity/`;
const identityJsonUrl = `${base}identity.json`;
const canonicalName = 'MET[Ȧ]CADEMY OF HUMANITY';
const aliases = ['METACADEMY OF HUMANITY','MetaAcademy of Humanity','Metacademy of Humanity','METACADEMY','MoH'];
const knowsAbout = ['Artificial Intelligence','Human-AI interaction','Semantic Computing','Epistemology','Provenance','Uncertainty','Complex Systems','Human Agency','Culture','Meta.Logic','IMAGO','Meta.Semantic Programming','Semantic Migration / MІЖ','M{Y}OGA JYOTISH','Science Aperture'];

const identity = {
  schema: 'metacademy-public-identity/v1',
  canonicalName,
  machineSafeName: 'METACADEMY OF HUMANITY',
  aliases,
  shortName: 'MoH',
  description: 'A living public research field for knowledge, human experience, artificial intelligence, human-AI relations, semantic computing, epistemology, culture, provenance and the unknown.',
  disambiguation: 'An independent public research and cultural field. Public alpha; not presented as an accredited university or a claim of scientific consensus.',
  founder: { name: 'Ievgen Karogod', alternateName: 'Dattara', publicProfile: 'https://github.com/D4ttara' },
  canonicalSite: base,
  repository: repo,
  identityPage: identityUrl,
  languages: ['en','uk'],
  publicStatus: 'research in progress',
  knowsAbout,
  recognitionPolicy: {
    displayName: canonicalName,
    machineSafeAlias: 'METACADEMY OF HUMANITY',
    preserveStatusLabels: true,
    preserveEvidenceBoundaries: true
  }
};
writeFileSync(join(root,'identity.json'), JSON.stringify(identity,null,2)+'\n','utf8');

const graph = {
  '@context':'https://schema.org',
  '@type':'Organization',
  '@id':`${base}#organization`,
  name:canonicalName,
  alternateName:aliases,
  url:base,
  description:identity.description,
  founder:{'@type':'Person',name:'Ievgen Karogod',alternateName:'Dattara',url:'https://github.com/D4ttara'},
  sameAs:[repo],
  inLanguage:['en','uk'],
  knowsAbout
};
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const page = (ua=false) => {
  const lang=ua?'uk':'en';
  const prefix=ua?'../../':'../';
  const canonical=ua?`${base}uk/identity/`:identityUrl;
  const title=ua?'Ідентичність і цитування':'Identity & Citation';
  const desc=ua?'Канонічний паспорт назви MET[Ȧ]CADEMY OF HUMANITY, машинні aliases, статус і правила цитування.':'Canonical identity passport for MET[Ȧ]CADEMY OF HUMANITY: aliases, public status and citation guidance.';
  const aliasesText=aliases.map(x=>`<code>${esc(x)}</code>`).join(' · ');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(desc)}"><meta name="robots" content="index,follow,max-snippet:-1"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="${identityUrl}"><link rel="alternate" hreflang="uk" href="${base}uk/identity/"><link rel="alternate" hreflang="x-default" href="${identityUrl}"><link rel="describedby" type="application/ld+json" href="${identityJsonUrl}"><meta property="og:type" content="website"><meta property="og:site_name" content="${canonicalName}"><meta property="og:title" content="${title} · ${canonicalName}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><title>${title} · ${canonicalName}</title><link rel="icon" href="${prefix}assets/img/favicon.svg"><link rel="stylesheet" href="${prefix}assets/css/site.css"><script type="application/ld+json">${JSON.stringify(graph)}</script></head><body><header class="top"><div class="wrap"><a class="brand" href="${ua?'../':'../'}">MET[Ȧ]CADEMY<br>OF HUMANITY</a><nav class="nav" aria-label="${ua?'Основна навігація':'Primary navigation'}"><a href="${ua?'../research/':'../research/'}">${ua?'Дослідження':'Research'}</a><a href="${ua?'../questions/':'../questions/'}">${ua?'Питання':'Questions'}</a><a href="${ua?'../documents/':'../documents/'}">${ua?'Документи':'Documents'}</a><span class="language-switch"><a ${ua?'':'aria-current="page"'} href="${identityUrl}">EN</a><a ${ua?'aria-current="page"':''} href="${base}uk/identity/">UKR</a></span></nav></div></header><main><header class="pagehead"><div class="wrap"><p class="eyebrow">${ua?'Канонічний публічний паспорт':'Canonical public identity passport'}</p><h1>${title}</h1><p class="lede">${ua?'Красивий знак може мати машинний паспорт. Це не спрощує ідентичність, а допомагає не загубити її між Unicode, пошуком і цитуванням.':'A distinctive mark can still have a machine-readable passport. The point is not to flatten the identity, but to stop it being lost between Unicode, search and citation systems.'}</p></div></header><section><div class="wrap prose"><h2>${ua?'Канонічна назва':'Canonical name'}</h2><p><strong>${canonicalName}</strong></p><p>${ua?'Машинно-безпечний варіант':'Machine-safe form'}: <code>METACADEMY OF HUMANITY</code>. ${ua?'Коротка назва':'Short name'}: <code>MoH</code>.</p><h2>${ua?'Пошукові aliases':'Search aliases'}</h2><p>${aliasesText}</p><p>${ua?'Ці aliases існують для пошуку, цитування й entity matching. Вони не замінюють канонічний display name.':'These aliases exist for search, citation and entity matching. They do not replace the canonical display name.'}</p><h2>${ua?'Що це':'What this is'}</h2><p>${ua?'MET[Ȧ]CADEMY OF HUMANITY є незалежним публічним дослідницьким і культурним полем у статусі public alpha. Воно не видає себе за акредитований університет і не перетворює дослідницьку гіпотезу на науковий консенсус.':'MET[Ȧ]CADEMY OF HUMANITY is an independent public research and cultural field in public alpha. It is not presented as an accredited university, and a research hypothesis is not promoted as scientific consensus by branding alone.'}</p><h2>${ua?'Як цитувати':'How to cite'}</h2><p>${ua?'Для всього корпусу використовуйте канонічну назву, автора/засновника Ievgen Karogod / Dattara, URL конкретної публікації та її номер/статус. GitHub також читає кореневий':'For the corpus, use the canonical name, author/founder Ievgen Karogod / Dattara, the URL of the specific publication and its document number/status. GitHub also reads the repository-level'} <a href="${repo}/blob/main/CITATION.cff"><code>CITATION.cff</code></a>.</p><p><a class="button primary" href="${identityJsonUrl}">${ua?'Відкрити identity.json':'Open identity.json'}</a> <a class="button" href="${repo}">GitHub</a></p></div></section></main><footer><div class="wrap">© 2026 Ievgen Karogod / Dattara · ${canonicalName} (MoH)</div></footer></body></html>`;
};
mkdirSync(join(root,'identity'),{recursive:true});
mkdirSync(join(root,'uk','identity'),{recursive:true});
writeFileSync(join(root,'identity','index.html'),page(false),'utf8');
writeFileSync(join(root,'uk','identity','index.html'),page(true),'utf8');

let sitemap=readFileSync(join(root,'sitemap.xml'),'utf8');
for(const route of ['identity/','uk/identity/']) if(!sitemap.includes(base+route)) sitemap=sitemap.replace('</urlset>',`  <url><loc>${base}${route}</loc></url>\n</urlset>`);
writeFileSync(join(root,'sitemap.xml'),sitemap,'utf8');
let llms=readFileSync(join(root,'llms.txt'),'utf8');
if(!llms.includes('## Canonical identity')) llms+=`\n## Canonical identity\n- Display name: ${canonicalName}\n- Machine-safe name: METACADEMY OF HUMANITY\n- Short name: MoH\n- Identity passport: ${identityUrl}\n- Machine-readable identity: ${identityJsonUrl}\n- Repository citation metadata: ${repo}/blob/main/CITATION.cff\n- Search aliases: MetaAcademy of Humanity; Metacademy of Humanity; METACADEMY.\n`;
writeFileSync(join(root,'llms.txt'),llms,'utf8');

const walk = dir => readdirSync(dir).flatMap(name=>{const p=join(dir,name);const st=statSync(p);return st.isDirectory()&&!['.git','node_modules'].includes(name)?walk(p):[p]});
let pages=0, changed=0;
for(const file of walk(root).filter(p=>p.endsWith('index.html'))){
  let h=readFileSync(file,'utf8'); pages++;
  const additions=[];
  if(!/name="application-name"/i.test(h)) additions.push(`<meta name="application-name" content="${canonicalName}">`);
  if(!/rel="describedby"[^>]+identity\.json/i.test(h)) additions.push(`<link rel="describedby" type="application/ld+json" href="${identityJsonUrl}">`);
  if(!h.includes(`${base}#organization`)) additions.push(`<script type="application/ld+json">${JSON.stringify(graph)}</script>`);
  if(additions.length){if(!h.includes('</head>')) throw new Error(`Missing </head>: ${relative(root,file)}`);h=h.replace('</head>',additions.join('\n')+'\n</head>');}
  if(/<footer[\s>]/i.test(h)&&!h.includes('data-brand-identity-link')){
    const label=h.match(/<html[^>]*lang="uk"/i)?'Ідентичність і цитування':'Identity & citation';
    h=h.replace('</footer>',`<div class="wrap" data-brand-identity-link="true"><a href="${h.match(/<html[^>]*lang="uk"/i)?base+'uk/identity/':identityUrl}">${label}</a> · <a href="${identityJsonUrl}">identity.json</a></div></footer>`);
  }
  writeFileSync(file,h,'utf8'); changed++;
}
console.log(`BRAND_IDENTITY_BUILD=PASS pages=${pages} touched=${changed} identity_pages=2 identity_json=PASS aliases=${aliases.length} org_jsonld=PASS citation_link=PASS sitemap=PASS llms=PASS`);
