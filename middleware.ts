import { NextResponse } from 'next/server'

export function middleware(req: Request) {
  // Route handlers perform Supabase token validation server-side where service clients are available.
  // Keeping middleware non-blocking avoids rejecting valid Supabase access tokens with local JWT rules.
  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
