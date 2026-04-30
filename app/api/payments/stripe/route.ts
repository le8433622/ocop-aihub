import { NextResponse } from 'next/server'
import { createRequestSupabaseClient, getBearerUser } from '../../../../lib/supabase'

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const { orderId, amount } = body

  if (!orderId || !amount) {
    return new Response(JSON.stringify({ error: 'Missing orderId or amount' }), { status: 400 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 503 })
  }

  const supabase = createRequestSupabaseClient(req)

  const { data: order } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', orderId)
    .single()

  if (!order || order.status !== 'UNPAID') {
    return new Response(JSON.stringify({ error: 'Invalid order' }), { status: 400 })
  }

  const stripe = require('stripe')(stripeKey)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'vnd',
        product_data: { name: `Order ${orderId.slice(0, 8)}` },
        unit_amount: Math.round(amount * 100),
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/my/orders?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/my/orders?cancelled=true`,
    metadata: { orderId },
  })

  await supabase.from('audit_logs').insert([{
    user_id: user.id,
    action: 'stripe_checkout_created',
    model: 'orders',
    model_id: orderId,
    metadata: { sessionId: session.id }
  }])

  return NextResponse.json({ url: session.url, sessionId: session.id })
}