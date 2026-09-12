import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';

const must=(cond,msg)=>{ if(!cond) throw new Error(msg); };
const exists=p=>must(existsSync(p),`missing ${p}`);
const text=p=>readFileSync(p,'utf8');
const bytes=p=>readFileSync(p);
const sha=p=>createHash('sha256').update(readFileSync(p)).digest('hex');

const root='manifestos/archive/metacademy-continuity';
const editions=[
  ['v1.0','META_A_CADEMY_MANIFEST_V1.0.md','META[A]CADEMY OF HUMANITY'],
  ['v1.1','META_A_CADEMY_MANIFEST_V1.1_UA.md','MET[Ȧ]CADEMY OF HUMANITY'],
  ['v1.1','META_A_CADEMY_MANIFEST_V1.1_EN.md','MET[Ȧ]CADEMY OF HUMANITY'],
  ['v1.2','MET_A_CADEMY_MANIFEST_V1.2_UA.md','MET[Ȧ]CADEMY OF HUMANITY'],
  ['v1.2','MET_A_CADEMY_MANIFEST_V1.2_EN.md','MET[Ȧ]CADEMY OF HUMANITY']
];
for(const [v,name,identity] of editions){
  const p=`${root}/${v}/${name}`; exists(p); const s=text(p);
  must(s.includes(identity),`${p}: historical/canonical identity mismatch`);
  for(const ext of ['pdf','epub','docx']) exists(p.replace(/\.md$/,`_PUBLIC.${ext}`));
}

const preAlpha=[
  'MANIFEST_PRE_ALPHA_UA.md',
  'MANIFEST_PRE_ALPHA_EN.md',
  'MANIFEST_PRE_ALPHA_DE.md'
];
for(const name of preAlpha) exists(`manifestos/archive/pre-alpha/${name}`);

const currentUa=text('manifesto/METACADEMY_MANIFEST_V1.2_UA.md');
const currentEn=text('manifesto/METACADEMY_MANIFEST_V1.2_EN.md');
must(currentUa.includes('Маніфест продовжуваності знання'),'current UA manifesto title missing');
must(currentEn.includes('Manifesto of Knowledge Continuity'),'current EN manifesto title missing');
must(currentUa.includes('MET[Ȧ]CADEMY OF HUMANITY'),'current UA manifesto identity missing');
must(currentEn.includes('MET[Ȧ]CADEMY OF HUMANITY'),'current EN manifesto identity missing');

const d017='documents/017-human-ai-what-or-we';
const md017v10=`${d017}/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0.md`;
const md017v11=`${d017}/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.1.md`;
exists(md017v10);
must(sha(md017v10)==='b4fcdd99d5ba3a25bc3e5b94ea8273311ad3dcafd39e96ee6d50d1c903a99fb4','Document 017 v1.0 provenance Markdown SHA mismatch');

// v1.1 is reconstructed from the exact archived Drive master transport witness.
// The public reader is now required to be byte-identical to that master, rather
// than merely a UTF-8 mirror. Semantic anchors below are all observed in the
// canonical Drive source; they must never invent wording absent from that source.
const driveV11={
  title:'MoH-Human-AI-Manifesto-UA-v1.1.md',
  id:'1I-pk-dB3ZDVbi7fGbvwwpPTuYqauMZ05',
  bytes:81562,
  sha256:'134955a3ec990efd31c307602007fd1a83233722f54ef039992360c90f851be7'
};
exists(md017v11);
const repoV11Bytes=bytes(md017v11), repoV11=text(md017v11), repoV11Sha=sha(md017v11);
console.log(`DOCUMENT_017_V1_1_PROVENANCE archive_drive_id=${driveV11.id} archive_sha256=${driveV11.sha256} archive_bytes=${driveV11.bytes} repo_reader_sha256=${repoV11Sha} repo_reader_bytes=${repoV11Bytes.length} relation=${repoV11Sha===driveV11.sha256?'BYTE_IDENTICAL':'MISMATCH'}`);
must(repoV11Bytes.length===driveV11.bytes,'Document 017 v1.1 reader byte count differs from exact Drive master');
must(repoV11Sha===driveV11.sha256,'Document 017 v1.1 reader is not byte-identical to exact Drive master');
must(!repoV11.includes('\uFFFD'),'Document 017 v1.1 public reader contains Unicode replacement characters');
for(const needle of [
  '# Людина і ШІ: що чи ми?',
  'редакція 1.1',
  'тримати змія',
  'У розмовах Академії про перший шанс',
  'Майбутнє не може показати довідку про минулий успіх',
  'TYPE IS A PROJECTION, NOT AN ESSENCE',
  'Butlin et al., 2023',
  'Vaccaro et al., 2024',
  'M{Y}OGA',
  'Підтримати автора й Академію'
]) must(repoV11.includes(needle),`Document 017 v1.1 exact master missing observed anchor: ${needle}`);

const p017=text(`${d017}/ua/index.html`);
must(p017.includes('METACADEMY-DOC-017-UA-v1.1'),'Document 017 page missing v1.1 citation ID');
must(p017.includes('UA_v1.1.md'),'Document 017 page missing v1.1 Markdown link');
must(!p017.includes('UA_v1.0_PUBLIC.pdf'),'Document 017 page must not advertise old generated PDF as v1.1');
must(!p017.includes('UA_v1.0_PUBLIC.epub'),'Document 017 page must not advertise old generated EPUB as v1.1');
must(!p017.includes('UA_v1.0_PUBLIC.docx'),'Document 017 page must not advertise old generated DOCX as v1.1');
must(!p017.includes('HUMAN_AI_WHAT_OR_WE_COVER_UA_v1.0.jpg'),'Document 017 still references missing cover');

console.log(`MANIFESTO_LINEAGE_VERIFY=PASS continuity_editions=${editions.length} historical_pre_alpha=${preAlpha.length} pre_alpha_sources=MD,PDF document_017_v1.0_provenance=PASS document_017_v1.1=BYTE_IDENTICAL document_017_formats=HTML,MD broken_cover=ZERO`);
