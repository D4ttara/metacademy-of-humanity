#!/usr/bin/env bash
set -euo pipefail
python3 - <<'PY'
from pathlib import Path
import re
base=Path('documents/014-right-to-see-the-consequence')
for lang,upper in [('en','EN'),('ua','UA')]:
    parts=[base/'source_parts'/f'{lang}_{i:02d}.part' for i in range(1,7)]
    missing=[str(p) for p in parts if not p.exists()]
    if missing: raise SystemExit(f'missing source parts: {missing}')
    chunks=[p.read_text(encoding='utf-8').rstrip('\n') for p in parts]
    text='\n\n'.join(chunks)+'\n'
    out=base/f'METACADEMY_DOCUMENT_014_RIGHT_TO_SEE_THE_CONSEQUENCE_{upper}_v1.0.md'
    out.write_text(text,encoding='utf-8')
    if 'document: "014"' not in text or 'date: 2026-08-24' not in text:
        raise SystemExit(f'metadata QA failed: {lang}')
    body=re.sub(r'^---\n.*?\n---\n','',text,count=1,flags=re.S)
    if re.search(r'^\s*(?:[-*+]\s|\d+[.)]\s)',body,re.M):
        raise SystemExit(f'forbidden Markdown list marker: {lang}')
    paras=[]
    for block in re.split(r'\n\s*\n',body):
        s=block.strip()
        if not s or s.startswith('#') or s.startswith('© 2026'):
            continue
        plain=re.sub(r'\[([^]]+)\]\([^)]+\)',r'\1',s)
        plain=re.sub(r'[*_`]','',plain)
        paras.append(plain)
    for a,b in zip(paras,paras[1:]):
        if len(a)<220 and len(b)<220:
            raise SystemExit(f'pseudo-list rhythm guard failed: two short prose paragraphs in {lang}: {a[:70]!r} / {b[:70]!r}')
    print(f'DOCUMENT_014_SOURCE_ASSEMBLY=PASS lang={lang} chars={len(text)} list_markers=ZERO pseudo_list_guard=PASS')
PY
