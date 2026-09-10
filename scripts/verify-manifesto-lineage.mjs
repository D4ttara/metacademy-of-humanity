import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

const must=(cond,msg)=>{ if(!cond) throw new Error(msg); };
const text=p=>readFileSync(p,'utf8');
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');
const exists=p=>must(existsSync(p),`missing: ${p}`);

const base='manifestos/archive/metacademy-continuity';
const editions=[
  [`${base}/v1.0/META_A_CADEMY_MANIFEST_V1.0.md`,`${base}/v1.0/META_A_CADEMY_MANIFEST_V1.0_PUBLIC`],
  [`${base}/v1.1/META_A_CADEMY_MANIFEST_V1.1_UA.md`,`${base}/v1.1/META_A_CADEMY_MANIFEST_V1.1_UA_PUBLIC`],
  [`${base}/v1.1/META_A_CADEMY_MANIFEST_V1.1_EN.md`,`${base}/v1.1/META_A_CADEMY_MANIFEST_V1.1_EN_PUBLIC`],
  [`${base}/v1.2/MET_A_CADEMY_MANIFEST_V1.2_UA.md`,`${base}/v1.2/MET_A_CADEMY_MANIFEST_V1.2_UA_PUBLIC`],
  [`${base}/v1.2/MET_A_CADEMY_MANIFEST_V1.2_EN.md`,`${base}/v1.2/MET_A_CADEMY_MANIFEST_V1.2_EN_PUBLIC`],
];
for(const [md,stem] of editions){
  exists(md); for(const ext of ['pdf','epub','docx']) exists(`${stem}.${ext}`);
}

exists(`${base}/index.html`);
exists('manifestos/archive/metacademy-working-public-alpha-2026-08/index.html');
exists('manifestos/archive/human-ai-canon-2026-08-09/MANIFEST_OF_HUMANITY_CANON_2026-08-09.md');

for(const slug of ['007-mor4mer','008-intellectual-frame','009-connection-is-process','010-meta-mood-ps','011-coexis']){
  exists(`manifestos/archive/${slug}/index.html`);
}

const enIndex=text('manifestos/index.html');
const uaIndex=text('uk/manifestos/index.html');
for(const s of [enIndex,uaIndex]){
  must(s.includes('archive/metacademy-continuity/'),'manifest index missing continuity lineage');
  must(s.includes('archive/human-ai-canon-2026-08-09/'),'manifest index missing Human-AI original');
  must(s.includes('archive/'),'manifest index missing historical shelf');
}

const uaManifest=text('manifesto/index.html');
const enManifest=text('manifesto/en/index.html');
must(uaManifest.includes('Маніфест продовжуваності знання'),'UA current manifesto body/title missing');
must(enManifest.includes('Manifesto of the Continuity of Knowledge'),'EN current manifesto body/title missing');
must(uaManifest.includes('V1.2_UA_PUBLIC.epub'),'UA current manifesto EPUB link missing');
must(enManifest.includes('V1.2_EN_PUBLIC.epub'),'EN current manifesto EPUB link missing');

const d017='documents/017-human-ai-what-or-we';
const md017=`${d017}/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0.md`;
exists(md017);
must(sha(md017)==='b4fcdd99d5ba3a25bc3e5b94ea8273311ad3dcafd39e96ee6d50d1c903a99fb4','Document 017 canonical Markdown SHA mismatch');
for(const ext of ['pdf','epub','docx']) exists(`${d017}/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.${ext}`);
exists('publications/PUBLICATION_BUILD_RECEIPT_017_v1.0.json');
const p017=text(`${d017}/ua/index.html`);
must(!p017.includes('HUMAN_AI_WHAT_OR_WE_COVER_UA_v1.0.jpg'),'Document 017 still references missing cover');
for(const ext of ['pdf','epub','docx']) must(p017.includes(`UA_v1.0_PUBLIC.${ext}`),`Document 017 page missing ${ext} link`);

console.log(`MANIFESTO_LINEAGE_VERIFY=PASS continuity_editions=${editions.length} historical_pre_alpha=5 document_017_sha=PASS public_formats=PASS broken_cover=ZERO`);
