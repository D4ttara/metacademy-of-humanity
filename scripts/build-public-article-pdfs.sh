#!/usr/bin/env bash
set -euo pipefail

export SOURCE_DATE_EPOCH=1787097600
export TZ=UTC

FONT_ROOT="/usr/share/texlive/texmf-dist/fonts/opentype/ibm/plex"
for f in IBMPlexSans-Regular.otf IBMPlexSans-SemiBold.otf IBMPlexSans-Italic.otf IBMPlexSans-SemiBoldItalic.otf IBMPlexMono-Regular.otf IBMPlexMono-SemiBold.otf; do
  test -f "$FONT_ROOT/$f" || { echo "Missing required IBM Plex font: $FONT_ROOT/$f" >&2; exit 1; }
done

TEMPLATE="scripts/moh_article_template.tex"
TMP_BUILD="$(mktemp -d)"
trap 'rm -rf "$TMP_BUILD"' EXIT

# The support page is file-only furniture. The online article remains clean.
for qr in monobank paypal usdt-trc20; do
  rsvg-convert -f pdf -o "$TMP_BUILD/qr-${qr}.pdf" "assets/img/qr-${qr}.svg"
done

append_support_page() {
  local lang="$1" target="$2"
  local title lede boundary warning
  if [[ "$lang" == "ua" ]]; then
    title="ПІДТРИМАТИ ПОЛЕ"
    lede="Незалежні дослідження, книги, переклади й відкриті матеріали продовжуються завдяки добровільній підтримці."
    boundary="Добровільна підтримка не створює прав власності, інвестиційних, членських або управлінських прав і не представляє MoH як зареєстровану благодійну організацію."
    warning="Тільки USDT у мережі TRON / TRC20. Перед відправленням перевірте asset і network."
  else
    title="SUPPORT THE FIELD"
    lede="Independent research, books, translations and public materials continue through voluntary support."
    boundary="Voluntary support creates no ownership, investment, membership or governance rights and does not present MoH as a registered charity."
    warning="USDT on the TRON / TRC20 network only. Verify asset and network before sending."
  fi
  cat >>"$target" <<TEX

\\clearpage
\\thispagestyle{fancy}
\\noindent\\mohplaque\\hfill\\begin{minipage}[c]{0.70\\linewidth}\\raggedleft\\fontsize{8}{10}\\selectfont\\color{MoHMuted}MET[Ȧ]CADEMY OF HUMANITY\\\\[-1pt]\\mohsign\\end{minipage}\\par
\\vspace{12mm}
{\\fontsize{25}{28}\\selectfont\\bfseries\\color{MoHInk}${title}\\par}
\\vspace{3mm}
{\\fontsize{11.5}{15}\\selectfont\\color{MoHMuted}${lede}\\par}
\\vspace{7mm}
{\\color{MoHBlue}\\rule{\\linewidth}{1.2pt}}\\par
\\vspace{7mm}
\\noindent
\\begin{minipage}[t]{0.30\\linewidth}
\\raggedright
{\\large\\bfseries Monobank\\par}\\vspace{3mm}
\\includegraphics[width=31mm]{${TMP_BUILD}/qr-monobank.pdf}\\par\\vspace{3mm}
\\href{https://send.monobank.ua/jar/2TMaAhchSZ}{send.monobank.ua/jar/2TMaAhchSZ}\\par\\vspace{2mm}
{\\footnotesize Card / Картка: 4874 1000 3202 1324\\par IBAN: UA693220010000026200383215867\\par}
\\end{minipage}\\hfill
\\begin{minipage}[t]{0.30\\linewidth}
\\raggedright
{\\large\\bfseries PayPal\\par}\\vspace{3mm}
\\includegraphics[width=31mm]{${TMP_BUILD}/qr-paypal.pdf}\\par\\vspace{3mm}
\\href{https://www.paypal.me/4IevgenKarogod}{paypal.me/4IevgenKarogod}\\par
\\end{minipage}\\hfill
\\begin{minipage}[t]{0.30\\linewidth}
\\raggedright
{\\large\\bfseries USDT · TRC20\\par}\\vspace{3mm}
\\includegraphics[width=31mm]{${TMP_BUILD}/qr-usdt-trc20.pdf}\\par\\vspace{3mm}
{\\footnotesize\\ttfamily TDaCBB3T94CtMPRHN9pP8Uvdy8CTtWE5SV\\par}\\vspace{2mm}
{\\footnotesize ${warning}\\par}
\\end{minipage}
\\vfill
{\\color{MoHLine}\\rule{\\linewidth}{0.5pt}}\\par\\vspace{3mm}
{\\footnotesize\\color{MoHMuted}${boundary}\\par}\\vspace{3mm}
{\\footnotesize\\href{https://d4ttara.github.io/metacademy-of-humanity/support/}{d4ttara.github.io/metacademy-of-humanity/support/}\\par}
TEX
}

declare -a ITEMS=(
  "007 en documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.md documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_EN_v1.0RC.pdf 3 3 no"
  "007 ua documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.md documents/007-after-vibe-coding/METACADEMY_DOCUMENT_007_AFTER_VIBE_CODING_UA_v1.0RC.pdf 3 3 no"
  "008 en documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.md documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_EN_v1.0RC.pdf 3 3 no"
  "008 ua documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.md documents/008-the-interface-that-knows-you/METACADEMY_DOCUMENT_008_INTERFACE_THAT_KNOWS_YOU_UA_v1.0RC.pdf 3 3 no"
  "009 en documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.md documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_EN_v1.0RC.pdf 5 12 existing"
  "009 ua documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.md documents/009-elon-musk-mark-zuckerberg-ai-control/METACADEMY_DOCUMENT_009_AI_CONTROL_UA_v1.0RC.pdf 5 12 existing"
  "010 en documents/010-manifestation-time-genesis-time/METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME_EN_v1.0.md documents/010-manifestation-time-genesis-time/METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME_EN_v1.0.pdf 3 8 append"
  "010 ua documents/010-manifestation-time-genesis-time/METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME_UA_v1.0.md documents/010-manifestation-time-genesis-time/METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME_UA_v1.0.pdf 3 8 append"
  "011 en documents/011-the-third-body/METACADEMY_DOCUMENT_011_THIRD_BODY_EN_v1.0.md documents/011-the-third-body/METACADEMY_DOCUMENT_011_THIRD_BODY_EN_v1.0.pdf 4 9 append"
  "011 ua documents/011-the-third-body/METACADEMY_DOCUMENT_011_THIRD_BODY_UA_v1.0.md documents/011-the-third-body/METACADEMY_DOCUMENT_011_THIRD_BODY_UA_v1.0.pdf 4 9 append"
  "012 en documents/012-myoga-astrology-overview/METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW_EN_v1.0.md documents/012-myoga-astrology-overview/METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW_EN_v1.0.pdf 3 8 append"
  "012 ua documents/012-myoga-astrology-overview/METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW_UA_v1.0.md documents/012-myoga-astrology-overview/METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW_UA_v1.0.pdf 3 8 append"
)

for item in "${ITEMS[@]}"; do
  read -r doc lang md pdf min_pages max_pages support_mode <<<"$item"
  echo "Building Document $doc $lang -> $pdf"
  tmpmd="$TMP_BUILD/${doc}_${lang}.md"
  python3 - "$md" "$tmpmd" <<'PY'
from pathlib import Path
import re, sys
src, dst = map(Path, sys.argv[1:])
text = src.read_text(encoding='utf-8').replace('\u0226', 'A\u0307')
text = re.split(r'\n---\n\n\*\*(?:Status|Статус):\*\*', text, maxsplit=1)[0].rstrip() + '\n'
dst.write_text(text, encoding='utf-8')
PY
  if [[ "$support_mode" == "append" ]]; then append_support_page "$lang" "$tmpmd"; fi
  pandoc "$tmpmd" --from=markdown+yaml_metadata_block+raw_tex --pdf-engine=xelatex --template="$TEMPLATE" --output="$pdf"

  if [[ "$doc" =~ ^(009|010|011|012)$ ]]; then
    python3 - "$pdf" <<'PY'
from pathlib import Path
import hashlib, re, sys
path = Path(sys.argv[1]); data = path.read_bytes()
pat = re.compile(rb'(/ID\s*\[\s*<)([0-9A-Fa-f]{32})(>\s*<)([0-9A-Fa-f]{32})(>\s*\])')
matches = list(pat.finditer(data))
if len(matches) != 1: raise SystemExit(f'Expected one PDF trailer ID in {path}, found {len(matches)}')
zeroed = pat.sub(lambda m: m.group(1)+b'0'*32+m.group(3)+b'0'*32+m.group(5), data, count=1)
stable = hashlib.sha256(zeroed).hexdigest()[:32].encode('ascii')
path.write_bytes(pat.sub(lambda m: m.group(1)+stable+m.group(3)+stable+m.group(5), data, count=1))
print(f'PDF_TRAILER_ID=DETERMINISTIC file={path} id={stable.decode()}')
PY
  fi

  pages="$(pdfinfo "$pdf" | awk '/^Pages:/ {print $2}')"
  if (( pages < min_pages || pages > max_pages )); then echo "Unexpected page count for $pdf: $pages" >&2; exit 1; fi
  pdftotext "$pdf" - | grep -q "MET" || { echo "PDF text extraction failed: $pdf" >&2; exit 1; }
  pdffonts "$pdf" | grep -q "IBMPlexSans" || { echo "IBM Plex Sans missing: $pdf" >&2; exit 1; }
  pdffonts "$pdf" | grep -q "IBMPlexMono" || { echo "IBM Plex Mono missing: $pdf" >&2; exit 1; }
  if [[ "$support_mode" != "no" ]]; then
    pdftotext "$pdf" - | grep -Eqi "SUPPORT|ПІДТРИМАТИ" || { echo "Support page missing: $pdf" >&2; exit 1; }
  fi
  echo "PDF_PREFLIGHT=PASS doc=$doc lang=$lang pages=$pages typography=IBM_PLEX support=$support_mode"
done

python3 - <<'PY'
from pathlib import Path
import hashlib, json, subprocess
root=Path('.')
items={
('010','en'):('documents/010-manifestation-time-genesis-time/METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME_EN_v1.0.md','documents/010-manifestation-time-genesis-time/METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME_EN_v1.0.pdf'),
('010','ua'):('documents/010-manifestation-time-genesis-time/METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME_UA_v1.0.md','documents/010-manifestation-time-genesis-time/METACADEMY_DOCUMENT_010_MANIFESTATION_TIME_GENESIS_TIME_UA_v1.0.pdf'),
('011','en'):('documents/011-the-third-body/METACADEMY_DOCUMENT_011_THIRD_BODY_EN_v1.0.md','documents/011-the-third-body/METACADEMY_DOCUMENT_011_THIRD_BODY_EN_v1.0.pdf'),
('011','ua'):('documents/011-the-third-body/METACADEMY_DOCUMENT_011_THIRD_BODY_UA_v1.0.md','documents/011-the-third-body/METACADEMY_DOCUMENT_011_THIRD_BODY_UA_v1.0.pdf'),
('012','en'):('documents/012-myoga-astrology-overview/METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW_EN_v1.0.md','documents/012-myoga-astrology-overview/METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW_EN_v1.0.pdf'),
('012','ua'):('documents/012-myoga-astrology-overview/METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW_UA_v1.0.md','documents/012-myoga-astrology-overview/METACADEMY_DOCUMENT_012_MYOGA_ASTROLOGY_OVERVIEW_UA_v1.0.pdf')}
def sha(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def pages(p):
    out=subprocess.check_output(['pdfinfo',p],text=True)
    return int(next(x.split(':',1)[1] for x in out.splitlines() if x.startswith('Pages:')).strip())
receipt={'schema':'metacademy-publication-build-receipt/v1','date':'2026-08-19','version':'v1.0','documents':{}}
for (doc,lang),(md,pdf) in items.items():
    receipt['documents'].setdefault(doc,{})[lang]={'markdown_sha256':sha(md),'pdf_sha256':sha(pdf),'page_count':pages(pdf),'typography':'IBM Plex Sans + IBM Plex Mono','paper':'A4','separate_support_page':True}
Path('publications/PUBLICATION_BUILD_RECEIPT_010_012_v1.0.json').write_text(json.dumps(receipt,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(receipt,ensure_ascii=False,indent=2))
PY

echo "ARTICLE_PDF_BUILD=PASS documents=007-012 editions=EN,UA new_support_pages=010-012 typography=IBM_PLEX"
