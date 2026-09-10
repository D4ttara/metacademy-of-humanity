#!/usr/bin/env bash
set -euo pipefail
export SOURCE_DATE_EPOCH=1789073280
export TZ=UTC
ROOT="uk/books/memories-of-humanity/book-1/free-reading"
REG="publications/MOH_FREE_READING_UA_v76.json"
OUT="$ROOT/formats"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

node -e 'const c=require("./publications/MOH_FREE_READING_UA_v76.json"); for(const p of c.pieces) console.log([p.id,p.kind,p.title,p.sha256].join("\t"))' |
while IFS=$'\t' read -r id kind title expected; do
  src="$ROOT/source/$(node -e 'const c=require("./publications/MOH_FREE_READING_UA_v76.json"); const p=c.pieces.find(x=>x.id===process.argv[1]); process.stdout.write(require("node:path").basename(p.source_path))' "$id")"
  reader="$ROOT/readers/$id.md"
  pdf="$OUT/MOH_FREE_READING_UA_v76_${id}.pdf"
  epub="$OUT/MOH_FREE_READING_UA_v76_${id}.epub"
  actual="$(sha256sum "$src" | awk '{print $1}')"
  [[ "$actual" == "$expected" ]] || { echo "$id SOURCE_HASH=FAIL expected=$expected actual=$actual"; exit 1; }
  test -s "$reader"
  tmpmd="$TMP/${id}.md"
  cat "$reader" > "$tmpmd"
  cat >> "$tmpmd" <<EOF

---

### Про це безкоштовне видання

**«Згадки про Людство» · Книга I · «Алекс Штольман і Скрижалі Реваншу» · українська редакція v76 · 10 вересня 2026.**

Цей файл є безкоштовним читацьким виданням окремого художнього фрагмента. Літературний текст походить із source v76 і не переписаний під дослідницький стиль Академії. `FICTION != RESEARCH EVIDENCE`.

**Повна книга:** https://payhip.com/b/9GnpH

**Підтримати MoH:** https://d4ttara.github.io/metacademy-of-humanity/support/

Monobank: https://send.monobank.ua/jar/2TMaAhchSZ  
PayPal: https://www.paypal.me/4IevgenKarogod  
USDT · TRC20: `TDaCBB3T94CtMPRHN9pP8Uvdy8CTtWE5SV`

© 2026 Ievgen Karogod / Dattara. Усі права застережено. Безкоштовний доступ не є відмовою від авторського права.
EOF
  pandoc "$tmpmd" --from=markdown+smart --pdf-engine=xelatex \
    -V mainfont="IBM Plex Sans" -V monofont="IBM Plex Mono" \
    -V geometry:paperwidth=6in -V geometry:paperheight=9in -V geometry:margin=18mm \
    -V fontsize=10.5pt --metadata title="$kind. $title" \
    --metadata subtitle="Згадки про Людство · Book I · Free Reading · $id" \
    --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$pdf"
  pandoc "$tmpmd" --from=markdown+smart --metadata title="$kind. $title" \
    --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$epub"
  test -s "$pdf" && test -s "$epub"
  pdfinfo "$pdf" >/dev/null
  pdffonts "$pdf" | grep -q 'IBMPlexSans' || { echo "$id PDF_FONT=FAIL"; exit 1; }
  pdftotext "$pdf" - | grep -Fqi "Згадки про Людство" || { echo "$id PDF_TEXT=FAIL"; exit 1; }
done

node - "$REG" "$OUT" <<'NODE'
const fs=require('node:fs');const crypto=require('node:crypto');const path=require('node:path');
const cfg=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));const out=process.argv[3];
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const files=cfg.pieces.map(p=>{const stem=`MOH_FREE_READING_UA_v76_${p.id}`;const pdf=path.join(out,stem+'.pdf'),epub=path.join(out,stem+'.epub');return {id:p.id,source_sha256:p.sha256,pdf_sha256:hash(pdf),epub_sha256:hash(epub),pdf_bytes:fs.statSync(pdf).size,epub_bytes:fs.statSync(epub).size};});
fs.writeFileSync('publications/MOH_FREE_READING_UA_v76_FORMAT_RECEIPT.json',JSON.stringify({schema:'metacademy-literary-format-receipt/v1',series_id:cfg.series_id,source_master_sha256:cfg.source.sha256,language:'uk',formats:['pdf','epub'],typography:'IBM Plex Sans + IBM Plex Mono',page_format:'6x9in',files},null,2)+'\n');
console.log(`MOH_FREE_READING_FORMATS=PASS pieces=${files.length} pdf=${files.length} epub=${files.length}`);
NODE
