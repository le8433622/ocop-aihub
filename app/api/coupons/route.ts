import { NextResponse } from 'next/server'
import { createServerSupabaseClient, requireAdmin } from '../../../lib/supabase'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return new Response(JSON.stringify({ error: 'Code required' }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .single()

  if (error || !coupon) {
    return NextResponse.json({ valid: false, error: 'Invalid coupon' })
  }

  if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
    return NextResponse.json({ valid: false, error: 'Coupon expired' })
  }

  if (coupon.max_uses && coupon.current_uses >= coupon.max_uses) {
    return NextResponse.json({ valid: false, error: 'Coupon usage limit reached' })
  }

  return NextResponse.json({
    valid: true,
    discountPercent: coupon.discount_percent,
    discountAmount: coupon.discount_amount,
    minOrderAmount: coupon.min_order_amount
  })
}

export async function POST(req: Request) {
  const auth = await requireAdmin(req)
  if (auth instanceof Response) return auth

  const body = await req.json()
  const { code, discountPercent, discountAmount, maxUses, validUntil } = body

  if (!code) {
    return new Response(JSON.stringify({ error: 'Code required' }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('coupons')
    .insert([{
      code: code.toUpperCase(),
      discount_percent: discountPercent ?? 0,
      discount_amount: discountAmount ?? 0,
      max_uses: maxUses ?? null,
      valid_until: validUntil ?? null,
    }])
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ coupon: data })
}