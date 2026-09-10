#!/usr/bin/env bash
set -euo pipefail
export SOURCE_DATE_EPOCH=1786363200
export TZ=UTC
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
clean_source(){
  python3 - "$1" "$2" <<'PY'
from pathlib import Path
import re,sys
src,dst=map(Path,sys.argv[1:3])
t=src.read_text(encoding='utf-8-sig')
t=re.sub(r'<style>.*?</style>','',t,flags=re.S)
t=re.sub(r'<div class="logo-panel">.*?</div>','',t,flags=re.S)
t=re.sub(r'!\[[^\]]*\]\([^)]*LOGO[^)]*\)\s*','',t,flags=re.I)
t=re.sub(r'</?div(?:\s+[^>]*)?>','',t)
t=re.sub(r'<strong>(.*?)</strong>',r'**\1**',t,flags=re.S)
t=re.sub(r'<em>(.*?)</em>',r'*\1*',t,flags=re.S)
t=re.sub(r'\n{3,}','\n\n',t).strip()+"\n"
dst.write_text(t,encoding='utf-8')
PY
}
build_one(){
  src="$1"; stem="$2"; lang="$3"; title="$4"
  dir="$(dirname "$src")"; clean="$TMP/${stem}.md"
  clean_source "$src" "$clean"
  pdf="$dir/${stem}_PUBLIC.pdf"
  epub="$dir/${stem}_PUBLIC.epub"
  docx="$dir/${stem}_PUBLIC.docx"
  pandoc "$clean" --from=markdown+raw_html+smart --pdf-engine=xelatex -V mainfont="IBM Plex Sans" -V monofont="IBM Plex Mono" -V geometry:margin=22mm -V fontsize=11pt --metadata title="$title" --metadata author="Ievgen Karogod / Dattara" --metadata lang="$lang" -o "$pdf"
  pandoc "$clean" --from=markdown+raw_html+smart --metadata title="$title" --metadata author="Ievgen Karogod / Dattara" --metadata lang="$lang" -o "$epub"
  pandoc "$clean" --from=markdown+raw_html+smart --metadata title="$title" --metadata author="Ievgen Karogod / Dattara" --metadata lang="$lang" -o "$docx"
  pdftotext "$pdf" - | grep -Fqi "HUMANITY" || { echo "Manifest body title missing in $pdf"; exit 1; }
  pdffonts "$pdf" | grep -q "IBMPlexSans" || { echo "IBM Plex Sans missing in $pdf"; exit 1; }
  test -s "$epub" && test -s "$docx"
  echo "MANIFEST_FORMAT_BUILD=PASS source=$src pdf=$pdf epub=$epub docx=$docx"
}
BASE="manifestos/archive/metacademy-continuity"
build_one "$BASE/v1.0/META_A_CADEMY_MANIFEST_V1.0.md" "META_A_CADEMY_MANIFEST_V1.0" "uk-UA" "META[A]CADEMY OF HUMANITY · Маніфест незавершеності знання · v1.0"
build_one "$BASE/v1.1/META_A_CADEMY_MANIFEST_V1.1_UA.md" "META_A_CADEMY_MANIFEST_V1.1_UA" "uk-UA" "MET[Ȧ]CADEMY OF HUMANITY · Маніфест продовжуваності знання · v1.1"
build_one "$BASE/v1.1/META_A_CADEMY_MANIFEST_V1.1_EN.md" "META_A_CADEMY_MANIFEST_V1.1_EN" "en" "MET[Ȧ]CADEMY OF HUMANITY · Manifesto of the Continuity of Knowledge · v1.1"
build_one "$BASE/v1.2/MET_A_CADEMY_MANIFEST_V1.2_UA.md" "MET_A_CADEMY_MANIFEST_V1.2_UA" "uk-UA" "MET[Ȧ]CADEMY OF HUMANITY · Маніфест продовжуваності знання · v1.2"
build_one "$BASE/v1.2/MET_A_CADEMY_MANIFEST_V1.2_EN.md" "MET_A_CADEMY_MANIFEST_V1.2_EN" "en" "MET[Ȧ]CADEMY OF HUMANITY · Manifesto of the Continuity of Knowledge · v1.2"
echo "MANIFEST_FORMAT_BUILD=PASS editions=5 formats=PDF,EPUB,DOCX historical_naming=PRESERVED"