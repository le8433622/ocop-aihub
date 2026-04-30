import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  const supabase = createServerSupabaseClient()
  let query = supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      user:user_id ( name )
    `)
    .order('created_at', { ascending: false })

  if (productId) query = query.eq('product_id', productId)

  const { data, error } = await query
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ reviews: data ?? [] })
}

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const { productId, rating, comment } = body

  if (!productId || !rating || rating < 1 || rating > 5) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('reviews')
    .insert([{
      user_id: user.id,
      product_id: productId,
      rating,
      comment: comment ?? null,
    }])
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  await supabase.from('audit_logs').insert([{
    user_id: user.id,
    action: 'review_created',
    model: 'reviews',
    model_id: data.id,
  }])

  return NextResponse.json({ review: data })
}