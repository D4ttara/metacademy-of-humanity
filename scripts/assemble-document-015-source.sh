#!/usr/bin/env bash
set -euo pipefail
DOC="documents/015-polytypic-thinking"
mkdir -p "$DOC"
cat "$DOC/source_parts/en_01.part" "$DOC/source_parts/en_02.part" "$DOC/source_parts/en_03.part" "$DOC/source_parts/en_04.part" > "$DOC/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_EN_v1.0.md"
cat "$DOC/source_parts/ua_01.part" "$DOC/source_parts/ua_02.part" "$DOC/source_parts/ua_03.part" "$DOC/source_parts/ua_04.part" > "$DOC/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_UA_v1.0.md"
python3 - <<'PY'
from pathlib import Path
p=Path('documents/015-polytypic-thinking/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_UA_v1.0.md')
s=p.read_text(encoding='utf-8')
s=s.replace('date: 2026-08-24','date: 2026-08-25',1)
s=s.replace('Абсурд тут стає корисним антистереотипічним тестом. Не тому, що все дивне істинне. А тому, що дивне змушує систему показати, **де саме вона проводить межу можливого**.','Неможливе на перший погляд тут стає корисним антистереотипічним тестом. Не тому, що все дивне істинне. А тому, що дивне змушує систему показати, **де саме вона проводить межу можливого**.')
p.write_text(s,encoding='utf-8')
for lang in ('EN','UA'):
 q=Path(f'documents/015-polytypic-thinking/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_{lang}_v1.0.md')
 t=q.read_text(encoding='utf-8')
 if t.count('---') < 2: raise SystemExit(f'front matter missing {lang}')
 if '\n- ' in t or '\n* ' in t or '\n1. ' in t: raise SystemExit(f'list marker found {lang}')
 if 'type is a projection, not an essence' not in t.lower() and 'тип є проєкцією, а не сутністю' not in t.lower(): raise SystemExit(f'core thesis missing {lang}')
print('DOCUMENT_015_SOURCE_ASSEMBLY=PASS editions=EN_UA lists=ZERO')
PY
