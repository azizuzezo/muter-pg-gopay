#!/usr/bin/env bash
# Start for a Pterodactyl panel: pull the latest code, install dependencies, run the gateway.
# .env and .GOPAY_SESI_JANGAN_DIHAPUS.json are not in git; upload them once by hand
# (the session file comes from `node login.js`).
cd "$(dirname "$0")" || exit 1

git pull --ff-only || echo "[start] git pull skipped"
npm install --omit=dev

# server.js listens on PORT; the panel hands out the allocated port as SERVER_PORT, and it wins over .env.
export PORT="${SERVER_PORT:-$PORT}"

exec node server.js
