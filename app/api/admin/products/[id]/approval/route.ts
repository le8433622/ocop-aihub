import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../../../../lib/supabase'

const allowedStatuses = new Set(['APPROVED', 'REJECTED', 'ARCHIVED'])

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  if (!allowedStatuses.has(body.status)) {
    return new Response(JSON.stringify({ error: 'Invalid approval status' }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .update({ approval_status: body.status, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  await supabase.from('audit_logs').insert([{
    user_id: user.id,
    action: `product_${String(body.status).toLowerCase()}`,
    model: 'products',
    model_id: params.id,
    metadata: { reason: body.reason ?? null },
  }])

  return NextResponse.json({ product: data })
}
