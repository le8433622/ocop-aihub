#!/usr/bin/env bash
set -euo pipefail

# Local configuration (can be overridden via env vars)
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-ocopdb}
DB_USER=${DB_USER:-postgres}
DB_PASS=${DB_PASS:-password}
DATABASE_URL="postgres://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "Using DATABASE_URL=$DATABASE_URL"

export DATABASE_URL

echo "Starting local Postgres (Docker)"
docker-compose up -d db

echo "Waiting for Postgres to be ready..."
until docker exec -i ocop_aihub_db psql -U "$DB_USER" -d "$DB_NAME" -c '\q' 2>/dev/null; do
  sleep 1
  echo -n "."
done
echo " Postgres is ready."

echo "Installing dependencies if needed..."
if [ ! -d node_modules ]; then
  npm install
fi

echo "Generating Prisma client..."
npx prisma generate

echo "Applying migrations..."
npx prisma migrate dev --name init --create-external-datamodel false

echo "Seeding data (admin user)..."
npm run seed

echo "Starting Next.js dev server..."
npm run dev &
SERVER_PID=$!
echo "Dev server PID: $SERVER_PID"

echo "Waiting for server to boot..."
sleep 10

echo "Testing authentication flow..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password"}')
echo "Login response: $LOGIN_RESPONSE"
TOKEN=$(echo "$LOGIN_RESPONSE" | sed -n 's/.*"token":"\([^\"]*\)".*/\1/p')
echo "Token: ${TOKEN}"

if [ -n "${TOKEN}" ]; then
  echo "Fetching products with token..."
  curl -s -H "Authorization: Bearer ${TOKEN}" http://localhost:3000/api/products | head -n 5
fi

echo "Wave1 bootstrap completed."
