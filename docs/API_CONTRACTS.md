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
