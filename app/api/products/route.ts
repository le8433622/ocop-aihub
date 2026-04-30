import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../lib/supabase'

export async function GET(req: Request) {
  const supabase = createServerSupabaseClient()
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('q')
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const stars = searchParams.get('stars')

  let query = supabase
    .from('products')
    .select('*')
    .eq('approval_status', 'APPROVED')

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }
  if (minPrice) query = query.gte('price', Number(minPrice))
  if (maxPrice) query = query.lte('price', Number(maxPrice))
  if (stars) query = query.eq('ocop_stars', Number(stars))

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ products: data })
}

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createServerSupabaseClient()
  const body = await req.json()
  const price = Number(body.price)
  if (!body.name || !Number.isFinite(price) || price < 0) {
    return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  }
  const { data, error } = await supabase
    .from('products')
    .insert([{
      name: body.name,
      price,
      description: body.description ?? null,
      supplier_id: body.supplierId ?? null,
      approval_status: 'REVIEW',
      stock_quantity: Number(body.stockQuantity ?? 0),
    }])
    .select()
  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  await supabase.from('audit_logs').insert([{
    user_id: user.id,
    action: 'product_submitted_for_review',
    model: 'products',
    model_id: data?.[0]?.id,
  }])
  return NextResponse.json({ product: data?.[0] })
}
