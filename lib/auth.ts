import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET || 'change-me-securely'

export function generateToken(userId: string, expiresIn = '7d') {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; iat: number; exp: number }
  } catch {
    return null
  }
}

export function getUserIdFromRequest(req: Request): string | null {
  const auth = req.headers.get('Authorization') ?? ''
  const match = auth.match(/^Bearer\s+(.*)$/)
  const token = match?.[1]
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.sub ?? null
}
