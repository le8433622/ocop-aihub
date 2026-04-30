# API Contracts

## General rules

- All write endpoints require auth unless explicitly public checkout/chat.
- Every write endpoint validates input.
- Every business-changing endpoint checks permissions.
- Every critical action writes audit log.
- Public endpoints must be rate limited where needed.

## Products

### POST /api/products

Creates supplier product.

Required:

- supplierId
- name
- description
- basePrice
- suggestedPrice

Rules:

- Supplier must exist.
- Supplier must be `APPROVED`.
- New product status is `PENDING_REVIEW` or `DRAFT` depending flow.
- Product is not public until `APPROVED`.

Response:

```json
{
  "product": {
    "id": "...",
    "name": "...",
    "status": "PENDING_REVIEW"
  }
}
```

### PATCH /api/products/:id

Updates product.

Rules:

- Admin can update any product.
- Supplier can update only own product.
- If approved product is materially changed, status may return to `PENDING_REVIEW`.

## Storefronts

### POST /api/storefronts

Creates reseller storefront.

Required:

- resellerId
- name

Rules:

- Reseller must exist.
- Slug must be unique.
- Initial status should be `DRAFT`.

### POST /api/storefronts/products

Adds approved product to storefront.

Required:

- storefrontId
- productId
- sellPrice

Rules:

- Reseller must own storefront.
- Product must be `APPROVED`.
- sellPrice must not be lower than basePrice.

## Orders

### POST /api/orders

Creates public order.

Required:

- storefrontId
- customerName
- customerPhone
- shippingAddress
- items[]

Rules:

- Storefront must be `ACTIVE`.
- Product must be visible in storefront.
- Product must be approved.
- Inventory must be checked.
- Inventory decrement must happen in database transaction.
- Order status starts `PENDING_PAYMENT`.
- Payment status starts `UNPAID`.

## Payments

### POST /api/payments

Creates payment request for an order.

Required:

- orderId

Rules:

- Order must exist.
- Order must not already be paid.
- Provider must be server-side.

### POST /api/payments/webhook

Receives provider webhook.

Rules:

- Verify signature.
- Idempotent.
- Update payment status.
- Update order status if paid.
- Never trust frontend payment status.

## Shipping

### POST /api/shipping

Creates shipment or manual tracking.

Rules:

- Order must be paid or processing.
- Supplier/admin permissions required.

## AIHub

### POST /api/ai/product-description

Creates AI draft for product description.

Required:

- productId

Rules:

- Admin can run any product.
- Supplier can run only own product.
- Must rate limit.
- Must create `AiGeneration`.
- Must create draft/review record if public content.

### POST /api/ai/product-validation

Validates product completeness.

Required:

- productId

Rules:

- AI result is advisory.
- AI cannot approve product.

### POST /api/ai/gift-combo

Generates gift combos for storefront.

Required:

- storefrontId
- occasion
- budgetMin
- budgetMax

Rules:

- Reseller must own storefront.
- AI can only choose products already in storefront.

### POST /api/ai/storefront-chat

Public chat endpoint.

Required:

- storefrontId
- message

Rules:

- Rate limit by IP/session.
- Answer only from storefront catalog.
- Do not invent claims.

## Engineering insights

### POST /api/aihub/codex-briefs

Creates Codex-ready engineering brief from insight.

Rules:

- Admin only.
- Must not directly create code changes.
- Stores brief in `EngineeringInsight`.
