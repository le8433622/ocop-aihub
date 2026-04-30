#!/usr/bin/env bash
set -euo pipefail

export DATABASE_URL="${DATABASE_URL:-postgres://postgres:password@localhost:5432/ocopdb}"
echo "Using DATABASE_URL=${DATABASE_URL}"

echo "Starting local Postgres via docker-compose..."
docker-compose up -d db

echo "Waiting for DB to be ready..."
until docker exec -i ocop_aihub_db psql -U postgres -d ocopdb -c '\q' 2>/dev/null; do
  sleep 1
done
echo "DB is ready."

echo "Installing Prisma client and generating artifacts..."
npx prisma generate

echo "Applying migrations..."
npx prisma migrate dev --name init --create-external-datamodel false

echo "Seeding admin user..."
npm run seed

echo "Starting Next.js dev server (in background)..."
npm run dev &

PID=$!
echo "Dev server pid: ${PID}"

echo "Waiting for server to start..."
sleep 10

echo "Testing login API..."
login_response=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@example.com","password":"password"}')
echo "Login response: ${login_response}"
token=$(echo "$login_response" | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')
echo "Extracted token: ${token}"

if [ -n "${token}" ]; then
  echo "Fetching products with token..."
  curl -s -H "Authorization: Bearer ${token}" http://localhost:3000/api/products | sed '1,3p'
else
  echo "Token not obtained; please login manually to verify API endpoints."
fi
