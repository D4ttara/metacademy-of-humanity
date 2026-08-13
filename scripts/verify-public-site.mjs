import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const walk = d => readdirSync(d).flatMap(n => { const p = join(d,n); return statSync(p).isDirectory() && ![".git","node_modules"].includes(n) ? walk(p) : [p]; });
const files = walk(root);
const required = ["index.html","ua/index.html","ua/documents/index.html","ua/science-aperture/index.html","ua/library/index.html","documents/005-when-time-becomes-relational/index.html","documents/005-when-time-becomes-relational/en/index.html","documents/005-when-time-becomes-relational/ua/index.html","documents/005-when-time-becomes-relational/METACADEMY_DOCUMENT_005_WHEN_TIME_BECOMES_RELATIONAL_EN_v1.0.md","documents/005-when-time-becomes-relational/METACADEMY_DOCUMENT_005_WHEN_TIME_BECOMES_RELATIONAL_UA_v1.0.md","documents/005-when-time-becomes-relational/METACADEMY_DOCUMENT_005_WHEN_TIME_BECOMES_RELATIONAL_EN_v1.0.pdf","documents/005-when-time-becomes-relational/METACADEMY_DOCUMENT_005_WHEN_TIME_BECOMES_RELATIONAL_UA_v1.0.pdf","research/graphs/knowledge_graph_v01.jsonl","research/graphs/project_evolution_graph_v01.jsonl","research/sa003/sa003.test.mjs","publications/PUBLICATION_REGISTRY.yml","sitemap.xml"];
for (const f of required) if (!files.includes(join(root,f))) throw new Error(`Missing ${f}`);
// Historical RU and V3 source artifacts remain preserved in Git; canonical navigation and sitemap must not expose them.
const home = readFileSync(join(root,"index.html"),"utf8");
for (const text of ['hreflang="uk"','href="ua/"','MET[Ȧ]CADEMY <span class="wordmark-of">of</span> HUMANITY']) if (!home.includes(text)) throw new Error(`Home policy missing ${text}`);
const sitemap = readFileSync(join(root,"sitemap.xml"),"utf8");
if (sitemap.includes("/ru/") || sitemap.includes("/library/antaram/")) throw new Error("Historical route remains indexed");
for (const p of ["documents/005-when-time-becomes-relational/en/index.html","documents/005-when-time-becomes-relational/ua/index.html"]) if (!readFileSync(join(root,p),"utf8").includes('data-markdown-render="true"')) throw new Error(`Reader missing ${p}`);
const forbidden = [/C:\\Users\\/i,/\.chatgpt-projects/i,/\.codex/i,/drive\.google\.com/i,/TELEGRAM_BOT_TOKEN/i,/Jobcenter|residence permit|insurance number/i];
for (const p of files.filter(p=>/\.(html|md|jsonl|ya?ml)$/i.test(p))) { const t=readFileSync(p,"utf8"); for (const x of forbidden) if(x.test(t)) throw new Error(`Private marker in ${relative(root,p)}`); }
const checks = [
 ["EN MD","documents/005-when-time-becomes-relational/METACADEMY_DOCUMENT_005_WHEN_TIME_BECOMES_RELATIONAL_EN_v1.0.md","71bd1ffcf01544ed698a1606e9ea2278ce58e09db25742b5af3bff68ea99d55b"],
 ["UA MD","documents/005-when-time-becomes-relational/METACADEMY_DOCUMENT_005_WHEN_TIME_BECOMES_RELATIONAL_UA_v1.0.md","44fbbbd0f2e40f7a3b352218dadb5cc1a99b2c32abf4c6a69807183743ea3505"]];
for (const [n,p,h] of checks) if(createHash("sha256").update(readFileSync(join(root,p))).digest("hex")!==h) throw new Error(`${n} hash mismatch`);
console.log("PUBLIC_SITE_VERIFY=PASS language_shell=EN_UA core_graphs=2 document005=EN_UA private_markers=0");
