#!/usr/bin/env bash
set -euo pipefail
export SOURCE_DATE_EPOCH=1789074000
export TZ=UTC
ROOT="uk/books/memories-of-humanity/book-1/free-reading"
SRC="$ROOT/source/MOH_LIT_000_SKUF_REVIEW_UA.md"
ADD="$ROOT/source/MOH_LIT_000_SKUF_V76_ADDENDUM_UA.md"
OUT="$ROOT/formats"
PDF="$OUT/MOH_LIT_000_SKUF_REVIEW_UA.pdf"
EPUB="$OUT/MOH_LIT_000_SKUF_REVIEW_UA.epub"
EXPECTED="a4527a4069defba258cbdc47b704d677d8ea32fe24c92a986787ec479f29e476"
TMP="$(mktemp)"
trap 'rm -f "$TMP"' EXIT
mkdir -p "$OUT"
actual="$(sha256sum "$SRC" | awk '{print $1}')"
[[ "$actual" == "$EXPECTED" ]] || { echo "LIT_000_SOURCE_HASH=FAIL expected=$EXPECTED actual=$actual"; exit 1; }
test -s "$ADD"
cat "$SRC" "$ADD" > "$TMP"

pandoc "$TMP" --from=markdown+smart --pdf-engine=xelatex \
  -V mainfont="IBM Plex Sans" -V monofont="IBM Plex Mono" \
  -V geometry:paperwidth=6in -V geometry:paperheight=9in -V geometry:margin=18mm \
  -V fontsize=10.5pt --metadata title="Скуф проти майбутнього" \
  --metadata subtitle="Інверсна критика «Згадок про Людство» · v76 canon reread" \
  --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$PDF"

pandoc "$TMP" --from=markdown+smart \
  --metadata title="Скуф проти майбутнього" \
  --metadata subtitle="Інверсна критика «Згадок про Людство» · v76 canon reread" \
  --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$EPUB"

test -s "$PDF" && test -s "$EPUB"
pdfinfo "$PDF" >/dev/null
pdffonts "$PDF" | grep -q 'IBMPlexSans' || { echo "LIT_000_PDF_FONT=FAIL"; exit 1; }
pdftotext "$PDF" - | grep -Fqi 'Скуф проти майбутнього' || { echo "LIT_000_PDF_TEXT=FAIL"; exit 1; }
pdftotext "$PDF" - | grep -Fqi 'Скуф дочитав v76' || { echo "LIT_000_V76_ADDENDUM_TEXT=FAIL"; exit 1; }
pdftotext "$PDF" - | grep -Fqi 'SATIRE != DEMOGRAPHIC CLAIM' || { echo "LIT_000_BOUNDARY_TEXT=FAIL"; exit 1; }
pdftotext "$PDF" - | grep -Fqi 'Cloud Imperror' || { echo "LIT_000_V76_CANON_TEXT=FAIL"; exit 1; }

node - "$SRC" "$ADD" "$PDF" "$EPUB" <<'NODE'
const fs=require('node:fs'), crypto=require('node:crypto');
const [src,add,pdf,epub]=process.argv.slice(2);const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const receipt={schema:'metacademy-literary-paratext-format-receipt/v2',id:'LIT-000',language:'uk',source_sha256:hash(src),v76_addendum_sha256:hash(add),assembled_sha256:crypto.createHash('sha256').update(Buffer.concat([fs.readFileSync(src),fs.readFileSync(add)])).digest('hex'),formats:['pdf','epub'],typography:'IBM Plex Sans + IBM Plex Mono',page_format:'6x9in',pdf:{sha256:hash(pdf),bytes:fs.statSync(pdf).size},epub:{sha256:hash(epub),bytes:fs.statSync(epub).size}};
fs.writeFileSync('publications/MOH_LIT_000_SKUF_REVIEW_UA_FORMAT_RECEIPT.json',JSON.stringify(receipt,null,2)+'\n');
console.log(`MOH_LIT_000_FORMATS=PASS source=${receipt.source_sha256} addendum=${receipt.v76_addendum_sha256} pdf=${receipt.pdf.sha256} epub=${receipt.epub.sha256}`);
NODE
