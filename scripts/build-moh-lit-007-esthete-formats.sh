#!/usr/bin/env bash
set -euo pipefail
export SOURCE_DATE_EPOCH=1789077600
export TZ=UTC
ROOT="uk/books/memories-of-humanity/book-1/free-reading"
SRC="$ROOT/source/MOH_LIT_007_ESTHETE_REVIEW_UA.md"
OUT="$ROOT/formats"
PDF="$OUT/MOH_LIT_007_ESTHETE_REVIEW_UA.pdf"
EPUB="$OUT/MOH_LIT_007_ESTHETE_REVIEW_UA.epub"
EXPECTED="8e257fa31bc8c9299bece199d3c4eb3b141d0627f3dada45092d8cc051f0a16b"
mkdir -p "$OUT"
actual="$(sha256sum "$SRC" | awk '{print $1}')"
[[ "$actual" == "$EXPECTED" ]] || { echo "LIT_007_SOURCE_HASH=FAIL expected=$EXPECTED actual=$actual"; exit 1; }

pandoc "$SRC" --from=markdown+smart --pdf-engine=xelatex \
  -V mainfont="IBM Plex Sans" -V monofont="IBM Plex Mono" \
  -V geometry:paperwidth=6in -V geometry:paperheight=9in -V geometry:margin=18mm \
  -V fontsize=10.5pt --metadata title="Естет після фіналу" \
  --metadata subtitle="Критика «Згадок про Людство» після того, як книга відмовилася бути зручною" \
  --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$PDF"

pandoc "$SRC" --from=markdown+smart \
  --metadata title="Естет після фіналу" \
  --metadata subtitle="Критика «Згадок про Людство» після того, як книга відмовилася бути зручною" \
  --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$EPUB"

test -s "$PDF" && test -s "$EPUB"
pdfinfo "$PDF" >/dev/null
pdffonts "$PDF" | grep -q 'IBMPlexSans' || { echo "LIT_007_PDF_FONT=FAIL"; exit 1; }
pdftotext "$PDF" - | grep -Fqi 'Естет після фіналу' || { echo "LIT_007_PDF_TEXT=FAIL"; exit 1; }
pdftotext "$PDF" - | grep -Fqi 'CRITIQUE != VERDICT' || { echo "LIT_007_BOUNDARY_TEXT=FAIL"; exit 1; }

node - "$PDF" "$EPUB" <<'NODE'
const fs=require('node:fs'), crypto=require('node:crypto');
const [pdf,epub]=process.argv.slice(2);const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const receipt={schema:'metacademy-literary-paratext-format-receipt/v1',id:'LIT-007',language:'uk',source_sha256:'8e257fa31bc8c9299bece199d3c4eb3b141d0627f3dada45092d8cc051f0a16b',formats:['pdf','epub'],typography:'IBM Plex Sans + IBM Plex Mono',page_format:'6x9in',pdf:{sha256:hash(pdf),bytes:fs.statSync(pdf).size},epub:{sha256:hash(epub),bytes:fs.statSync(epub).size}};
fs.writeFileSync('publications/MOH_LIT_007_ESTHETE_REVIEW_UA_FORMAT_RECEIPT.json',JSON.stringify(receipt,null,2)+'\n');
console.log(`MOH_LIT_007_FORMATS=PASS pdf=${receipt.pdf.sha256} epub=${receipt.epub.sha256}`);
NODE
