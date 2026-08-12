import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const walk = directory => readdirSync(directory).flatMap(name => {
  const path = join(directory, name);
  return statSync(path).isDirectory() && ![".git", "node_modules"].includes(name) ? walk(path) : [path];
});
const files = walk(root);
const publicFiles = files.filter(path => /\.(html|md|css|js|svg|ya?ml)$/i.test(path));
const required = ["index.html", "manifesto/index.html", "research/index.html", "science-aperture/index.html", "fields/index.html", "library/index.html", "README.md", ".github/workflows/pages.yml"];
for (const file of required) if (!files.includes(join(root, file))) throw new Error(`Missing required file: ${file}`);
const forbidden = [/C:\\Users\\/i, /\.codex/i, /TELEGRAM_BOT_TOKEN/i, /(?:api[_-]?key|secret|token)\s*[:=]\s*['\"][^'\"]+/i, /Jobcenter|residence permit|insurance number/i];
for (const path of publicFiles) {
  const text = readFileSync(path, "utf8");
  for (const pattern of forbidden) if (pattern.test(text)) throw new Error(`Private marker ${pattern} in ${relative(root, path)}`);
}
const fields = readFileSync(join(root, "fields/index.html"), "utf8");
if ((fields.match(/<strong>(?:I|II|III|IV|V|VI|VII|VIII|IX|X|XI|XII|XIII · AI)<\/strong>/g) ?? []).length !== 13) throw new Error("Field map is not exactly 13 domains");
const home = readFileSync(join(root, "index.html"), "utf8");
for (const route of ["manifesto/", "research/", "science-aperture/", "fields/", "library/"]) if (!home.includes(`href=\"${route}\"`)) throw new Error(`Home link missing: ${route}`);
console.log(`PUBLIC_SITE_VERIFY=PASS files=${publicFiles.length} routes=5 private_markers=0 domains=13`);
