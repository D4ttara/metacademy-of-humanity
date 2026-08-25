#!/usr/bin/env bash
set -euo pipefail
export SOURCE_DATE_EPOCH=1787616000
export TZ=UTC
DOC="documents/016-right-to-a-first-chance"
TEMPLATE="scripts/moh_article_template_support_016.tex"
TMP_BUILD="$(mktemp -d)"; trap 'rm -rf "$TMP_BUILD"' EXIT
for lang in en ua; do
  upper="${lang^^}"
  md="$DOC/METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_${upper}_v1.0.md"
  pdf="${md%.md}.pdf"
  tmpmd="$TMP_BUILD/016_${lang}.md"
  python3 - "$md" "$tmpmd" <<'PY'
from pathlib import Path
import re,sys
src,dst=map(Path,sys.argv[1:3])
t=src.read_text(encoding='utf-8').replace('\u0226','A\u0307')
t=re.sub(r'\n# [^\n]+\n\n## [^\n]+\n','\n',t,count=1)
t=re.sub(r'\n© 2026 Ievgen Karogod / Dattara · MET\[Ȧ\]CADEMY OF HUMANITY \(MoH\)\s*$','\n',t)
dst.write_text(t,encoding='utf-8')
PY
  if [[ "$lang" == "ua" ]]; then
    standfirst='Коли підтримка приходить тільки після доказу, що ти вже здатен вижити без неї, система може плутати розвиток потенціалу з винагородою за попередній доступ.'
    coverquestion='Якою має бути система, щоб вона сама заслуговувала на право вирішувати, кому дати перший шанс?'
  else
    standfirst='When support arrives only after proof that you can already survive without it, a system may confuse developing potential with rewarding prior access.'
    coverquestion='What kind of system would itself deserve the right to decide who gets a first chance?'
  fi
  pandoc "$tmpmd" --from=markdown+yaml_metadata_block+autolink_bare_uris --pdf-engine=xelatex --template="$TEMPLATE" -V "standfirst=$standfirst" -V "coverquestion=$coverquestion" --output="$pdf"
  pages="$(pdfinfo "$pdf"|awk '/^Pages:/ {print $2}')"; (( pages >= 7 && pages <= 12 )) || { echo "Unexpected page count $pages"; exit 1; }
  pdftotext "$pdf" - | grep -qi "SUPPORT THE RESEARCH" || exit 1
  pdftotext "$pdf" - | grep -qi "THE MET" || exit 1
  pdffonts "$pdf" | grep -q IBMPlexSans || exit 1
  pdffonts "$pdf" | grep -q IBMPlexMono || exit 1
  pdfinfo -url "$pdf" | grep -q 'send.monobank.ua/jar/2TMaAhchSZ' || exit 1
  pdfinfo -url "$pdf" | grep -q 'paypal.me/4IevgenKarogod' || exit 1
  echo "PDF_PREFLIGHT=PASS doc=016 lang=$lang pages=$pages typography=IBM_PLEX newspaper_cover=PASS support=PASS links=PASS"
done
python3 - <<'PY'
from pathlib import Path
import hashlib,json,re,subprocess
root=Path('.'); d=root/'documents/016-right-to-a-first-chance'
pairs={'en':(d/'METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_EN_v1.0.md',d/'METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_EN_v1.0.pdf'),'ua':(d/'METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_UA_v1.0.md',d/'METACADEMY_DOCUMENT_016_RIGHT_TO_A_FIRST_CHANCE_UA_v1.0.pdf')}
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def pages(p):
 o=subprocess.check_output(['pdfinfo',str(p)],text=True); return int(next(x.split(':',1)[1] for x in o.splitlines() if x.startswith('Pages:')))
r={'schema':'metacademy-publication-build-receipt/v1','date':'2026-08-25','version':'v1.0','documents':{'016':{k:{'markdown_sha256':sha(v[0]),'pdf_sha256':sha(v[1]),'page_count':pages(v[1]),'typography':'IBM Plex Sans + IBM Plex Mono','paper':'A4','newspaper_cover':True,'support_page':True,'discussion':'https://github.com/D4ttara/metacademy-of-humanity/issues/59'} for k,v in pairs.items()}}}
(root/'publications/PUBLICATION_BUILD_RECEIPT_016_v1.0.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
p=root/'publications/PUBLICATION_REGISTRY.yml'; lines=p.read_text().splitlines(); doc=lang=None; insha=False
for i,line in enumerate(lines):
 m=re.match(r'\s*- number: "(\d+)"',line)
 if m: doc=m.group(1); lang=None; insha=False; continue
 m=re.match(r'\s*- language: (en|ua)\s*$',line)
 if m and doc=='016': lang=m.group(1); insha=False; continue
 if doc=='016' and lang and re.match(r'\s*sha256:\s*$',line): insha=True; continue
 if insha and re.match(r'\s*markdown:',line):
  ind=line[:len(line)-len(line.lstrip())]; lines[i]=f'{ind}markdown: {sha(pairs[lang][0])}'
 if insha and re.match(r'\s*pdf:',line):
  ind=line[:len(line)-len(line.lstrip())]; lines[i]=f'{ind}pdf: {sha(pairs[lang][1])}'; insha=False
p.write_text('\n'.join(lines)+'\n')
PY
echo "ARTICLE_PDF_BUILD=PASS document=016 editions=EN,UA"
