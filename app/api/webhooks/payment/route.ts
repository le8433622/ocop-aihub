import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

export async function POST(req: Request) {
  // Verify webhook signature here (e.g., from Stripe, PayPal, etc.)
  // For now, we accept any POST to this endpoint

  const body = await req.json()
  const { orderId, provider, providerReference, status } = body

  if (!orderId || !provider || !providerReference) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()

  if (status === 'PAID' || status === 'SUCCESS') {
    const { error } = await supabase.rpc('confirm_payment', {
      p_order_id: orderId,
      p_provider: provider,
      p_provider_reference: providerReference,
    })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return NextResponse.json({ success: true, status: 'PAID' })
  }

  return NextResponse.json({ success: true, status: 'RECEIVED' })
}
