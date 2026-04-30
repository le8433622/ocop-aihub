import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../../lib/supabase'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getBearerUser(req)
  if (!user) {
    // Allow public tracking with order ID only - check by order ID directly
    const supabase = createServerSupabaseClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })
    return NextResponse.json({ order })
  }

  // Authenticated user - verify ownership
  const supabase = createServerSupabaseClient()
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single()

  if (error || !order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })
  return NextResponse.json({ order })
}