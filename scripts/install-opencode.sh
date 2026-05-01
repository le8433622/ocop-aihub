#!/bin/bash

# Pre-build script to install Opencode
echo "🚀 Installing Opencode CLI..."

# Detect platform
PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

if [ "$ARCH" = "arm64" ]; then
  ARCH="arm64"
else
  ARCH="x64"
fi

# Try npm first
echo "Trying npm install..."
if npm install -g opencode 2>/dev/null; then
  echo "✅ Opencode installed via npm"
  exit 0
fi

# Try direct download
echo "Trying direct download..."
OPENCODE_DIR="$HOME/.opencode/bin"
mkdir -p "$OPENCODE_DIR"

# Get latest release
LATEST=$(curl -sL https://api.github.com/repos/anomalyco/opencode/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
FILENAME="opencode-${PLATFORM}-${ARCH}"
URL="https://github.com/anomalyco/opencode/releases/download/${LATEST}/${FILENAME}"

if curl -fSL "$URL" -o "$OPENCODE_DIR/opencode" 2>/dev/null; then
  chmod +x "$OPENCODE_DIR/opencode"
  echo "✅ Opencode installed at $OPENCODE_DIR/opencode"
  echo "export PATH=\$PATH:$OPENCODE_DIR" >> ~/.bashrc
  exit 0
fi

echo "⚠️ Opencode installation skipped (will be tried at runtime)"