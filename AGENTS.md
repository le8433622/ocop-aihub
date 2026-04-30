# AGENTS.md

## Project

OCOP AIHub White-Label Commerce Platform.

## Product goal

Build a real production-first commerce platform for OCOP suppliers, resellers, storefronts, customers, admin operations, AIHub runtime, and Codex-assisted engineering workflow.

## Tech stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma
- PostgreSQL
- Supabase Auth/Storage or equivalent
- NVIDIA AI provider through server-side AIHub
- Vercel
- GitHub PR workflow

## Hard rules

- Do not use mock data in production code.
- Do not hard-code products, suppliers, orders, users, or AI responses.
- Do not call NVIDIA or any AI provider from frontend/browser code.
- Do not expose secrets in client components, logs, examples, or committed files.
- Do not auto-approve products.
- Do not auto-confirm payments.
- Do not auto-approve OCOP certificates.
- Do not auto-refund orders.
- Do not let AI publish public content without review.
- Every important action needs permission checks.
- Every important action needs audit log if it changes business state.
- Every AI task must write an `AiGeneration` log.
- AIHub failure must not break storefront checkout.
- Codex must not merge directly to main.

## Commands

Run before finishing a task when applicable:

```bash
npm run lint
npm run typecheck
npm test
npx prisma validate
npx prisma generate
```

If schema changes:

```bash
npx prisma format
npx prisma migrate dev --name <migration_name>
```

Production migration command:

```bash
npx prisma migrate deploy
```

## Branch rules

- One task = one branch = one PR.
- Use branch names like `feature/product-module`, `aihub/product-validation`, `fix/order-inventory-transaction`.
- Do not modify unrelated modules.
- Do not change database schema unless task explicitly requires it.
- If schema changes, include migration.
- Do not install packages unless task explicitly needs them.

## Definition of Done

A task is done only when:

- TypeScript passes.
- Prisma validates if schema is touched.
- Permission checks exist.
- Input validation exists.
- Error handling exists.
- No secrets are exposed.
- No mock production data is introduced.
- Tests or test notes are included.
- PR summary explains files changed and risks.

## AIHub-specific rules

- AIHub endpoints must run server-side only.
- Every AI request must create/update `AiGeneration`.
- Public AI output must pass safety scan.
- Public AI output must go through draft/review/publish flow.
- Chatbot must only answer from storefront catalog context.
- AI must not invent OCOP stars, certificate numbers, origin, ingredients, or medical claims.

## Commerce-specific rules

- Order creation must run inside a database transaction.
- Inventory must be checked before decrement.
- Product must be approved before public sale.
- Storefront must be active before checkout.
- Payment status starts as `UNPAID` or `PENDING_PAYMENT`.
- Payment confirmation only through verified webhook or admin action.
