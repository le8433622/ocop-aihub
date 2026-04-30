import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../lib/supabase'

export async function GET(req: Request) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from('suppliers').select('*').order('created_at', { ascending: false })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ suppliers: data })
}

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createServerSupabaseClient()
  const body = await req.json()
  if (!body.name) return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  const { data, error } = await supabase
    .from('suppliers')
    .insert([{ name: body.name, user_id: user.id, approval_status: 'REVIEW' }])
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  await supabase.from('audit_logs').insert([{ user_id: user.id, action: 'supplier_submitted_for_review', model: 'suppliers', model_id: data?.[0]?.id }])
  return NextResponse.json({ supplier: data?.[0] })
}
