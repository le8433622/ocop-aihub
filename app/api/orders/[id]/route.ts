import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../../lib/supabase'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getBearerUser(req)

  // Allow public tracking with order ID only
  if (!user) {
    const supabase = createServerSupabaseClient()
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })
    return NextResponse.json({ order })
  }

  // Authenticated user - check role
  const supabase = createServerSupabaseClient()
  const { data: profile } = await supabase.from('user_profiles').select('role').eq('id', user.id).single()
  const role = profile?.role

  let query = supabase.from('orders').select('*').eq('id', params.id)
  
  // ADMIN can view any order, others must own it
  if (role !== 'ADMIN') {
    query = query.eq('user_id', user.id)
  }

  const { data: order, error } = await query.single()

  if (error || !order) return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 })
  return NextResponse.json({ order })
}