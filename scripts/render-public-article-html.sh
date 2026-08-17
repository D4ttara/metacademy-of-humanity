#!/usr/bin/env bash
set -euo pipefail

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

items=(
  "documents/007-after-vibe-coding/en/index.html|documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.md"
  "documents/007-after-vibe-coding/ua/index.html|documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.md"
  "documents/008-the-interface-that-knows-you/en/index.html|documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.md"
  "documents/008-the-interface-that-knows-you/ua/index.html|documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.md"
)

for item in "${items[@]}"; do
  IFS='|' read -r html md <<<"$item"
  fragment="$TMP_DIR/$(basename "$(dirname "$html")")-$(basename "$(dirname "$(dirname "$html")")").html"
  pandoc "$md" --from=markdown+yaml_metadata_block --to=html5 --wrap=none --output="$fragment"
  python3 - "$html" "$fragment" <<'PY'
from pathlib import Path
import re, sys
html_path, fragment_path = map(Path, sys.argv[1:])
html = html_path.read_text(encoding='utf-8')
fragment = fragment_path.read_text(encoding='utf-8').strip()
pattern = re.compile(r'(<article id="read-online"[^>]*data-markdown-render="true"[^>]*>).*?</article>', re.S)
matches = pattern.findall(html)
if len(matches) != 1:
    raise SystemExit(f"Expected exactly one canonical reader in {html_path}, found {len(matches)}")
opening = matches[0]
if 'data-static-render="true"' not in opening:
    opening = opening[:-1] + ' data-static-render="true">'
rendered = pattern.sub(opening + fragment + '</article>', html, count=1)
if 'Loading canonical Markdown' in rendered or 'Завантаження canonical Markdown' in rendered:
    raise SystemExit(f"Static article render placeholder survived in {html_path}")
html_path.write_text(rendered, encoding='utf-8')
PY
  echo "STATIC_ARTICLE_RENDER=PASS html=$html md=$md"
done
