#!/usr/bin/env bash
set -euo pipefail
export SOURCE_DATE_EPOCH=1789063200
export TZ=UTC
DOC="documents/017-human-ai-what-or-we"
MD="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0.md"
PDF="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.pdf"
EPUB="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.epub"
DOCX="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0_PUBLIC.docx"
RECEIPT="publications/PUBLICATION_BUILD_RECEIPT_017_v1.0.json"
EXPECTED_MD="b4fcdd99d5ba3a25bc3e5b94ea8273311ad3dcafd39e96ee6d50d1c903a99fb4"
ARCHIVE_PDF_SHA="6e9737a54d954ddca75497570bc74121e4dc7cadeef6b0efe1e7092a19fc32a7"
actual_md="$(sha256sum "$MD" | awk '{print $1}')"
[[ "$actual_md" == "$EXPECTED_MD" ]] || { echo "DOCUMENT_017_SOURCE_HASH=FAIL expected=$EXPECTED_MD actual=$actual_md"; exit 1; }
pandoc "$MD" --from=markdown+raw_html+smart --pdf-engine=xelatex -V mainfont="IBM Plex Sans" -V monofont="IBM Plex Mono" -V geometry:margin=22mm -V fontsize=11pt --metadata title="Людина і ШІ: що чи ми?" --metadata subtitle="Маніфест співіснування та есе «Спільний світ починається з розетки»" --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$PDF"
pandoc "$MD" --from=markdown+raw_html+smart --metadata title="Людина і ШІ: що чи ми?" --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$EPUB"
pandoc "$MD" --from=markdown+raw_html+smart --metadata title="Людина і ШІ: що чи ми?" --metadata author="Ievgen Karogod / Dattara" --metadata lang="uk-UA" -o "$DOCX"
test -s "$PDF" && test -s "$EPUB" && test -s "$DOCX"
pdftotext "$PDF" - | grep -Fqi "ЛЮДИНА І ШІ" || { echo "DOCUMENT_017_PDF_TEXT=FAIL"; exit 1; }
pdffonts "$PDF" | grep -q "IBMPlexSans" || { echo "DOCUMENT_017_PDF_FONT=FAIL"; exit 1; }
pdf_sha="$(sha256sum "$PDF" | awk '{print $1}')"
epub_sha="$(sha256sum "$EPUB" | awk '{print $1}')"
docx_sha="$(sha256sum "$DOCX" | awk '{print $1}')"
pages="$(pdfinfo "$PDF" | awk '/^Pages:/ {print $2}')"
python3 - "$RECEIPT" "$EXPECTED_MD" "$pdf_sha" "$epub_sha" "$docx_sha" "$pages" "$ARCHIVE_PDF_SHA" <<'PY'
from pathlib import Path
import json,sys
p,md,pdf,epub,docx,pages,archive=sys.argv[1:]
obj={
  "schema":"metacademy-publication-build-receipt/v1",
  "document":"017",
  "version":"v1.0",
  "language":"ua",
  "source_markdown_sha256":md,
  "public_build":{
    "pdf_sha256":pdf,
    "epub_sha256":epub,
    "docx_sha256":docx,
    "pdf_pages":int(pages),
    "typography":"IBM Plex Sans + IBM Plex Mono"
  },
  "archive_master":{
    "pdf_sha256":archive,
    "relation":"Drive archival master; not byte-identical to generated public PDF"
  }
}
Path(p).write_text(json.dumps(obj,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
PY
echo "DOCUMENT_017_PUBLIC_FORMATS=PASS md=$EXPECTED_MD pdf=$pdf_sha epub=$epub_sha docx=$docx_sha pages=$pages archive_master_pdf=$ARCHIVE_PDF_SHA"
