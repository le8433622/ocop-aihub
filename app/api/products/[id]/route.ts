import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('products')
    .select('*, supplier:suppliers(id, name)')
    .eq('id', params.id)
    .single()

  if (error || !data) return new Response(JSON.stringify({ error: 'Product not found' }), { status: 404 })
  return NextResponse.json({ product: data })
}