import { NextResponse } from 'next/server'
import { createRequestSupabaseClient, getBearerUser } from '../../../../../lib/supabase'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const { status } = body

  if (!status) {
    return new Response(JSON.stringify({ error: 'status is required' }), { status: 400 })
  }

  const supabase = createRequestSupabaseClient(req)
  const { data, error } = await supabase.rpc('update_order_status', {
    p_order_id: params.id,
    p_status: status,
  })

  if (error) {
    const statusCode = error.message.includes('UNAUTHORIZED') ? 401
      : error.message.includes('ORDER_NOT_FOUND') ? 404
      : error.message.includes('INVALID_STATUS') ? 400
      : 500
    return new Response(JSON.stringify({ error: error.message }), { status: statusCode })
  }

  return NextResponse.json({ result: data })
}
