import { NextResponse } from 'next/server'
import { verifyToken } from '../lib/auth'

export function middleware(req: Request) {
  const url = new URL(req.url)
  // Skip login endpoint
  if (url.pathname.startsWith('/api/auth/login')) {
    return NextResponse.next()
  }
  // Protect API routes
  if (url.pathname.startsWith('/api/')) {
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
    const valid = token && verifyToken(token)
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
