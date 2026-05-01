import { NextResponse } from 'next/server'
import { createRequestSupabaseClient, getBearerUser } from '../../../../../lib/supabase'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createRequestSupabaseClient(req)

  // Check role for admin bypass
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'ADMIN'

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('status, user_id')
    .eq('id', params.id)
    .single()

  if (orderError || !order) {
    return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })
  }

  // ADMIN can cancel any order, others must own it
  if (!isAdmin && order.user_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  if (order.status !== 'UNPAID' && order.status !== 'PAID') {
    return new Response(JSON.stringify({ error: 'Cannot cancel order in current status' }), { status: 400 })
  }

  const { error: updateError } = await supabase
    .from('orders')
    .update({ status: 'CANCELLED' })
    .eq('id', params.id)

  if (updateError) return new Response(JSON.stringify({ error: updateError.message }), { status: 500 })

  await supabase.from('audit_logs').insert([{
    user_id: user.id,
    action: 'order_cancelled',
    model: 'orders',
    model_id: params.id,
  }])

  return NextResponse.json({ success: true, status: 'CANCELLED' })
}