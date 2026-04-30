# Operations Runbook

## Daily checks

Admin/operator should check:

1. New supplier registrations.
2. Products pending review.
3. Orders stuck in `PENDING_PAYMENT`.
4. Paid orders not processed by supplier.
5. Orders with shipping delay.
6. Payment webhook failures.
7. AIHub failed generations.
8. AI content pending review.
9. Customer chat questions with no good answer.
10. Token usage and AI cost trend.

## Incident: AIHub unavailable

Symptoms:

- AI buttons fail.
- Chatbot fails.
- AI generation stuck.

Actions:

1. Disable public chat if needed.
2. Keep storefront checkout active.
3. Check `AiGeneration` failed logs.
4. Check NVIDIA API key/model/quota.
5. Check Vercel logs.
6. Roll back recent AIHub deploy if needed.
7. Mark incident note in admin dashboard.

Expected response to user:

```json
{
  "error": "AI_SERVICE_UNAVAILABLE",
  "message": "Tinh nang AI dang tam thoi khong kha dung. Vui long thu lai sau."
}
```

## Incident: Payment webhook failure

Actions:

1. Verify provider dashboard.
2. Check webhook signature failure logs.
3. Confirm whether money was received.
4. If paid, admin can mark payment manually with audit log.
5. Do not trust customer screenshot alone.
6. Add provider transaction ID to payment record.

## Incident: Inventory mismatch

Actions:

1. Stop selling affected product if needed.
2. Check recent orders and inventory decrements.
3. Check transaction logs.
4. Supplier confirms real stock.
5. Admin corrects inventory with audit reason.

## Incident: AI generated unsafe content

Actions:

1. Reject `AiContentDraft`.
2. Record rejection reason.
3. Do not publish output.
4. Add phrase/pattern to forbidden scanner.
5. Update prompt if repeated.
6. Ask supplier to improve source product data if AI lacked context.

## Incident: Codex PR breaks tests

Actions:

1. Do not merge.
2. Comment failing command and logs.
3. Ask Codex to fix within same branch.
4. If schema issue, check migration.
5. If broad unrelated changes, close and split task smaller.

## Weekly review

- Top rejected products and reasons.
- Top suppliers by delay.
- Top reseller storefronts.
- Top AI task usage.
- Failed AI task patterns.
- Conversion rate from storefront visit to order.
- Product categories with demand.
- Engineering insights generated and closed.
