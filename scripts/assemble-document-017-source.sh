#!/usr/bin/env bash
set -euo pipefail
DOC="documents/017-human-ai-what-or-we"
OUT="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0.md"
EXPECTED="b4fcdd99d5ba3a25bc3e5b94ea8273311ad3dcafd39e96ee6d50d1c903a99fb4"
python3 - "$DOC/source_parts/manifest-01.md.part" "$DOC/source_parts/manifest-02.md.part" "$DOC/source_parts/manifest-03.md.part" "$OUT" "$EXPECTED" <<'PY'
from pathlib import Path
import hashlib,sys
p1,p2,p3,out,expected=sys.argv[1:]
a=Path(p1).read_bytes(); b=Path(p2).read_bytes(); c=Path(p3).read_bytes()
# Provenance-preserving repair: the historical split artifact manifest-02 omits
# exactly two Cyrillic characters in one phrase versus the Drive canonical master:
#   "Чи зрозіло, за що він платить?" -> "Чи зрозуміло, за що він платить?"
# The original .part is intentionally not rewritten. The canonical assembly applies
# this one known repair in memory and verifies the full byte hash afterwards.
needle='Чи зрозіло, за що він платить?'.encode('utf-8')
replacement='Чи зрозуміло, за що він платить?'.encode('utf-8')
if b.count(needle) != 1:
    raise SystemExit(f'DOCUMENT_017_ASSEMBLY=FAIL expected exactly one historical repair site, found {b.count(needle)}')
b=b.replace(needle,replacement,1)
# manifest-01 ends with the first newline of a paragraph break; manifest-02 begins
# directly with the next paragraph and already carries the two trailing newlines
# before manifest-03. Exactly one LF is therefore restored between part 01 and 02.
body=a+b'\n'+b+c
actual=hashlib.sha256(body).hexdigest()
if actual != expected:
    raise SystemExit(f'DOCUMENT_017_ASSEMBLY=FAIL canonical SHA-256 mismatch expected={expected} actual={actual}')
Path(out).write_bytes(body)
print(f'DOCUMENT_017_ASSEMBLY=PASS sha256={expected} provenance_repair=one_known_omission restored_chars=ум separator=LF')
PY
