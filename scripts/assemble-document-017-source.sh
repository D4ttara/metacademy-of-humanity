#!/usr/bin/env bash
set -euo pipefail
DOC="documents/017-human-ai-what-or-we"
OUT="$DOC/METACADEMY_DOCUMENT_017_HUMAN_AI_WHAT_OR_WE_UA_v1.0.md"
EXPECTED="b4fcdd99d5ba3a25bc3e5b94ea8273311ad3dcafd39e96ee6d50d1c903a99fb4"
python3 - "$DOC/source_parts/manifest-01.md.part" "$DOC/source_parts/manifest-02.md.part" "$DOC/source_parts/manifest-03.md.part" "$OUT" "$EXPECTED" <<'PY'
from pathlib import Path
import hashlib,sys
p1,p2,p3,out,expected=sys.argv[1:]
parts=[Path(p).read_bytes() for p in (p1,p2,p3)]
seps=[b'',b'\n',b'\n\n']
ends=[b'',b'\n']
for s1 in seps:
  for s2 in seps:
    for end in ends:
      body=parts[0]+s1+parts[1]+s2+parts[2]+end
      if hashlib.sha256(body).hexdigest()==expected:
        Path(out).write_bytes(body)
        print(f'DOCUMENT_017_ASSEMBLY=PASS sha256={expected} sep1={len(s1)} sep2={len(s2)} final_newline={len(end)}')
        raise SystemExit(0)
raise SystemExit('DOCUMENT_017_ASSEMBLY=FAIL canonical SHA-256 could not be reconstructed from source parts')
PY
