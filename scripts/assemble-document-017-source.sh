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

# v1.1 is preserved from the exact Drive master as eight small Base64 fragments.
# These are byte-safe transport witnesses, not editable literary sources. Every
# fragment is verified before the bzip2 stream is reconstructed, and the decoded
# Markdown must match the exact Drive master: 81,562 bytes and the canonical SHA.
V11_DIR="$DOC/source_parts_v1_1"
V11_OUT="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.1.md"
V11_EXPECTED="134955a3ec990efd31c307602007fd1a83233722f54ef039992360c90f851be7"
python3 - "$V11_DIR" "$V11_OUT" "$V11_EXPECTED" <<'PY'
from pathlib import Path
import base64,bz2,hashlib,sys
root=Path(sys.argv[1]); out=Path(sys.argv[2]); expected=sys.argv[3]
parts=[
    ('drive-master-v1.1.p01.b64','c4e2c51b6557917f8d822228cb2c3152f9bec0db413f11281858453408f736a9',3000),
    ('drive-master-v1.1.p02.b64','c0630b92f36acc2e615165cf275bdf65de95c1f53b4b562c634ae04dd134d570',3000),
    ('drive-master-v1.1.p03.b64','e695c4f89425c6029e139ba9f17d18834aaab1037dc2609e8803010dbb8fb697',3000),
    ('drive-master-v1.1.p04.b64','07488347db7a77034e1f796cd68c06e649a1da696e53d5b3f1ab0adcf49895a4',3000),
    ('drive-master-v1.1.p05.b64','183737ff94e493a80c3efc03ae97ecc82915c09e2d309983b2f916a665e19348',3000),
    ('drive-master-v1.1.p06.b64','ec150c40ddbdcbda5669d96885cf6b07fcb40b1eec18f318557fc0ec32cea4f0',3000),
    ('drive-master-v1.1.p07.b64','f3b30b0a58fcf1831389a3ea1062519474dbaec45f7d19873b4ae312f954cdf0',3000),
    ('drive-master-v1.1.p08.b64','eb1b7ad588296d6a167913c0c4d3738b4be30cd0b52479c59c227957bae36052',1904),
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
print(f'DOCUMENT_017_V1_1_ASSEMBLY=PASS drive_id=1I-pk-dB3ZDVbi7fGbvwwpPTuYqauMZ05 bytes={len(body)} sha256={actual} transport_parts=8')
PY
