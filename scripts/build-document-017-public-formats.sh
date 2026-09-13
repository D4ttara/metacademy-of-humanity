#!/usr/bin/env bash
set -euo pipefail
DOC="documents/017-human-ai-what-or-we"
V10="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0.md"
V11="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.1.md"
HTML="$DOC/ua/index.html"
EXPECTED_V10="b4fcdd99d5ba3a25bc3e5b94ea8273311ad3dcafd39e96ee6d50d1c903a99fb4"
EXPECTED_V11="134955a3ec990efd31c307602007fd1a83233722f54ef039992360c90f851be7"

actual_v10="$(sha256sum "$V10" | awk '{print $1}')"
actual_v11="$(sha256sum "$V11" | awk '{print $1}')"
[[ "$actual_v10" == "$EXPECTED_V10" ]] || { echo "DOCUMENT_017_V10_PROVENANCE_HASH=FAIL expected=$EXPECTED_V10 actual=$actual_v10"; exit 1; }
[[ "$actual_v11" == "$EXPECTED_V11" ]] || { echo "DOCUMENT_017_V11_DRIVE_HASH=FAIL expected=$EXPECTED_V11 actual=$actual_v11"; exit 1; }

grep -Fq 'METACADEMY-DOC-017-UA-v1.1' "$HTML" || { echo 'DOCUMENT_017_HTML_VERSION=FAIL'; exit 1; }
grep -Fq 'METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.1.md' "$HTML" || { echo 'DOCUMENT_017_HTML_MD_LINK=FAIL'; exit 1; }
if grep -Eq 'UA_v1\.0_PUBLIC\.(pdf|epub|docx)' "$HTML"; then
  echo 'DOCUMENT_017_HTML_OLD_FORMAT_LINK=FAIL'
  exit 1
fi

# Author publication decision (2026-09-11): current reader edition v1.1 is HTML + Markdown only.
# Earlier PDF/EPUB files remain historical editions and must not be regenerated or relabeled as v1.1.
echo "DOCUMENT_017_PUBLIC_FORMATS=PASS current=v1.1 formats=HTML,MD pdf=SKIPPED_BY_AUTHOR epub=SKIPPED_BY_AUTHOR historical_v1.0_sha=$EXPECTED_V10 drive_v1.1_sha=$EXPECTED_V11"
