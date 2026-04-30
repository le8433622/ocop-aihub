# Task: Add AIHub core provider and task runner

## Context

AIHub needs a provider abstraction and centralized task runner before product AI tasks are implemented.

## Goal

Add server-side AIHub core that can call NVIDIA API through a provider interface, log generations, parse JSON, and use a mock provider only for tests.

## Scope

Allowed files:

- lib/ai/**
- app/api/ai/health/route.ts
- tests/ai/**

Blocked files:

- lib/orders/**
- lib/payments/**
- lib/shipping/**
- app/s/**

## Requirements

- Add AiProvider interface.
- Add NvidiaProvider.
- Add MockProviderForTest.
- Add AiTaskRunner.
- AiTaskRunner must write AiGeneration RUNNING/SUCCEEDED/FAILED.
- Add JSON parser with clear error.
- Add health endpoint that checks config without calling NVIDIA.
- Do not call NVIDIA from frontend.
- Do not expose API key.

## Acceptance criteria

- Unit tests for JSON parser.
- Unit tests with MockProviderForTest.
- Health endpoint returns configured status.
- No client component imports NvidiaProvider.

## Commands

- npm run typecheck
- npm test
- npx prisma validate
