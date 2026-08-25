#!/usr/bin/env bash
set -euo pipefail

export SOURCE_DATE_EPOCH=1786924800
export TZ=UTC

FONT_ROOT="/usr/share/texlive/texmf-dist/fonts/opentype/ibm/plex"
for f in IBMPlexSans-Regular.otf IBMPlexSans-SemiBold.otf IBMPlexSans-Italic.otf IBMPlexSans-SemiBoldItalic.otf IBMPlexMono-Regular.otf IBMPlexMono-SemiBold.otf; do
  test -f "$FONT_ROOT/$f" || { echo "Missing required IBM Plex font: $FONT_ROOT/$f" >&2; exit 1; }
done

TEMPLATE="scripts/moh_article_template.tex"
TMP_BUILD="$(mktemp -d)"
trap 'rm -rf "$TMP_BUILD"' EXIT

declare -a ITEMS=(
  "007 en documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.md documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.pdf 3 3"
  "007 ua documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.md documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.pdf 3 3"
  "008 en documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.md documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.pdf 3 3"
  "008 ua documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.md documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.pdf 3 3"
  "009 en documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.md documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.pdf 5 12"
  "009 ua documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.md documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.pdf 5 12"
)

for item in "${ITEMS[@]}"; do
  read -r doc lang md pdf min_pages max_pages <<<"$item"
  echo "Building Document $doc $lang -> $pdf"
  tmpmd="$TMP_BUILD/${doc}_${lang}.md"
  python3 - "$md" "$tmpmd" <<'PY'
from pathlib import Path
import re, sys
src, dst = map(Path, sys.argv[1:])
text = src.read_text(encoding='utf-8')
text = text.replace('\u0226', 'A\u0307')
text = re.split(r'\n---\n\n\*\*(?:Status|Статус):\*\*', text, maxsplit=1)[0].rstrip() + '\n'
dst.write_text(text, encoding='utf-8')
PY
  pandoc "$tmpmd" --from=markdown+yaml_metadata_block --pdf-engine=xelatex --template="$TEMPLATE" --output="$pdf"
  if [[ "$doc" == "009" ]]; then
    # Some xdvipdfmx builds emit one trailer /ID, while current Ubuntu/TeX Live
    # can legally emit none. Preserve the no-ID output; deterministically
    # normalise the single-ID form; fail only on an ambiguous multi-ID form.
    python3 - "$pdf" <<'PY'
from pathlib import Path
import hashlib, re, sys
path = Path(sys.argv[1])
data = path.read_bytes()
pat = re.compile(rb'(/ID\s*\[\s*<)([0-9A-Fa-f]{32})(>\s*<)([0-9A-Fa-f]{32})(>\s*\])')
matches = list(pat.finditer(data))
if len(matches) == 0:
    print(f'PDF_TRAILER_ID=ABSENT file={path} action=PRESERVE')
elif len(matches) == 1:
    zeroed = pat.sub(lambda m: m.group(1)+b'0'*32+m.group(3)+b'0'*32+m.group(5), data, count=1)
    stable = hashlib.sha256(zeroed).hexdigest()[:32].encode('ascii')
    normal = pat.sub(lambda m: m.group(1)+stable+m.group(3)+stable+m.group(5), data, count=1)
    path.write_bytes(normal)
    print(f'PDF_TRAILER_ID=DETERMINISTIC file={path} id={stable.decode()}')
else:
    raise SystemExit(f'Ambiguous PDF trailer IDs in {path}: found {len(matches)}')
PY
  fi
  pages="$(pdfinfo "$pdf" | awk '/^Pages:/ {print $2}')"
  if (( pages < min_pages || pages > max_pages )); then
    echo "Unexpected page count for $pdf: $pages (expected range $min_pages-$max_pages)" >&2
    exit 1
  fi
  pdftotext "$pdf" - | grep -q "MET" || { echo "PDF text extraction failed for $pdf" >&2; exit 1; }
  pdffonts "$pdf" | grep -q "IBMPlexSans" || { echo "IBM Plex Sans missing from $pdf" >&2; exit 1; }
  pdffonts "$pdf" | grep -q "IBMPlexMono" || { echo "IBM Plex Mono missing from $pdf" >&2; exit 1; }
  if [[ "$doc" == "009" ]]; then
    pdftotext "$pdf" - | grep -qi "Musk" || { echo "Document 009 Musk text missing from $pdf" >&2; exit 1; }
    pdftotext "$pdf" - | grep -qi "Zuckerberg" || { echo "Document 009 Zuckerberg text missing from $pdf" >&2; exit 1; }
    pdftotext "$pdf" - | grep -qi "SUPPORT" || pdftotext "$pdf" - | grep -qi "ПІДТРИМАТИ" || { echo "Document 009 file-only support section missing from $pdf" >&2; exit 1; }
  fi
  echo "PDF_PREFLIGHT=PASS doc=$doc lang=$lang pages=$pages typography=IBM_PLEX text_extract=PASS"
