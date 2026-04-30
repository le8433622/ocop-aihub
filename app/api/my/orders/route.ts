import { createServerSupabaseClient, getBearerUser } from '../../../../lib/supabase'

export async function GET(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

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
      payments ( id, status, provider, amount ),
      items:order_items (
        id,
        quantity,
        price,
        product:product_id ( id, name, price )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return new Response(JSON.stringify({ orders: data ?? [] }), { status: 200 })
}
