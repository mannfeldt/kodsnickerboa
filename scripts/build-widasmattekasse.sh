#!/bin/sh
# Builds the Flutter app for https://kodsnickerboa.com/widasmattekasse/app/.
# Usage: scripts/build-widasmattekasse.sh [path to the mattekassen4 project]
set -eu

site="$(cd "$(dirname "$0")/.." && pwd)"
app="$(cd "${1:-$site/../mattekassen4}" && pwd)"
destination="$site/widasmattekasse/app"

(cd "$app" && flutter build web --release --base-href /widasmattekasse/app/ --no-web-resources-cdn)

# Only the Flutter build directory is generated. The landing page sits above it.
mkdir -p "$destination"
rsync -a --delete \
  --exclude '.last_build_id' \
  --exclude '.DS_Store' \
  --exclude '*.symbols' \
  --exclude '/canvaskit/skwasm*' \
  --exclude '/canvaskit/wimp*' \
  "$app/build/web/" "$destination/"

echo "Widas Mattekasse copied to $destination"
