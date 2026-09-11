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
exists('manifestos/archive/PRE_ALPHA_MANIFESTS_007_011_PUBLIC_SAFE_AUDIT.md');
exists('manifestos/archive/PRE_ALPHA_MANIFESTS_007_011_SHA256.txt');

const preAlpha=[
  ['007-mor4mer','METACADEMY_DOCUMENT_007_MOR4MER_MANIFEST_UA_PRE_ALPHA_v0.1'],
  ['008-intellectual-frame','METACADEMY_DOCUMENT_008_INTELLECTUAL_FRAME_MANIFEST_UA_PRE_ALPHA_v0.1'],
  ['009-connection-is-process','METACADEMY_DOCUMENT_009_CONNECTION_IS_PROCESS_MANIFEST_UA_PRE_ALPHA_v0.1'],
  ['010-meta-mood-ps','METACADEMY_DOCUMENT_010_META_MOOD_PS_MANIFEST_UA_PRE_ALPHA_v0.1'],
  ['011-coexis','METACADEMY_DOCUMENT_011_COEXIS_MANIFEST_UA_PRE_ALPHA_v0.1'],
];
for(const [slug,stem] of preAlpha){
  exists(`manifestos/archive/${slug}/index.html`);
  exists(`manifestos/archive/${slug}/${stem}.md`);
  exists(`manifestos/archive/${slug}/${stem}.pdf`);
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
const md017v10=`${d017}/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0.md`;
const md017v11=`${d017}/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.1.md`;
exists(md017v10);
must(sha(md017v10)==='b4fcdd99d5ba3a25bc3e5b94ea8273311ad3dcafd39e96ee6d50d1c903a99fb4','Document 017 v1.0 provenance Markdown SHA mismatch');
exists(md017v11);
must(sha(md017v11)==='134955a3ec990efd31c307602007fd1a83233722f54ef039992360c90f851be7','Document 017 v1.1 Drive Markdown SHA mismatch');
const p017=text(`${d017}/ua/index.html`);
must(p017.includes('METACADEMY-DOC-017-UA-v1.1'),'Document 017 page missing v1.1 citation ID');
must(p017.includes('UA_v1.1.md'),'Document 017 page missing v1.1 Markdown link');
must(!p017.includes('UA_v1.0_PUBLIC.pdf'),'Document 017 page must not advertise old generated PDF as v1.1');
must(!p017.includes('UA_v1.0_PUBLIC.epub'),'Document 017 page must not advertise old generated EPUB as v1.1');
must(!p017.includes('UA_v1.0_PUBLIC.docx'),'Document 017 page must not advertise old generated DOCX as v1.1');
must(!p017.includes('HUMAN_AI_WHAT_OR_WE_COVER_UA_v1.0.jpg'),'Document 017 still references missing cover');

console.log(`MANIFESTO_LINEAGE_VERIFY=PASS continuity_editions=${editions.length} historical_pre_alpha=${preAlpha.length} pre_alpha_sources=MD,PDF document_017_v1.0_provenance=PASS document_017_v1.1_drive=PASS document_017_formats=HTML,MD broken_cover=ZERO`);
