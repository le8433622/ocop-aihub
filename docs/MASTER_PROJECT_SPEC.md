# Master Project Spec: OCOP AIHub White-Label Commerce Platform

## 1. Vision

Build a white-label commerce platform for OCOP products and Vietnamese local specialties where suppliers, resellers, brands, KOLs, and corporate gift sellers can create storefronts, sell real products, manage orders, and use AIHub to improve operations.

This is not only a store. It is:

- OCOP commerce infrastructure.
- Supplier onboarding and product approval system.
- Reseller white-label storefront builder.
- Corporate gift and combo engine.
- Order, payment, shipping, commission, and settlement platform.
- AIHub runtime for content, validation, marketing, insights, and Codex briefs.

## 2. Users

### Admin

Controls platform operations:

- Approves suppliers.
- Approves products.
- Verifies OCOP certificate documents.
- Manages orders, payments, shipping, commissions.
- Reviews AI-generated content.
- Reviews engineering insights and Codex briefs.

### Supplier

OCOP owner, cooperative, small producer, business, or manufacturer:

- Registers supplier profile.
- Uploads products and certificates.
- Updates inventory.
- Processes order items.
- Adds tracking codes.

### Reseller

Agent, KOL, corporate gift seller, local page owner:

- Creates storefront.
- Selects approved products.
- Sets selling price.
- Creates gift combos.
- Generates marketing content.
- Tracks commission/profit.

### Customer

Final buyer:

- Browses storefront.
- Reads product details, origin, OCOP info.
- Places order.
- Tracks shipping.
- Uses storefront chat assistant.

### AIHub

Internal AI runtime:

- Creates product descriptions.
- Validates product completeness.
- Creates marketing content.
- Recommends gift combos.
- Runs storefront chat assistant.
- Analyzes runtime data.
- Generates engineering briefs for Codex.

### Codex

Coding agent:

- Reads repo docs and AGENTS.md.
- Implements specific tasks.
- Creates branch and PR.
- Runs tests.
- Does not merge production.

## 3. MVP Scope

Build first:

- Product catalog from approved suppliers.
- Reseller storefront builder.
- Public storefront and checkout.
- Manual payment confirmation.
- Manual shipping tracking.
- Admin approval dashboard.
- AIHub product description and product validation.
- AIHub marketing post and gift combo.

Do not build first:

- Native mobile app.
- Full warehouse system.
- Cross-border export.
- Marketplace ads.
- Shopee/Lazada/TikTok sync.
- Auto settlement.
- Autonomous code deployment.

## 4. Core principles

- Production-first, not demo-first.
- Database-first, not hard-coded UI.
- AI assists, but does not decide critical operations.
- Codex writes PRs, humans approve.
- Order/payment/shipping must survive AIHub failure.
- Every sensitive action must be auditable.

## 5. System modules

1. Auth and roles.
2. Supplier management.
3. Product management.
4. OCOP certificate management.
5. Storefront builder.
6. Storefront product pricing.
7. Public storefront.
8. Checkout and order creation.
9. Payment provider layer.
10. Shipping provider layer.
11. Commission calculation.
12. Admin operations.
13. AIHub runtime.
14. Engineering insights and Codex briefs.
15. Observability and audit logs.

## 6. Recommended first business niche

Start with dry, stable, easy-to-ship products:

- Tea, coffee, cacao.
- Honey, nuts, dried fruits.
- Fish sauce, spices, sauces.
- Herbal products without medical claims.
- Small handicraft gifts.

Avoid initially:

- Fresh goods.
- Frozen goods.
- Alcohol.
- Medical/health treatment claims.
- Oversized goods.

## 7. Monetization

- Supplier monthly fee.
- Reseller monthly fee.
- Setup fee for storefront.
- Commission per order.
- Product markup.
- Corporate gift packaging fee.
- AI content usage fee for paid plans.

## 8. Build order

1. Commerce core.
2. Dashboard and approval.
3. Manual payment/shipping.
4. AIHub content/validation.
5. AIHub marketing/combo/chat.
6. Engineering insights.
7. Codex workflow.
8. Production hardening.
