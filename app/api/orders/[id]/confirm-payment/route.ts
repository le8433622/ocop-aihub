import { NextResponse } from 'next/server'
import { createRequestSupabaseClient, getBearerUser } from '../../../../../lib/supabase'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const { provider, providerReference } = body

  if (!provider || !providerReference) {
    return new Response(JSON.stringify({ error: 'Provider and providerReference are required' }), { status: 400 })
  }

  const supabase = createRequestSupabaseClient(req)
  const { data, error } = await supabase.rpc('confirm_payment', {
    p_order_id: params.id,
    p_provider: provider,
    p_provider_reference: providerReference,
  })

  if (error) {
    const status = error.message.includes('UNAUTHORIZED') ? 401
      : error.message.includes('ORDER_NOT_FOUND') ? 404
      : error.message.includes('INVALID_ORDER_STATUS') ? 400
      : error.message.includes('PAYMENT_ALREADY_PROCESSED') ? 409
      : 500
    return new Response(JSON.stringify({ error: error.message }), { status })
  }

  return NextResponse.json({ result: data })
}
