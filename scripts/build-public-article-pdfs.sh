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
  "007 en documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.md documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.pdf"
  "007 ua documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.md documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.pdf"
  "008 en documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.md documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.pdf"
  "008 ua documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.md documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.pdf"
)

for item in "${ITEMS[@]}"; do
  read -r doc lang md pdf <<<"$item"
  echo "Building Document $doc $lang -> $pdf"
  tmpmd="$TMP_BUILD/${doc}_${lang}.md"
  python3 - "$md" "$tmpmd" <<'PY'
from pathlib import Path
import re, sys
src, dst = map(Path, sys.argv[1:])
text = src.read_text(encoding='utf-8')
# IBM Plex in TeX Live renders the canonical dotted A reliably in decomposed form.
# The repository Markdown keeps the canonical precomposed character; only the PDF
# build body is normalized for glyph portability.
text = text.replace('\u0226', 'A\u0307')
# Status/copyright already live in PDF furniture (title metadata, running footer).
# Keep them in canonical Markdown/HTML, but suppress the duplicated tail in print so
# a one-line colophon never creates an otherwise blank extra page.
text = re.split(r'\n---\n\n\*\*(?:Status|Статус):\*\*', text, maxsplit=1)[0].rstrip() + '\n'
dst.write_text(text, encoding='utf-8')
PY
  pandoc "$tmpmd" --from=markdown+yaml_metadata_block --pdf-engine=xelatex --template="$TEMPLATE" --output="$pdf"
  pages="$(pdfinfo "$pdf" | awk '/^Pages:/ {print $2}')"
  test "$pages" = "3" || { echo "Unexpected page count for $pdf: $pages (expected 3 after print-tail suppression)" >&2; exit 1; }
  pdftotext "$pdf" - | grep -q "MET" || { echo "PDF text extraction failed for $pdf" >&2; exit 1; }
  pdffonts "$pdf" | grep -q "IBMPlexSans" || { echo "IBM Plex Sans missing from $pdf" >&2; exit 1; }
  pdffonts "$pdf" | grep -q "IBMPlexMono" || { echo "IBM Plex Mono missing from $pdf" >&2; exit 1; }
  echo "PDF_PREFLIGHT=PASS doc=$doc lang=$lang pages=$pages typography=IBM_PLEX text_extract=PASS"
done

python3 - <<'PY'
from pathlib import Path
import hashlib, json, re, subprocess

root = Path('.')
items = {
    ('007','en'): root/'documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.pdf',
    ('007','ua'): root/'documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.pdf',
    ('008','en'): root/'documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.pdf',
    ('008','ua'): root/'documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.pdf',
}
mds = {
    ('007','en'): root/'documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.md',
    ('007','ua'): root/'documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.md',
    ('008','en'): root/'documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.md',
    ('008','ua'): root/'documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.md',
}
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
def pages(p):
    out = subprocess.check_output(['pdfinfo', str(p)], text=True)
    for line in out.splitlines():
        if line.startswith('Pages:'):
            return int(line.split(':',1)[1].strip())
    raise RuntimeError(f'No page count for {p}')

receipt = {
  'schema': 'metacademy-publication-build-receipt/v1',
  'date': '2026-08-17',
  'version': 'v1.0RC',
  'documents': {
    doc: {lang: {
        'markdown_sha256': sha(mds[(doc,lang)]),
        'pdf_sha256': sha(items[(doc,lang)]),
        'page_count': pages(items[(doc,lang)]),
        'typography': 'IBM Plex Sans + IBM Plex Mono',
        'paper': 'A4'
      } for lang in ('en','ua')}
    for doc in ('007','008')
  }
}
(root/'publications/PUBLICATION_BUILD_RECEIPT_007_008_v1.0RC.json').write_text(json.dumps(receipt, ensure_ascii=False, indent=2)+"\n", encoding='utf-8')

# The checked-out registry is part of the Pages artifact. Replace the RC PDF hashes
# with the hashes of the PDFs actually produced by this build, so the public registry
# and public bytes agree even if the runner's PDF producer differs byte-for-byte.
path = root/'publications/PUBLICATION_REGISTRY.yml'
lines = path.read_text(encoding='utf-8').splitlines()
current_doc = current_lang = None
in_sha = False
for i, line in enumerate(lines):
    m = re.match(r'\s*- number: "(\d+)"', line)
    if m:
        current_doc = m.group(1)
        current_lang = None
        in_sha = False
        continue
    m = re.match(r'\s*- language: (en|ua)\s*$', line)
    if m and current_doc in {'007','008'}:
        current_lang = m.group(1)
        in_sha = False
        continue
    if current_doc in {'007','008'} and current_lang and re.match(r'\s*sha256:\s*$', line):
        in_sha = True
        continue
    if in_sha and re.match(r'\s*pdf:\s*', line):
        indent = line[:len(line)-len(line.lstrip())]
        lines[i] = f"{indent}pdf: {sha(items[(current_doc,current_lang)])}"
        in_sha = False
path.write_text("\n".join(lines)+"\n", encoding='utf-8')

print(json.dumps(receipt, ensure_ascii=False, indent=2))
PY

echo "ARTICLE_PDF_BUILD=PASS documents=007,008 editions=EN,UA typography=IBM_PLEX pages=3_each"
