import { NextResponse } from 'next/server'
import { createServerSupabaseClient, requireAdmin } from '../../../../lib/supabase'

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if (auth instanceof Response) return auth

  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const userId = searchParams.get('userId')

  let query = supabase
    .from('orders')
    .select(`
      id,
      user_id,
      status,
      total_amount,
      shipping_name,
      shipping_phone,
      shipping_addr,
      created_at
    `)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)
  if (userId) query = query.eq('user_id', userId)

  const { data: orders, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  if (orders && orders.length > 0) {
    const userIds = [...new Set(orders.map((o: any) => o.user_id).filter(Boolean))]
    const { data: users } = await supabase
      .from('users')
      .select('id, email, name')
      .in('id', userIds)

    const userMap = new Map(users?.map((u: any) => [u.id, u]) ?? [])
    const ordersWithUser = orders.map((o: any) => ({
      ...o,
      user: userMap.get(o.user_id) ?? null,
      user_id: undefined,
    }))
    return NextResponse.json({ orders: ordersWithUser })
  }

  return NextResponse.json({ orders: orders ?? [] })
}
