import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../lib/supabase'

export async function GET(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from('orders').select('*').eq('user_id', user.id)
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ orders: data })
}

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createServerSupabaseClient()
  const body = await req.json()
  const totalAmount = Number(body.totalAmount)
  if (!Number.isFinite(totalAmount) || totalAmount < 0) return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  const { data, error } = await supabase
    .from('orders')
    .insert([{ user_id: user.id, status: 'UNPAID', total_amount: totalAmount }])
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  await supabase.from('audit_logs').insert([{ user_id: user.id, action: 'order_created', model: 'orders', model_id: data?.[0]?.id }])
  return NextResponse.json({ order: data?.[0] })
}
