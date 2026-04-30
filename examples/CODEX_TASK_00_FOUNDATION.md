# Task: Create project foundation

## Context

Base repository setup for OCOP AIHub Platform.

## Goal

Create the base Next.js project structure and documentation required for parallel Codex work.

## Scope

Allowed files:

- app/**
- components/**
- lib/**
- docs/**
- AGENTS.md
- README.md
- .env.example

Blocked files:

- prisma/schema.prisma unless project scaffold requires placeholder

## Requirements

- Add root AGENTS.md.
- Add docs/ARCHITECTURE.md.
- Add docs/API_CONTRACTS.md.
- Add docs/TASK_GRAPH.md.
- Add docs/TASKS_PARALLEL.md.
- Add docs/CODEX_TASK_TEMPLATE.md.
- Add lib/prisma.ts.
- Add lib/money.ts.
- Add lib/slug.ts.
- Add folder structure for app, components, lib.
- No mock product data.

## Acceptance criteria

- npm run build works.
- Docs exist.
- Folder structure exists.
- No secrets in repo.

## Commands

- npm run lint
- npm run typecheck
- npm run build
