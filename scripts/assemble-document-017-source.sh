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

# v1.1 is preserved from the exact Drive master as three transport-safe Base64
# fragments. The fragments are not literary/editable sources; they are a byte-safe
# transport witness. We verify every fragment, reconstruct the bzip2 stream, then
# verify the exact 81,562-byte Markdown master before exposing it to publication.
V11_DIR="$DOC/source_parts_v1_1"
V11_OUT="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.1.md"
V11_EXPECTED="134955a3ec990efd31c307602007fd1a83233722f54ef039992360c90f851be7"
python3 - "$V11_DIR" "$V11_OUT" "$V11_EXPECTED" <<'PY'
from pathlib import Path
import base64,bz2,hashlib,sys
root=Path(sys.argv[1]); out=Path(sys.argv[2]); expected=sys.argv[3]
parts=[
    ('drive-master-v1.1.part01.b64','3edbd7c94846bd1eee6ab409a368dfea78fc49e3cde7e6de279510b5d0280692',8000),
    ('drive-master-v1.1.part02.b64','fcc21d175be2ae1b5b6bc6ebc44b52157697370e7e7a15dac9a9411337f3ec9d',8000),
    ('drive-master-v1.1.part03.b64','82d3100b276adb92aae9a197ed711cdb0a347b804746ae8e7197cc8743d60a4c',6904),
]
encoded=[]
for name,want,n in parts:
    b=(root/name).read_bytes()
    got=hashlib.sha256(b).hexdigest()
    if len(b)!=n or got!=want:
        raise SystemExit(f'DOCUMENT_017_V1_1_ASSEMBLY=FAIL part={name} bytes={len(b)} sha256={got} expected_bytes={n} expected_sha256={want}')
    encoded.append(b)
try:
    compressed=base64.b64decode(b''.join(encoded),validate=True)
    body=bz2.decompress(compressed)
except Exception as e:
    raise SystemExit(f'DOCUMENT_017_V1_1_ASSEMBLY=FAIL transport_decode={type(e).__name__}:{e}')
actual=hashlib.sha256(body).hexdigest()
if len(body)!=81562 or actual!=expected:
    raise SystemExit(f'DOCUMENT_017_V1_1_ASSEMBLY=FAIL master bytes={len(body)} sha256={actual} expected_bytes=81562 expected_sha256={expected}')
body.decode('utf-8')
out.write_bytes(body)
print(f'DOCUMENT_017_V1_1_ASSEMBLY=PASS drive_id=1I-pk-dB3ZDVbi7fGbvwwpPTuYqauMZ05 bytes={len(body)} sha256={actual} transport_parts=3')
PY
