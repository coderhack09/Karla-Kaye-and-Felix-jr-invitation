#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

mkdir -p scripts/reports

echo "Building production..."
pnpm build

echo "Running bundle analyzer..."
ANALYZE=true next build || true
pnpm bundle:explore || true

echo "Starting server..."
PORT=3000 pnpm start -p 3000 &
SERVER_PID=$!
sleep 5

cleanup() {
  kill $SERVER_PID || true
}
trap cleanup EXIT

if command -v lighthouse >/dev/null 2>&1; then
  echo "Running Lighthouse (mobile & desktop)..."
  mkdir -p scripts/reports
  pnpm exec lighthouse http://localhost:3000 \
    --output=json --output-path=./scripts/reports/lh-mobile.json \
    --only-categories=performance,accessibility,best-practices,seo \
    --form-factor=mobile --throttling-method=devtools --screenEmulation.mobile=true || true

  pnpm exec lighthouse http://localhost:3000 \
    --output=json --output-path=./scripts/reports/lh-desktop.json \
    --only-categories=performance,accessibility,best-practices,seo \
    --preset=desktop || true
else
  echo "Lighthouse not found in PATH; skipping direct run. Use: pnpm lhci"
fi

echo "Running LHCI autorun..."
pnpm lhci || true

echo "Reports saved in scripts/reports"


