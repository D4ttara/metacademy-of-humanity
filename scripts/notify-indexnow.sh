#!/usr/bin/env bash
set -euo pipefail

KEY="de960f0a12a212b72e47034296f7b43c4887042387267f74ab4943fba058ba45"
HOST="d4ttara.github.io"
BASE="https://${HOST}/metacademy-of-humanity/"
KEY_LOCATION="${BASE}${KEY}.txt"

# Use the final generated sitemap as the source of public URLs so new documents,
# topic hubs and language editions do not silently miss discovery notification.
mapfile -t urls < <(python3 - <<'PY'
from pathlib import Path
import xml.etree.ElementTree as ET
p = Path('sitemap.xml')
if not p.exists():
    raise SystemExit('sitemap.xml missing')
root = ET.parse(p).getroot()
ns = {'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
seen = set()
for loc in root.findall('s:url/s:loc', ns):
    u = (loc.text or '').strip()
    if u and u not in seen:
        seen.add(u)
        print(u)
PY
)

if [[ ${#urls[@]} -eq 0 ]]; then
  echo "INDEXNOW_NOTIFY=SKIP reason=no_urls"
  exit 0
fi

payload="$(python3 - "$HOST" "$KEY" "$KEY_LOCATION" "${urls[@]}" <<'PY'
import json, sys
host, key, key_location, *urls = sys.argv[1:]
print(json.dumps({"host": host, "key": key, "keyLocation": key_location, "urlList": urls}, ensure_ascii=False))
PY
)"

# Discovery notification is useful but must never make a successful publication unavailable.
# IndexNow acknowledgement means the URL notification was received, not that indexing is guaranteed.
status="$(curl --retry 2 --retry-delay 2 --connect-timeout 10 --max-time 30 -sS -o /tmp/indexnow-response.txt -w '%{http_code}' \
  -X POST 'https://api.indexnow.org/indexnow' \
  -H 'Content-Type: application/json; charset=utf-8' \
  --data "$payload" || true)"

if [[ "$status" == "200" || "$status" == "202" ]]; then
  echo "INDEXNOW_NOTIFY=ACK status=$status urls=${#urls[@]} source=sitemap key_location=$KEY_LOCATION"
else
  body="$(tr '\n' ' ' </tmp/indexnow-response.txt 2>/dev/null | head -c 300 || true)"
  echo "INDEXNOW_NOTIFY=NONBLOCKING status=${status:-curl_error} urls=${#urls[@]} source=sitemap response=$body"
fi
