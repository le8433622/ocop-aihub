import jwt from 'jsonwebtoken'
import type { NextRequest } from 'next/server'

export const JWT_SECRET = process.env.JWT_SECRET || 'replace_me_securely'

export function generateToken(userId: string, expiresIn = '7d') {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn } as any)
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; iat: number; exp: number }
  } catch {
    return null
  }
}

export function getUserIdFromRequest(req: NextRequest | Request): string | null {
  const auth = req.headers.get('Authorization') ?? ''
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : auth
  if (!token) return null
  const payload = verifyToken(token)
  return payload?.sub ?? null
}
