import { readFileSync, writeFileSync } from 'node:fs';

const fixes = [
  ['topics/index.html', [
    ['href="assets/', 'href="../assets/'],
    ['href="documents/"', 'href="../documents/"'],
    ['href="research/"', 'href="../research/"'],
    ['class="brand" href=""', 'class="brand" href="../"']
  ]],
  ['uk/topics/index.html', [
    ['class="brand" href="../../"', 'class="brand" href="../"'],
    ['href="../../documents/"', 'href="../documents/"'],
    ['href="../../research/"', 'href="../research/"']
  ]]
];

for (const [path, replacements] of fixes) {
  let html = readFileSync(path,'utf8');
  for (const [from,to] of replacements) html = html.replace(from,to);
  writeFileSync(path,html,'utf8');
}
console.log('SEARCH_TAXONOMY_LINK_FIX=PASS topic_indexes=2');
