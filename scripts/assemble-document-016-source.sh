#!/usr/bin/env bash
set -euo pipefail
DOC="documents/016-right-to-a-first-chance"
mkdir -p "$DOC"
cat "$DOC/source_parts/en_01.part" "$DOC/source_parts/en_02.part" "$DOC/source_parts/en_03.part" > "$DOC/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_EN_v1.0.md"
cat "$DOC/source_parts/ua_01.part" "$DOC/source_parts/ua_02.part" "$DOC/source_parts/ua_03.part" > "$DOC/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_UA_v1.0.md"
python3 - <<'PY'
from pathlib import Path
import re
D=Path('documents/016-right-to-a-first-chance')
for lang in ('EN','UA'):
 p=D/f'METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_{lang}_v1.0.md'
 s=p.read_text(encoding='utf-8')
 if s.count('---') < 2: raise SystemExit(f'front matter missing {lang}')
 if re.search(r'(?m)^(?:[-*]\s+|\d+\.\s+)',s): raise SystemExit(f'forbidden list marker {lang}')
 if lang=='UA':
  for token in ['Заслуга людини не дорівнює попередньому доступу до системи','не всяка цифровізація є людинизацією','А може, замість однієї лише людинизації нам іноді потрібна людинація?','у майбутнього немає попереднього досвіду бути майбутнім']:
   if token not in s: raise SystemExit(f'UA anchor missing: {token}')
 else:
  for token in ["A person’s merit is not the same thing as previous access to a system",'Not every digital transformation is humanisation','humanation','the future has no previous experience of being the future']:
   if token not in s: raise SystemExit(f'EN anchor missing: {token}')
print('DOCUMENT_016_ASSEMBLY=PASS editions=EN,UA lists=ZERO relational_anchors=PASS')
PY