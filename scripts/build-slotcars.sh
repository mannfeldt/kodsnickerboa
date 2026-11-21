#!/bin/sh
# Builds the Slotcars web app and copies it into slotcars/, where it is served
# at https://kodsnickerboa.com/slotcars/.
#
# Usage: scripts/build-slotcars.sh [path to the slotcars project]
# The project defaults to ../slotcars next to this repository.
set -eu

site="$(cd "$(dirname "$0")/.." && pwd)"
app="${1:-$site/../slotcars}"

# --base-href must match the folder the game is served from.
# --no-web-resources-cdn makes the game load its renderer (CanvasKit) from this
# site instead of from Google's CDN.
(cd "$app" && flutter build web --release --base-href /slotcars/ --no-web-resources-cdn)

# slotcars/privacy/ is written by hand and lives only in this repository, so it
# is left alone. Left out of the copy: debug symbols, and the skwasm and wimp
# renderers, which only a `flutter build web --wasm` build loads.
rsync -a --delete \
  --exclude '/privacy/' \
  --exclude '.last_build_id' \
  --exclude '.DS_Store' \
  --exclude '*.symbols' \
  --exclude '/canvaskit/skwasm*' \
  --exclude '/canvaskit/wimp*' \
  "$app/build/web/" "$site/slotcars/"

echo "Slotcars $(sed 's/.*"version":"\([^"]*\)".*/\1/' "$site/slotcars/version.json") copied to $site/slotcars"
