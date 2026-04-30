# AIHub Runtime

## Purpose

AIHub is the AI runtime layer of the OCOP platform. It supports suppliers, resellers, customers, admins, and the engineering process.

AIHub must be built from day one as production infrastructure, not as a decorative chatbot.

## Responsibilities

- Product content generation.
- Product data validation.
- Marketing post generation.
- Gift combo recommendation.
- Storefront chat assistant.
- AI usage logging.
- Cost and rate control.
- Safety scanning.
- Runtime insight generation.
- Codex brief creation.

## Non-responsibilities

AIHub must not:

- Approve OCOP certificates.
- Confirm payments.
- Refund orders.
- Change product prices automatically.
- Publish public content without review.
- Merge code or deploy production.

## Architecture

```text
Frontend
  -> /api/ai/*
  -> permission check
  -> rate limit
  -> AiGeneration RUNNING
  -> AiTaskRunner
  -> AiProvider
  -> NVIDIA API/NIM
  -> parse output
  -> safety scan
  -> draft/review/publish
  -> AiGeneration SUCCEEDED/FAILED
```

## Core files

```text
lib/ai/core/AiProvider.ts
lib/ai/core/AiTaskRunner.ts
lib/ai/core/AiRateLimiter.ts
lib/ai/core/AiOutputValidator.ts
lib/ai/providers/NvidiaProvider.ts
lib/ai/providers/MockProviderForTest.ts
lib/ai/tasks/ProductDescriptionTask.ts
lib/ai/tasks/ProductValidationTask.ts
lib/ai/tasks/GiftComboTask.ts
lib/ai/tasks/MarketingPostTask.ts
lib/ai/tasks/StorefrontChatTask.ts
lib/ai/safety/forbidden-phrases.ts
```

## AiProvider interface

```ts
export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AiCompletionInput = {
  model?: string;
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
};

export type AiCompletionResult = {
  text: string;
  model: string;
  provider: string;
  usage?: {
    promptTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
  };
  raw?: unknown;
};

export interface AiProvider {
  name: string;
  complete(input: AiCompletionInput): Promise<AiCompletionResult>;
}
```

## NVIDIA provider rules

- API key lives only in server env.
- Never expose `NVIDIA_API_KEY` to client.
- Use env for model name.
- Timeout all AI calls.
- Do not call NVIDIA in CI by default.
- Use mock provider only for automated tests.

## AiGeneration lifecycle

```text
PENDING
  -> RUNNING
  -> SUCCEEDED
  -> FAILED
```

Every AI call must save:

- taskType
- userId if available
- productId/storefrontId if relevant
- input
- output or error
- provider
- model
- token usage

## Public content lifecycle

```text
AI output
  -> AiContentDraft
  -> REVIEW_REQUIRED
  -> APPROVED or REJECTED
  -> PUBLISHED
```

Public content includes:

- Product description.
- Marketing post.
- SEO text.
- Chatbot canned answer if reused.

## Rate limits

Recommended MVP limits:

| Role | Limit |
|---|---:|
| Customer chat | 10 messages / 10 minutes / IP |
| Supplier content generation | 50 / day |
| Reseller marketing generation | 100 / day |
| Admin | 500 / day |

## Safety scanner

Forbidden phrases:

- chua benh
- tri ung thu
- tri tieu duong
- tri huyet ap
- hieu qua 100%
- thay the thuoc
- cam ket khoi benh
- thuoc gia truyen

Use safe language:

- phu hop lam qua tang
- huong vi dac trung
- nguon goc ro rang
- san pham dia phuong
- duoc chon loc

## AIHub health endpoint

`GET /api/ai/health`

Should check configuration only, not call real model.

Response:

```json
{
  "status": "ok",
  "provider": "NVIDIA_NIM",
  "configured": true,
  "model": "nvidia/llama-3.1-nemotron-70b-instruct"
}
```

## AIHub dashboard

Admin page: `/dashboard/admin/aihub`

Shows:

- Requests today.
- Failed requests.
- Token usage.
- Task breakdown.
- Pending drafts.
- Top users.
- Recent errors.
- Current model.
- Public chat enabled/disabled.
- Budget usage.

## Definition of Done for AI feature

- Server-side endpoint.
- Permission check.
- Rate limit.
- AiGeneration log.
- Timeout.
- Output validation.
- Safety scan if public.
- Draft/review if public.
- Fallback if provider fails.
- No secret exposure.
