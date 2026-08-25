#!/usr/bin/env bash
set -euo pipefail
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
for lang in en ua; do
  upper="${lang^^}"; html="documents/016-right-to-a-first-chance/$lang/index.html"; md="documents/016-right-to-a-first-chance/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_${upper}_v1.0.md"; fragment="$TMP/$lang.html"
  pandoc "$md" --from=markdown+yaml_metadata_block+autolink_bare_uris --to=html5 --wrap=none --output="$fragment"
  python3 - "$html" "$fragment" <<'PY'
from pathlib import Path
import re,sys
hp,fp=map(Path,sys.argv[1:]); h=hp.read_text(encoding='utf-8'); f=fp.read_text(encoding='utf-8').strip(); pat=re.compile(r'(<article id="read-online"[^>]*data-markdown-render="true"[^>]*>).*?</article>',re.S); ms=pat.findall(h)
if len(ms)!=1: raise SystemExit('canonical reader count error')
o=ms[0]; o=o if 'data-static-render="true"' in o else o[:-1]+' data-static-render="true">'; h=pat.sub(o+f+'</article>',h,count=1)
if 'Loading canonical Markdown' in h or 'Завантаження canonical Markdown' in h: raise SystemExit('render placeholder leak')
if '<ul' in h or '<ol' in h: raise SystemExit('forbidden list markup in Document 016')
hp.write_text(h,encoding='utf-8')
PY
  echo "STATIC_ARTICLE_RENDER=PASS doc=016 lang=$lang lists=ZERO"
done
