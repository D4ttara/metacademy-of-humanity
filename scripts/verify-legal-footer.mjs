import { readFileSync, existsSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const legalPath = 'legal/index.html';
if (!existsSync(legalPath)) throw new Error('Missing legal/index.html');
const legal = readFileSync(legalPath, 'utf8');
for (const token of [
  'Ievgen Karogod / Dattara',
  'memoriesofhumanity.moh@gmail.com',
  'Eichendorf, Bayern, Deutschland',
  'keine staatlich anerkannte Universität oder Hochschule',
  'nicht als Behauptung eines vollständig erfüllten Impressums',
  'noindex,follow,noarchive'
]) {
  if (!legal.includes(token)) throw new Error(`Legal page missing required boundary: ${token}`);
}
if (/Straße|Strasse|Hausnummer|\+49\s*\d/.test(legal)) throw new Error('Private street/phone-like data unexpectedly present in legal page');

const legalUrl = 'https://d4ttara.github.io/metacademy-of-humanity/legal/';
let footers = 0;
let linked = 0;
function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (name === '.git' || name === 'node_modules') continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (name.endsWith('.html')) {
      const html = readFileSync(p, 'utf8');
      if (html.includes('<footer')) {
        footers++;
        if (html.includes(legalUrl)) linked++;
      }
    }
  }
}
walk('.');
if (footers === 0) throw new Error('No footers found');
if (linked !== footers) throw new Error(`Legal footer missing: ${linked}/${footers}`);
console.log(`LEGAL_PRIVACY_VERIFY=PASS footers=${footers} linked=${linked} residential_address=WITHHELD compliance_claim=NOT_MADE`);
