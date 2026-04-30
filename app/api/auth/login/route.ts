import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

type Body = {
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body: Body = await req.json()
    if (!body.email || !body.password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 })
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    })
    if (error || !data.user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }
    const token = data.session?.access_token ?? ''
    const user = data.user
    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.user_metadata?.name ?? '' },
    })
  } catch (e: any) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Server error', detail: e.message }), { status: 500 })
  }
}