done

python3 - <<'PY'
from pathlib import Path
import hashlib, json, re, subprocess

root = Path('.')
all_items = {
    ('007','en'): root/'documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.pdf',
    ('007','ua'): root/'documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.pdf',
    ('008','en'): root/'documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.pdf',
    ('008','ua'): root/'documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.pdf',
    ('009','en'): root/'documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.pdf',
    ('009','ua'): root/'documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.pdf',
}
all_mds = {
    ('007','en'): root/'documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.md',
    ('007','ua'): root/'documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.md',
    ('008','en'): root/'documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.md',
    ('008','ua'): root/'documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.md',
    ('009','en'): root/'documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.md',
    ('009','ua'): root/'documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.md',
}
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
def pages(p):
    out = subprocess.check_output(['pdfinfo', str(p)], text=True)
    for line in out.splitlines():
        if line.startswith('Pages:'):
            return int(line.split(':',1)[1].strip())
    raise RuntimeError(f'No page count for {p}')

receipt_007_008 = {
  'schema': 'metacademy-publication-build-receipt/v1', 'date': '2026-08-17', 'version': 'v1.0RC',
  'documents': {doc: {lang: {'markdown_sha256': sha(all_mds[(doc,lang)]),'pdf_sha256': sha(all_items[(doc,lang)]),'page_count': pages(all_items[(doc,lang)]),'typography': 'IBM Plex Sans + IBM Plex Mono','paper': 'A4'} for lang in ('en','ua')} for doc in ('007','008')}
}
(root/'publications/PUBLICATION_BUILD_RECEIPT_007_008_v1.0RC.json').write_text(json.dumps(receipt_007_008, ensure_ascii=False, indent=2)+"\n", encoding='utf-8')

receipt_009 = {
  'schema': 'metacademy-publication-build-receipt/v1', 'date': '2026-08-17', 'version': 'v1.0RC',
  'documents': {'009': {lang: {'markdown_sha256': sha(all_mds[('009',lang)]),'pdf_sha256': sha(all_items[('009',lang)]),'page_count': pages(all_items[('009',lang)]),'typography': 'IBM Plex Sans + IBM Plex Mono','paper': 'A4','file_only_support_block': True} for lang in ('en','ua')}}
}
(root/'publications/PUBLICATION_BUILD_RECEIPT_009_v1.0RC.json').write_text(json.dumps(receipt_009, ensure_ascii=False, indent=2)+"\n", encoding='utf-8')

path = root/'publications/PUBLICATION_REGISTRY.yml'
lines = path.read_text(encoding='utf-8').splitlines()
current_doc = current_lang = None
in_sha = False
for i, line in enumerate(lines):
    m = re.match(r'\s*- number: "(\d+)"', line)
    if m:
        current_doc = m.group(1); current_lang = None; in_sha = False; continue
    m = re.match(r'\s*- language: (en|ua)\s*$', line)
    if m and current_doc in {'007','008','009'}:
        current_lang = m.group(1); in_sha = False; continue
    if current_doc in {'007','008','009'} and current_lang and re.match(r'\s*sha256:\s*$', line):
        in_sha = True; continue
    if in_sha and re.match(r'\s*pdf:\s*', line):
        indent = line[:len(line)-len(line.lstrip())]
        lines[i] = f"{indent}pdf: {sha(all_items[(current_doc,current_lang)])}"
        in_sha = False
path.write_text("\n".join(lines)+"\n", encoding='utf-8')
print(json.dumps(receipt_009, ensure_ascii=False, indent=2))
PY

echo "ARTICLE_PDF_BUILD=PASS documents=007,008,009 editions=EN,UA typography=IBM_PLEX"
