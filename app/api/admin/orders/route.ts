import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

export async function GET(req: Request) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const userId = searchParams.get('userId')

  let query = supabase
    .from('orders')
    .select(`
      id,
      status,
      total_amount,
      shipping_name,
      shipping_phone,
      shipping_addr,
      created_at,
      user:user_id ( id, email, name ),
      payments ( id, status, provider, amount ),
      items:order_items ( id, quantity, price, product:product_id ( id, name ) )
    `)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (userId) query = query.eq('user_id', userId)

  const { data, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ orders: data })
}
