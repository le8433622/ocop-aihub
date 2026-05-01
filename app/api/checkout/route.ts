import { NextResponse } from 'next/server'
import { createRequestSupabaseClient, requireCustomerOrReseller } from '../../../lib/supabase'

type CheckoutItem = {
  productId: string
  quantity: number
}

export async function POST(req: Request) {
  const auth = await requireCustomerOrReseller(req)
  if (auth instanceof Response) return auth
  const { user } = auth

  const body = await req.json()
  const items = body.items as CheckoutItem[] | undefined
  if (!Array.isArray(items) || items.length === 0) {
    return new Response(JSON.stringify({ error: 'Checkout requires at least one item' }), { status: 400 })
  }

  const invalidItem = items.find((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0)
  if (invalidItem) {
    return new Response(JSON.stringify({ error: 'Invalid checkout item' }), { status: 400 })
  }

  const supabase = createRequestSupabaseClient(req)
  const { data, error } = await supabase.rpc('create_checkout_order', { p_items: items })

  if (error) {
    const code = error.message.includes('INSUFFICIENT_STOCK') ? 409 : 400
    return new Response(JSON.stringify({ error: error.message }), { status: code })
  }

  return NextResponse.json({ checkout: data })
}
