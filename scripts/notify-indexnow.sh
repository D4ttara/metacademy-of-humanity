#!/usr/bin/env bash
set -euo pipefail

KEY="de960f0a12a212b72e47034296f7b43c4887042387267f74ab4943fba058ba45"
HOST="d4ttara.github.io"
BASE="https://${HOST}/metacademy-of-humanity/"
KEY_LOCATION="${BASE}${KEY}.txt"

urls=(
  "${BASE}"
  "${BASE}manifesto/"
  "${BASE}research/"
  "${BASE}documents/"
  "${BASE}documents/010-manifestation-time-genesis-time/en/"
  "${BASE}documents/010-manifestation-time-genesis-time/ua/"
  "${BASE}documents/011-the-third-body/en/"
  "${BASE}documents/011-the-third-body/ua/"
  "${BASE}documents/012-myoga-astrology-overview/en/"
  "${BASE}documents/012-myoga-astrology-overview/ua/"
  "${BASE}uk/"
)

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
  echo "INDEXNOW_NOTIFY=ACK status=$status urls=${#urls[@]} key_location=$KEY_LOCATION"
else
  body="$(tr '\n' ' ' </tmp/indexnow-response.txt 2>/dev/null | head -c 300 || true)"
  echo "INDEXNOW_NOTIFY=NONBLOCKING status=${status:-curl_error} urls=${#urls[@]} response=$body"
fi
