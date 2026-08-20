#!/usr/bin/env bash
set -euo pipefail
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
for lang in en ua; do
  upper="${lang^^}"; html="documents/013-room-that-answers/$lang/index.html"; md="documents/013-room-that-answers/METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_${upper}_v1.0.md"; filtered="$TMP/$lang.md"; fragment="$TMP/$lang.html"
  python3 - "$md" "$filtered" <<'PY'
from pathlib import Path
import re,sys
s,d=map(Path,sys.argv[1:]); t=s.read_text(encoding='utf-8'); t=re.sub(r'\n?<!-- FILE_ONLY_SUPPORT_START -->.*?<!-- FILE_ONLY_SUPPORT_END -->\n?','\n',t,flags=re.S); d.write_text(t,encoding='utf-8')
PY
  pandoc "$filtered" --from=markdown+yaml_metadata_block+autolink_bare_uris --to=html5 --wrap=none --output="$fragment"
  python3 - "$html" "$fragment" <<'PY'
from pathlib import Path
from html.parser import HTMLParser
import re,sys
hp,fp=map(Path,sys.argv[1:]); h=hp.read_text(encoding='utf-8'); f=fp.read_text(encoding='utf-8').strip(); pat=re.compile(r'(<article id="read-online"[^>]*data-markdown-render="true"[^>]*>).*?</article>',re.S); ms=pat.findall(h)
if len(ms)!=1: raise SystemExit('canonical reader count error')
o=ms[0]; o=o if 'data-static-render="true"' in o else o[:-1]+' data-static-render="true">'; h=pat.sub(o+f+'</article>',h,count=1)
if 'Loading canonical Markdown' in h or 'Завантаження canonical Markdown' in h or 'FILE_ONLY_SUPPORT' in h: raise SystemExit('render leak/placeholder')
hp.write_text(h,encoding='utf-8')
PY
  echo "STATIC_ARTICLE_RENDER=PASS doc=013 lang=$lang"
done
