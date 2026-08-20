#!/usr/bin/env bash
set -euo pipefail
export SOURCE_DATE_EPOCH=1787184000
export TZ=UTC
FONT_ROOT="/usr/share/texlive/texmf-dist/fonts/opentype/ibm/plex"
for f in IBMPlexSans-Regular.otf IBMPlexSans-SemiBold.otf IBMPlexSans-Italic.otf IBMPlexSans-SemiBoldItalic.otf IBMPlexMono-Regular.otf IBMPlexMono-SemiBold.otf; do test -f "$FONT_ROOT/$f" || exit 1; done
TEMPLATE="scripts/moh_article_template_support.tex"; TMP_BUILD="$(mktemp -d)"; trap 'rm -rf "$TMP_BUILD"' EXIT
for lang in en ua; do
  upper="${lang^^}"; md="documents/013-room-that-answers/METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_${upper}_v1.0.md"; pdf="${md%.md}.pdf"; tmpmd="$TMP_BUILD/013_${lang}.md"
  python3 - "$md" "$tmpmd" <<'PY'
from pathlib import Path
import re,sys
src,dst=map(Path,sys.argv[1:]); t=src.read_text(encoding='utf-8').replace('\u0226','A\u0307').replace('\u1e63','s\u0323')
t=re.sub(r'\n# [^\n]+\n\n## [^\n]+\n','\n',t,count=1)
t=re.sub(r'\n?<!-- FILE_ONLY_SUPPORT_START -->.*?<!-- FILE_ONLY_SUPPORT_END -->\n?','\n',t,flags=re.S)
dst.write_text(t,encoding='utf-8')
PY
  pandoc "$tmpmd" --from=markdown+yaml_metadata_block --pdf-engine=xelatex --template="$TEMPLATE" --output="$pdf"
  python3 - "$pdf" <<'PY'
from pathlib import Path
import hashlib,re,sys
p=Path(sys.argv[1]); d=p.read_bytes(); pat=re.compile(rb'(/ID\s*\[\s*<)([0-9A-Fa-f]{32})(>\s*<)([0-9A-Fa-f]{32})(>\s*\])'); m=list(pat.finditer(d))
if len(m)!=1: raise SystemExit('PDF trailer ID error')
z=pat.sub(lambda x:x.group(1)+b'0'*32+x.group(3)+b'0'*32+x.group(5),d,count=1); s=hashlib.sha256(z).hexdigest()[:32].encode(); p.write_bytes(pat.sub(lambda x:x.group(1)+s+x.group(3)+s+x.group(5),d,count=1))
PY
  pages="$(pdfinfo "$pdf"|awk '/^Pages:/ {print $2}')"; (( pages >= 5 && pages <= 7 )) || exit 1
  pdftotext "$pdf" - | grep -qi "SUPPORT THE FIELD" || exit 1; pdffonts "$pdf" | grep -q IBMPlexSans || exit 1; pdffonts "$pdf" | grep -q IBMPlexMono || exit 1
  echo "PDF_PREFLIGHT=PASS doc=013 lang=$lang pages=$pages typography=IBM_PLEX support=PASS"
done
python3 - <<'PY'
from pathlib import Path
import hashlib,json,re,subprocess
root=Path('.'); d=root/'documents/013-room-that-answers'; pairs={'en':(d/'METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_EN_v1.0.md',d/'METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_EN_v1.0.pdf'),'ua':(d/'METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_UA_v1.0.md',d/'METACADEMY_DOCUMENT_013_ROOM_THAT_ANSWERS_UA_v1.0.pdf')}; sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def pages(p):
 o=subprocess.check_output(['pdfinfo',str(p)],text=True); return int(next(x.split(':',1)[1] for x in o.splitlines() if x.startswith('Pages:')))
r={'schema':'metacademy-publication-build-receipt/v1','date':'2026-08-20','version':'v1.0','documents':{'013':{k:{'markdown_sha256':sha(v[0]),'pdf_sha256':sha(v[1]),'page_count':pages(v[1]),'typography':'IBM Plex Sans + IBM Plex Mono','paper':'A4','support_page':True,'discussion':'https://github.com/D4ttara/metacademy-of-humanity/issues/37'} for k,v in pairs.items()}}}; (root/'publications/PUBLICATION_BUILD_RECEIPT_013_v1.0.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
p=root/'publications/PUBLICATION_REGISTRY.yml'; lines=p.read_text().splitlines(); doc=lang=None; insha=False
for i,line in enumerate(lines):
 m=re.match(r'\s*- number: "(\d+)"',line)
 if m: doc=m.group(1); lang=None; insha=False; continue
 m=re.match(r'\s*- language: (en|ua)\s*$',line)
 if m and doc=='013': lang=m.group(1); insha=False; continue
 if doc=='013' and lang and re.match(r'\s*sha256:\s*$',line): insha=True; continue
 if insha and re.match(r'\s*markdown:',line): indent=line[:len(line)-len(line.lstrip())]; lines[i]=f'{indent}markdown: {sha(pairs[lang][0])}'
 if insha and re.match(r'\s*pdf:',line): indent=line[:len(line)-len(line.lstrip())]; lines[i]=f'{indent}pdf: {sha(pairs[lang][1])}'; insha=False
p.write_text('\n'.join(lines)+'\n')
PY
echo "ARTICLE_PDF_BUILD=PASS document=013 editions=EN,UA"
