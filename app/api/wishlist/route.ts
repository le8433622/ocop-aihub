import { NextResponse } from 'next/server'
import { createServerSupabaseClient, requireCustomer } from '../../../lib/supabase'

export async function GET(req: Request) {
  const auth = await requireCustomer(req)
  if (auth instanceof Response) return auth
  const { user } = auth

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('wishlists')
    .select('*, product:products(*)')
    .eq('user_id', user.id)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ wishlist: data ?? [] })
}

export async function POST(req: Request) {
  const auth = await requireCustomer(req)
  if (auth instanceof Response) return auth
  const { user } = auth

  const { productId } = await req.json()
  if (!productId) return new Response(JSON.stringify({ error: 'productId required' }), { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('wishlists')
    .insert([{ user_id: user.id, product_id: productId }])
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ item: data })
}

export async function DELETE(req: Request) {
  const auth = await requireCustomer(req)
  if (auth instanceof Response) return auth
  const { user } = auth

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')
  if (!productId) return new Response(JSON.stringify({ error: 'productId required' }), { status: 400 })

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ success: true })
}