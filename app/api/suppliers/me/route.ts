import { NextResponse } from 'next/server'
import { createServerSupabaseClient, requireSupplier } from '../../../../lib/supabase'

export async function GET(req: Request) {
  const auth = await requireSupplier(req)
  if (auth instanceof Response) return auth
  const { user } = auth

  const supabase = createServerSupabaseClient()

  const { data: supplier } = await supabase
    .from('suppliers')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!supplier) return new Response(JSON.stringify({ error: 'Supplier not found' }), { status: 404 })

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('supplier_id', supplier.id)

  const { data: orderItems } = await supabase
    .from('order_items')
    .select(`
      order:order_id ( id, status, total_amount, created_at ),
      product:product_id ( supplier_id )
    `)
    .eq('product.supplier_id', supplier.id)

  const orders = (orderItems ?? []).map((oi: any) => oi.order)

  return NextResponse.json({ products: products ?? [], orders })
}
