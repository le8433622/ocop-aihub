#!/usr/bin/env bash
set -euo pipefail

echo "[AUTO-WAVE1-CI] Starting remote CI bootstrap..."

# Environment variables (can be supplied from GitHub Actions / Vercel)
export DATABASE_URL="${DATABASE_URL:-postgres://postgres:password@localhost:5432/ocopdb}"
export JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 32)}"
export NVAPI_TOKEN="${NVAPI_TOKEN:-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}"

echo "Using DATABASE_URL=$DATABASE_URL"
echo "JWT_SECRET set."
echo "NVAPI_TOKEN set."

echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Applying migrations..."
npx prisma migrate dev --name init --create-external-datamodel false

echo "Seeding admin user..."
npm run seed

echo "Starting Next.js dev server..."
npm run dev &
SERVER_PID=$!
echo "Dev server PID: $SERVER_PID"

echo "Waiting for server to be ready..."
sleep 10

echo "Testing authentication..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password"}')
echo "Login response: $LOGIN_RESPONSE"
TOKEN=$(echo "$LOGIN_RESPONSE" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
echo "Token: $TOKEN"

if [ -n "$TOKEN" ]; then
  echo "Fetching products..."
  curl -s -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/products | head -n 5
  echo "Testing AIHub generation endpoint..."
  curl -s -X POST http://localhost:3000/api/aihub/generate -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"model":"test","prompt":"hello"}' | head -n 5
fi

echo "[AUTO-WAVE1-CI] Wave 1 bootstrap completed."
