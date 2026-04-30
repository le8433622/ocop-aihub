import { NextResponse } from 'next/server'
import { verifyToken } from './lib/auth'

export function middleware(req: Request) {
  const url = new URL(req.url)
  if (url.pathname.startsWith('/api/auth/login')) {
    return NextResponse.next()
  }
  if (url.pathname.startsWith('/api/')) {
    const authHeader = req.headers.get('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader
    const payload = token && verifyToken(token)
    if (!payload) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }
    // Add user id to headers for downstream handlers
    const res = NextResponse.next()
    res.headers.set('x-user-id', payload.sub)
    return res
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
