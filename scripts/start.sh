#!/usr/bin/env bash
set -e

echo "[iSH] Preparing Copilot Autonomous Assistant environment..."

# Detect package managers
if command -v apk >/dev/null 2>&1; then
  echo "[iSH] Installing runtime dependencies with apk..."
  apk add --no-cache nodejs npm git curl ca-certificates
elif command -v apt-get >/dev/null 2>&1; then
  echo "[iSH] Installing runtime dependencies with apt-get..."
  apt-get update
  apt-get install -y nodejs npm git curl ca-certificates
else
  echo "[iSH] Neither apk nor apt-get found. Please install Node.js and npm manually."
  exit 1
fi

if [ ! -d "/tmp/copilot-autonomous-assistant" ]; then
  echo "[iSH] Clone project repository..."
  git clone https://github.com/benholl94-cmyk/copilot-autonomous-assistant.git /tmp/copilot-autonomous-assistant
fi

cd /tmp/copilot-autonomous-assistant
npm install --silent

cat > /tmp/copilot-autonomous-assistant/.env <<'EOF'
PORT=3000
NODE_ENV=production
ISH_MODE=true
EOF

echo "[iSH] Installation complete."
echo "[iSH] Run: cd /tmp/copilot-autonomous-assistant && npm start"
echo "[iSH] Open the dashboard with your iOS browser at: http://localhost:3000"
