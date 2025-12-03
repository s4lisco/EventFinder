#!/usr/bin/env bash
set -euo pipefail

FRONTEND_DIR="$(cd "$(dirname "$0")/.." && pwd)"
REPO_ROOT="$(cd "$FRONTEND_DIR/.." && pwd)"

echo "[dev.sh] Frontend: $FRONTEND_DIR"
echo "[dev.sh] Repo root: $REPO_ROOT"
LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || echo "127.0.0.1")

echo "[dev.sh] If using Capacitor Live-Reload, set server.url in capacitor.config.ts to:"
echo "  - iOS Simulator/Device:   http://$LAN_IP:3000"
echo "  - Android Emulator:       http://10.0.2.2:3000"

cd "$FRONTEND_DIR"
LOCAL_NEXT_CLI="node_modules/next/dist/bin/next"
ROOT_NEXT_CLI="$REPO_ROOT/node_modules/next/dist/bin/next"

if [[ -f "$LOCAL_NEXT_CLI" ]]; then
  echo "[dev.sh] Starting Next.js via local frontend CLI (clean env)"
  exec env -i HOME="$HOME" PATH="$PATH" node "$LOCAL_NEXT_CLI" dev
elif [[ -f "$ROOT_NEXT_CLI" ]]; then
  echo "[dev.sh] Starting Next.js via repo root CLI (cwd=frontend, clean env)"
  exec env -i HOME="$HOME" PATH="$PATH" node "$ROOT_NEXT_CLI" dev
else
  echo "[dev.sh] Next CLI not found locally or in repo root. Please install dependencies:"
  echo "  cd $REPO_ROOT && npm install -w frontend"
  exit 1
fi
