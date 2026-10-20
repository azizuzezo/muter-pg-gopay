#!/usr/bin/env bash
# Start for a Pterodactyl panel: pull the latest code, install dependencies, run the gateway.
# .env and .GOPAY_SESI_JANGAN_DIHAPUS.json are not in git; upload them once by hand
# (the session file comes from `node login.js`). The panel's SERVER_PORT is used as PORT unless .env sets one.
cd "$(dirname "$0")" || exit 1

git pull --ff-only || echo "[start] git pull skipped"
npm install --omit=dev

exec node server.js
