import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return new Response(JSON.stringify({ error: 'Webhook not configured' }), { status: 500 })
  }

  let event
  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const orderId = session.metadata?.orderId

    if (orderId) {
      await supabase.rpc('confirm_payment', {
        p_order_id: orderId,
        p_provider: 'STRIPE',
        p_provider_reference: session.payment_intent,
      })

      await supabase.from('audit_logs').insert([{
        action: 'stripe_payment_completed',
        model: 'orders',
        model_id: orderId,
        metadata: { sessionId: session.id, paymentIntent: session.payment_intent }
      }])
    }
  }

  return NextResponse.json({ received: true })
}