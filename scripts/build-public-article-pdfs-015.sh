#!/usr/bin/env bash
set -euo pipefail
export SOURCE_DATE_EPOCH=1787616000
export TZ=UTC
TEMPLATE="scripts/moh_article_template_support_014.tex"
TMP_BUILD="$(mktemp -d)"; trap 'rm -rf "$TMP_BUILD"' EXIT
for lang in en ua; do
  upper="${lang^^}"
  md="documents/015-polytypic-thinking/METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_${upper}_v1.0.md"
  pdf="${md%.md}.pdf"
  tmpmd="$TMP_BUILD/015_${lang}.md"
  python3 - "$md" "$tmpmd" <<'PY'
from pathlib import Path
import re,sys
src,dst=map(Path,sys.argv[1:3])
t=src.read_text(encoding='utf-8').replace('\u0226','A\u0307')
t=re.sub(r'\n# [^\n]+\n\n## [^\n]+\n','\n',t,count=1)
t=re.sub(r'\n© 2026 Ievgen Karogod / Dattara · MET\[Ȧ\]CADEMY OF HUMANITY \(MoH\)\s*$', '\n', t)
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
  pages="$(pdfinfo "$pdf"|awk '/^Pages:/ {print $2}')"; (( pages >= 9 && pages <= 15 )) || { echo "Unexpected page count $pages"; exit 1; }
  pdftotext "$pdf" - | grep -qi "SUPPORT THE FIELD" || exit 1
  pdffonts "$pdf" | grep -q IBMPlexSans || exit 1
  pdffonts "$pdf" | grep -q IBMPlexMono || exit 1
  pdfinfo -url "$pdf" | grep -q 'send.monobank.ua/jar/2TMaAhchSZ' || exit 1
  pdfinfo -url "$pdf" | grep -q 'paypal.me/4IevgenKarogod' || exit 1
  echo "PDF_PREFLIGHT=PASS doc=015 lang=$lang pages=$pages typography=IBM_PLEX support=PASS links=PASS"
done
python3 - <<'PY'
from pathlib import Path
import hashlib,json,re,subprocess
root=Path('.'); d=root/'documents/015-polytypic-thinking'
pairs={'en':(d/'METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_EN_v1.0.md',d/'METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_EN_v1.0.pdf'),'ua':(d/'METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_UA_v1.0.md',d/'METACADEMY_DOCUMENT_015_POLYTYPIC_THINKING_UA_v1.0.pdf')}
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def pages(p):
 o=subprocess.check_output(['pdfinfo',str(p)],text=True); return int(next(x.split(':',1)[1] for x in o.splitlines() if x.startswith('Pages:')))
r={'schema':'metacademy-publication-build-receipt/v1','date':'2026-08-25','version':'v1.0','documents':{'015':{k:{'markdown_sha256':sha(v[0]),'pdf_sha256':sha(v[1]),'page_count':pages(v[1]),'typography':'IBM Plex Sans + IBM Plex Mono','paper':'A4','support_page':True,'discussion':'https://github.com/D4ttara/metacademy-of-humanity/issues/58'} for k,v in pairs.items()}}}
(root/'publications/PUBLICATION_BUILD_RECEIPT_015_v1.0.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
p=root/'publications/PUBLICATION_REGISTRY.yml'; lines=p.read_text().splitlines(); doc=lang=None; insha=False
for i,line in enumerate(lines):
 m=re.match(r'\s*- number: "(\d+)"',line)
 if m: doc=m.group(1); lang=None; insha=False; continue
 m=re.match(r'\s*- language: (en|ua)\s*$',line)
 if m and doc=='015': lang=m.group(1); insha=False; continue
 if doc=='015' and lang and re.match(r'\s*sha256:\s*$',line): insha=True; continue
 if insha and re.match(r'\s*markdown:',line):
  indent=line[:len(line)-len(line.lstrip())]; lines[i]=f'{indent}markdown: {sha(pairs[lang][0])}'
 if insha and re.match(r'\s*pdf:',line):
  indent=line[:len(line)-len(line.lstrip())]; lines[i]=f'{indent}pdf: {sha(pairs[lang][1])}'; insha=False
p.write_text('\n'.join(lines)+'\n')
PY
echo "ARTICLE_PDF_BUILD=PASS document=015 editions=EN,UA"
