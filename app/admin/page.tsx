import { createServerSupabaseClient } from '../../lib/supabase'

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient()
  const users = await supabase.from('users').select('*', { count: 'exact' })
  const products = await supabase.from('products').select('*', { count: 'exact' })
  const orders = await supabase.from('orders').select('*', { count: 'exact' })
  const audit = await supabase.from('audit_logs').select('action, created_at').order('created_at', { ascending: false }).limit(20)
  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h2>Users</h2>
          <p className="text-xl">{users.count ?? 0}</p>
        </div>
        <div className="p-4 border rounded">
          <h2>Products</h2>
          <p className="text-xl">{products.count ?? 0}</p>
        </div>
        <div className="p-4 border rounded">
          <h2>Orders</h2>
          <p className="text-xl">{orders.count ?? 0}</p>
        </div>
      </div>
      <h2 className="mt-8">Audit Log Actions</h2>
      <ul>
        {audit.data?.map((row: any) => (
          <li key={`${row.action}-${row.created_at}`}>{row.action}</li>
        ))}
      </ul>
    </main>
  )
}
