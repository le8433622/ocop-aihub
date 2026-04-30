# Setup Guide

## 1. Required tools

- Node.js 20+
- npm or pnpm
- GitHub CLI
- Vercel CLI
- PostgreSQL database: Supabase, Neon, Railway, or local Postgres
- Prisma
- Optional: Docker if running Supabase local

## 2. Create project

```bash
npx create-next-app@latest ocop-aihub-platform --typescript --tailwind --eslint --app --src-dir=false
cd ocop-aihub-platform
npm install prisma @prisma/client zod
npx prisma init
```

## 3. Add docs

Copy this documentation pack into the repo root.

Required root files:

- README.md
- AGENTS.md
- docs/*
- templates/*
- prompts/*

## 4. Environment

Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

Set at minimum:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/ocop_aihub"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NVIDIA_API_KEY=""
NVIDIA_BASE_URL="https://integrate.api.nvidia.com/v1"
NVIDIA_DEFAULT_MODEL="nvidia/llama-3.1-nemotron-70b-instruct"
```

## 5. Prisma

```bash
npx prisma validate
npx prisma generate
npx prisma migrate dev --name init
```

## 6. Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 7. Vercel

```bash
vercel
vercel env pull .env.local
vercel --prod
```

Production migration:

```bash
npx prisma migrate deploy
```

## 8. Codex workflow

1. Codex reads `AGENTS.md`.
2. Codex reads `docs/TASK_GRAPH.md`.
3. Create one GitHub issue per task.
4. One Codex task per branch.
5. PR must include tests run and risk notes.
6. Human reviews before merge.
