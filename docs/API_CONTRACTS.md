## API Contracts (Skeleton)

- POST /api/auth/login
  - Input: { email: string, password: string }
  - Output: { token: string, user: { id, email, name } }
  - Errors: 401 Unauthorized

- GET /api/products
  - Headers: Authorization: Bearer <token>
  - Output: { products: [ { id, name, description, price } ] }
  - Errors: 401 Unauthorized

- POST /api/products
  - Headers: Authorization: Bearer <token>
  - Input: { name: string, price: number, description?: string, supplierId?: string, stockQuantity?: number }
  - Output: { product: { id, name, price, description, approval_status } }
  - Behavior: Creates products in REVIEW status; admin approval is required before public catalog visibility.
  - Errors: 400 Bad Request, 401 Unauthorized

- POST /api/admin/products/:id/approval
  - Headers: Authorization: Bearer <token>
  - Input: { status: "APPROVED" | "REJECTED" | "ARCHIVED", reason?: string }
  - Output: { product }
  - Behavior: Updates product review status and writes AuditLog.
  - Errors: 400 Bad Request, 401 Unauthorized

- POST /api/aihub/generate
  - Headers: Authorization: Bearer <token>
  - Input: { taskType?: string, model?: string, prompt: string }
  - Output: { ok: true, response: string }
  - Behavior: Requires AI provider configuration, creates AiGeneration lifecycle log, blocks unsafe prompts.
  - Errors: 400 Bad Request, 401 Unauthorized, 503 AI provider is not configured

- POST /api/checkout
  - Headers: Authorization: Bearer <Supabase access token>
  - Input: { items: [ { productId: string, quantity: number } ] }
  - Output: { checkout: { orderId, status, paymentStatus, totalAmount } }
  - Behavior: Runs inside database transaction; product must be APPROVED; stock is checked and decremented; order, order_items, payment, and audit log are created.
  - Errors: 400 Bad Request, 401 Unauthorized, 409 Insufficient stock

- POST /api/orders/[id]/confirm-payment
  - Headers: Authorization: Bearer <Supabase access token>
  - Input: { provider: string, providerReference: string }
  - Output: { result: { orderId, status, paymentStatus } }
  - Behavior: Confirms payment for UNPAID order; updates payment to PAID; updates order to PAID; writes audit log.
  - Errors: 401 Unauthorized, 404 Order not found, 400 Invalid order status, 409 Payment already processed

- PATCH /api/orders/[id]/shipping
  - Headers: Authorization: Bearer <Supabase access token>
  - Input: { shippingName: string, shippingPhone: string, shippingAddr: string }
  - Output: { result: { orderId, shippingName } }
  - Behavior: Updates order shipping information; only order owner can update; writes audit log.
  - Errors: 401 Unauthorized, 404 Order not found, 403 Forbidden

- PATCH /api/orders/[id]/status
  - Headers: Authorization: Bearer <Supabase access token>
  - Input: { status: string } (valid: PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUND_REVIEW, REFUNDED)
  - Output: { result: { orderId, status } }
  - Behavior: Updates order status; writes audit log with old and new status.
  - Errors: 401 Unauthorized, 404 Order not found, 400 Invalid status

- GET /api/admin/orders
  - Headers: Authorization: Bearer <Supabase access token>
  - Query: ?status=PAID&userId=xxx
  - Output: { orders: [...] }
  - Behavior: Admin view of all orders with user, payment, and item details; supports filtering by status and userId.
