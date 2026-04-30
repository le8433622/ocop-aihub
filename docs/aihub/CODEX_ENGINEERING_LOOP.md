# AIHub to Codex Engineering Loop

## Goal

Turn runtime evidence into actionable engineering tasks for Codex without giving AI uncontrolled production power.

## Loop

```text
Runtime data
  -> AIHub analysis
  -> EngineeringInsight
  -> Admin triage
  -> Codex brief
  -> GitHub issue/branch
  -> Codex PR
  -> CI checks
  -> Human review
  -> Merge/deploy
  -> AIHub post-deploy monitoring
```

## What AIHub can observe

- Product rejection reasons.
- Missing fields.
- Supplier fulfillment delay.
- Order stuck status.
- AI output rejection rate.
- Chatbot unanswered questions.
- API errors.
- Payment webhook failures.
- Shipping update failures.
- User drop-off in checkout.

## EngineeringInsight fields

- title
- description
- source
- severity
- status
- evidence
- suggestedFix
- codexBrief
- githubIssueUrl
- pullRequestUrl

## Codex brief format

```md
# Task: <title>

## Priority
P0/P1/P2

## Area
products/orders/aihub/storefront/admin

## Problem
<Problem statement based on evidence.>

## Evidence
- Metric 1
- Metric 2

## Goal
<Expected improvement.>

## Scope
Allowed:
- path/**

Blocked:
- path/**

## Requirements
- Requirement 1
- Requirement 2

## Acceptance Criteria
- Criteria 1
- Criteria 2

## Safety
- Do not auto-approve products.
- Do not change payment logic unless scoped.
- Do not expose secrets.

## Commands
- npm run typecheck
- npm test
```

## Good tasks for Codex

- Add product completeness score.
- Add missing fields warning card.
- Add forbidden phrase scan to chatbot output.
- Add order stuck admin filter.
- Add tests for order inventory transaction.
- Refactor provider interface.

## Bad tasks for Codex

- Make the platform better.
- Improve UX everywhere.
- Decide the business model.
- Auto-deploy changes.
- Change pricing across all products.

## Human approval required

Always required for:

- PR merge.
- Production deploy.
- Database destructive migration.
- Payment logic changes.
- Supplier approval logic.
- AI guardrail removal.
