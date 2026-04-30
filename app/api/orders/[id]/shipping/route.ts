import { NextResponse } from 'next/server'
import { createRequestSupabaseClient, getBearerUser } from '../../../../../lib/supabase'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const { shippingName, shippingPhone, shippingAddr } = body

  if (!shippingName || !shippingPhone || !shippingAddr) {
    return new Response(JSON.stringify({ error: 'shippingName, shippingPhone, shippingAddr are required' }), { status: 400 })
  }

  const supabase = createRequestSupabaseClient(req)
  const { data, error } = await supabase.rpc('update_order_shipping', {
    p_order_id: params.id,
    p_shipping_name: shippingName,
    p_shipping_phone: shippingPhone,
    p_shipping_addr: shippingAddr,
  })

  if (error) {
    const status = error.message.includes('UNAUTHORIZED') ? 401
      : error.message.includes('ORDER_NOT_FOUND') ? 404
      : error.message.includes('FORBIDDEN') ? 403
      : 500
    return new Response(JSON.stringify({ error: error.message }), { status })
  }

  return NextResponse.json({ result: data })
}
