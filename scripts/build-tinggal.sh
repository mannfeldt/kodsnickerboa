#!/bin/sh
# Builds the static Tinggal landing page and demo for kodsnickerboa.com.
# Usage: scripts/build-tinggal.sh [path to the Tinggal project]
set -eu

site="$(cd "$(dirname "$0")/.." && pwd)"
app="$(cd "${1:-$site/../tinggal4}" && pwd)"
destination="$site/tinggal/app"

(cd "$app" && flutter build web --release --base-href /tinggal/app/ --no-web-resources-cdn --dart-define=STATIC_DEMO=true)

mkdir -p "$destination"
cp "$app/landing/index.html" "$site/tinggal/index.html"
rsync -a --delete \
  --exclude '.last_build_id' \
  --exclude '.DS_Store' \
  --exclude '*.symbols' \
  --exclude '/firebase-messaging-sw.js' \
  --exclude '/canvaskit/skwasm*' \
  --exclude '/canvaskit/wimp*' \
  "$app/build/web/" "$destination/"

echo "Tinggal landing and static demo copied to $site/tinggal/"
