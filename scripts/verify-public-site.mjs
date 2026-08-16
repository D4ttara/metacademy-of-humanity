import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const walk = directory => readdirSync(directory).flatMap(name => {
  const path = join(directory, name);
  return statSync(path).isDirectory() && ![".git", "node_modules"].includes(name) ? walk(path) : [path];
});
const files = walk(root);
const publicFiles = files.filter(path => /\.(html|md|css|js|svg|ya?ml)$/i.test(path));
const required = [
  "index.html", "manifesto/index.html", "research/index.html", "science-aperture/index.html", "fields/index.html",
  "library/index.html", "library/antaram/index.html", "library/antaram/uk/index.html",
  "library/antaram/ANTARAM_MIZH_1.61_FREE_SANSKRIT_ADAPTATION_L4_VOICE_REBODY_V3.md",
  "documents/index.html", "documents/003-life-as-organization/index.html", "documents/003-life-as-organization/en/index.html",
  "documents/003-life-as-organization/METACADEMY_DOCUMENT_003_LIFE_AS_ORGANIZATION_UA_v1.0.md",
  "documents/003-life-as-organization/METACADEMY_DOCUMENT_003_LIFE_AS_ORGANIZATION_UA_v1.0.pdf",
  "documents/003-life-as-organization/METACADEMY_DOCUMENT_003_LIFE_AS_ORGANIZATION_EN_v1.0.md",
  "documents/003-life-as-organization/METACADEMY_DOCUMENT_003_LIFE_AS_ORGANIZATION_EN_v1.0.pdf",
  "documents/004-when-science-reaches-a-plateau/index.html", "documents/004-when-science-reaches-a-plateau/en/index.html",
  "documents/004-when-science-reaches-a-plateau/ua/index.html",
  "documents/004-when-science-reaches-a-plateau/METACADEMY_DOCUMENT_004_SCIENCE_ON_A_PLATEAU_EN_v1.1.pdf",
  "documents/004-when-science-reaches-a-plateau/METACADEMY_DOCUMENT_004_SCIENCE_ON_A_PLATEAU_UA_v1.1.pdf",
  "publications/PUBLICATION_REGISTRY.yml", "governance/PUBLICATION_CANON.md",
  "research/active-research/OPERATOR_PASSPORTS.yml", "research/active-research/sa001_sa002.test.mjs",
  "uk/index.html", "uk/manifesto/index.html", "uk/research/index.html", "uk/science-aperture/index.html", "uk/fields/index.html",
  "uk/documents/index.html", "uk/library/index.html", "uk/participate/index.html", "uk/updates/index.html",
  "participate/index.html", "updates/index.html", "support/index.html",
  "CONTRIBUTING.md", "CODE_OF_CONDUCT.md", "CITATION.cff", "COST_AND_INFRASTRUCTURE.md", "UPDATES.md",
  "robots.txt", "sitemap.xml", ".github/workflows/pages.yml"
];
for (const file of required) if (!files.includes(join(root, file))) throw new Error(`Missing required file: ${file}`);

const forbidden = [/C:\\Users\\/i, /\.chatgpt-projects/i, /\.codex/i, /drive\.google\.com/i, /TELEGRAM_BOT_TOKEN/i, /(?:api[_-]?key|secret|token)\s*[:=]\s*['\"][^'\"]+/i, /Jobcenter|residence permit|insurance number/i];
for (const path of publicFiles) {
  const text = readFileSync(path, "utf8");
  for (const pattern of forbidden) if (pattern.test(text)) throw new Error(`Private marker ${pattern} in ${relative(root, path)}`);
}

for (const path of files.filter(path => /\.(html|xml)$/i.test(path))) {
  const text = readFileSync(path, "utf8");
  if (text.includes('hreflang="ru"') || text.includes('lang="ru"') || text.includes('>RU<') || text.includes('/ru/')) {
    throw new Error(`Russian locale residue in ${relative(root, path)}`);
  }
}

const fields = readFileSync(join(root, "fields/index.html"), "utf8");
if ((fields.match(/<strong>(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII · AI)<\/strong>/g) ?? []).length !== 13) throw new Error("Field map is not exactly 13 domains");

const home = readFileSync(join(root, "index.html"), "utf8");
for (const route of ["manifesto/", "research/", "science-aperture/", "fields/", "library/", "documents/", "participate/"]) if (!home.includes(`href=\"${route}\"`)) throw new Error(`Home link missing: ${route}`);
if (!home.includes('href="uk/"')) throw new Error("Home UKR language switch missing");
if (!home.includes('<span class="wordmark-main">MET[Ȧ]CADEMY</span><span class="wordmark-sub"><span class="wordmark-of">of</span> HUMANITY</span>')) throw new Error("Canonical structured display wordmark missing");

const css = readFileSync(join(root, "assets/css/site.css"), "utf8");
if (/IBM Plex Serif|Georgia\s*,\s*serif|font-family\s*:[^;]*serif/i.test(css)) throw new Error("Serif typography residue in public site CSS");
if (!css.includes('--blue-stripe:') || !css.includes('.wordmark-main') || !css.includes('.wordmark-sub')) throw new Error("Document-led visual system guard missing");

const readerPages = [
  "documents/003-life-as-organization/index.html",
  "documents/003-life-as-organization/en/index.html",
  "documents/004-when-science-reaches-a-plateau/en/index.html",
  "documents/004-when-science-reaches-a-plateau/ua/index.html"
];
for (const page of readerPages) {
  if (!readFileSync(join(root, page), "utf8").includes('data-markdown-render="true"')) throw new Error(`Document reader missing: ${page}`);
}

const registry = readFileSync(join(root, "publications/PUBLICATION_REGISTRY.yml"), "utf8");
for (const token of ["life-as-organization", "when-science-reaches-a-plateau", "ANTARAM", "uk_html:", "sha256:"]) if (!registry.includes(token)) throw new Error(`Publication registry missing ${token}`);

const antaram = readFileSync(join(root, "library/antaram/ANTARAM_MIZH_1.61_FREE_SANSKRIT_ADAPTATION_L4_VOICE_REBODY_V3.md"));
const antaramHash = createHash("sha256").update(antaram).digest("hex");
if (antaramHash !== "56a3f0d28fd5108fe3517b82acf4ca6e92c7d7ef8b0bd31cc499932d3557b707") throw new Error(`ANTARAM SHA mismatch: ${antaramHash}`);

console.log(`PUBLIC_SITE_VERIFY=PASS files=${publicFiles.length} routes=7 language_shell=EN_UKR typography=SANS_ONLY wordmark=STRUCTURED blue_axis=PASS document_readers=4 antaram_sha=PASS private_markers=0 domains=13`);
