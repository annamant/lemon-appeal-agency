#!/bin/bash
set -euo pipefail

# Only run in remote (Claude Code on the web) environments
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

echo "Installing dependencies for Lemon Appeal Content Planning Studio..."
cd "${CLAUDE_PROJECT_DIR:-.}"
npm install
echo "Dependencies installed successfully."
