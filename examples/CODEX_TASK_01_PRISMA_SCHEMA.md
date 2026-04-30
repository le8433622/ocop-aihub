# Task: Add Prisma schema for OCOP AIHub Platform

## Context

Database foundation for commerce, AIHub, and engineering insights.

## Goal

Create production-ready Prisma schema for users, suppliers, products, storefronts, orders, payments, shipping state, AIHub logs, and engineering insights.

## Scope

Allowed files:

- prisma/schema.prisma
- prisma/migrations/**
- .env.example

Blocked files:

- app/**
- components/**
- lib/** except if Prisma client import needs note

## Requirements

- Add enums for roles, statuses, AI task status.
- Add models for User, Supplier, Product, Storefront, Order, Payment, AiGeneration, AiContentDraft, EngineeringInsight, AuditLog.
- Add unique constraints where needed.
- Add relations.
- No seed mock data.

## Acceptance criteria

- npx prisma validate passes.
- npx prisma generate passes.
- Migration is included if working in an existing project.

## Commands

- npx prisma format
- npx prisma validate
- npx prisma generate
