#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path
import re

root = Path('.')
legal_url = 'https://d4ttara.github.io/metacademy-of-humanity/legal/'
label = 'Legal / Impressum status / Privacy'
changed = 0
footers = 0
for path in root.rglob('*.html'):
    if any(part in {'.git', 'node_modules'} for part in path.parts):
        continue
    text = path.read_text(encoding='utf-8')
    if '<footer' not in text:
        continue
    footers += 1
    if legal_url in text:
        continue
    link = f' · <a href="{legal_url}" rel="nofollow">{label}</a>'
    new, n = re.subn(r'(</div>\s*</footer>)', link + r'\1', text, count=1, flags=re.I)
    if n != 1:
        raise SystemExit(f'Could not inject legal footer link into {path}')
    path.write_text(new, encoding='utf-8')
    changed += 1
print(f'LEGAL_FOOTER_INJECT=PASS footers={footers} changed={changed} url={legal_url}')
PY
