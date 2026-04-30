import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../lib/supabase'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert([{ email }])

  if (error && error.code !== '23505') {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Subscribed successfully!' })
}

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { count } = await supabase
    .from('newsletter_subscribers')
    .select('*', { count: 'exact', head: true })

  return NextResponse.json({ subscribers: count ?? 0 })
}