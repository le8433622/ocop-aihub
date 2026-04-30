#!/usr/bin/env bash
set -euo pipefail

echo "[AUTO-WAVE1] Checking Docker daemon..."
retry=0
max_retry=60
until docker info >/dev/null 2>&1; do
  retry=$((retry + 1))
  if [ $retry -ge $max_retry ]; then
    echo "[AUTO-WAVE1] Docker daemon not available after $max_retry seconds. Exit."
    exit 1
  fi
  echo "[AUTO-WAVE1] Waiting for Docker daemon... ($retry/$max_retry)"
  sleep 2
done
echo "[AUTO-WAVE1] Docker daemon is up. Starting Wave 1 bootstrap."

bash scripts/wave1_all_in_one.sh

echo "[AUTO-WAVE1] Wave 1 bootstrap finished."
