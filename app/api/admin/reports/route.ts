import { NextResponse } from 'next/server'
import { createServerSupabaseClient, requireAdmin } from '../../../../lib/supabase'

export async function GET(req: Request) {
  const auth = await requireAdmin(req)
  if (auth instanceof Response) return auth

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'orders'
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const format = searchParams.get('format') || 'json'

  const supabase = createServerSupabaseClient()
  let data: any[] = []
  let headers: string[] = []

  if (type === 'orders') {
    let query = supabase
      .from('orders')
      .select('id, status, total_amount, created_at, user:user_id(email)')
      .order('created_at', { ascending: false })

    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    const { data: orders } = await query
    data = (orders ?? []).map((o: any) => ({
      id: o.id,
      status: o.status,
      total: o.total_amount,
      date: o.created_at,
      customer: o.user?.email ?? 'N/A'
    }))
    headers = ['ID', 'Status', 'Total', 'Date', 'Customer']
  } else if (type === 'products') {
    const { data: products } = await supabase
      .from('products')
      .select('id, name, price, stock_quantity, approval_status, created_at')
      .order('created_at', { ascending: false })

    data = (products ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      stock: p.stock_quantity,
      status: p.approval_status,
      date: p.created_at
    }))
    headers = ['ID', 'Name', 'Price', 'Stock', 'Status', 'Date']
  } else if (type === 'revenue') {
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, status, created_at')
      .in('status', ['PAID', 'DELIVERED'])

    const total = (orders ?? []).reduce((sum, o: any) => sum + (o.total_amount ?? 0), 0)
    const count = orders?.length ?? 0

    return NextResponse.json({
      summary: { totalRevenue: total, orderCount: count, avgOrderValue: count > 0 ? total / count : 0 }
    })
  }

  if (format === 'csv') {
    const csv = [headers.join(','), ...data.map((row: any) => Object.values(row).join(','))].join('\n')
    return new Response(csv, {
      headers: { 'Content-Type': 'text/csv', 'Content-Disposition': `attachment; filename=${type}-export.csv` }
    })
  }

  return NextResponse.json({ headers, data })
}