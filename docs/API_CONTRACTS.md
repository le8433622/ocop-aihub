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
  - Input: { name: string, price: number, description?: string }
  - Output: { product: { id, name, price, description } }
  - Errors: 400 Bad Request, 401 Unauthorized
