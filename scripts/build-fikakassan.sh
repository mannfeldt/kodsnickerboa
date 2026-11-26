#!/bin/sh
# Builds the Fikakassan web app for https://kodsnickerboa.com/fikakassan/app/.
# Usage: scripts/build-fikakassan.sh [path to the fikakassan project]
set -eu

site="$(cd "$(dirname "$0")/.." && pwd)"
app="$(cd "${1:-$site/../fikakassen2}" && pwd)"
destination="$site/fikakassan/app"

# The project's own build script bundles CanvasKit, lists every file in
# offline_files.json and stamps offline_worker.js, so the till keeps working
# without reception after the first visit.
(cd "$app" && tool/build_web.sh --release --base-href /fikakassan/app/)

# Only the Flutter build directory is generated. The landing page sits above it.
# Leave out exactly what tool/build_web.sh leaves out of offline_files.json:
# the offline worker caches every listed file on install and gives up if
# one of them is missing.
mkdir -p "$destination"
rsync -a --delete \
  --exclude '.last_build_id' \
  --exclude '.DS_Store' \
  --exclude '*.symbols' \
  --exclude '/canvaskit/skwasm*' \
  "$app/build/web/" "$destination/"

echo "Fikakassan copied to $destination"
