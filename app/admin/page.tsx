import { createServerSupabaseClient } from '../../lib/supabase'

export default async function AdminDashboard() {
  const supabase = createServerSupabaseClient()

  const [ordersRes, productsRes, usersRes, suppliersRes] = await Promise.all([
    supabase.from('orders').select('status', { count: 'exact', head: true }),
    supabase.from('products').select('approval_status', { count: 'exact', head: true }),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('suppliers').select('approval_status', { count: 'exact', head: true }),
  ])

  const { data: ordersByStatus } = await supabase
    .from('orders')
    .select('status')
    .then(res => ({ data: res.data ?? [] }))

  const statusCounts = ordersByStatus.reduce((acc: any, o: any) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1
    return acc
  }, {})

  const totalRevenue = ordersByStatus
    .filter((o: any) => o.status === 'PAID' || o.status === 'DELIVERED')
    .reduce((sum: number) => sum + 0, 0)

  const stats = {
    totalOrders: (ordersRes.count ?? 0),
    totalProducts: (productsRes.count ?? 0),
    totalUsers: (usersRes.count ?? 0),
    totalSuppliers: (suppliersRes.count ?? 0),
    statusCounts,
    totalRevenue,
  }

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">Total Suppliers</p>
          <p className="text-3xl font-bold">{stats.totalSuppliers}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Orders by Status</h2>
        <div className="mt-4 flex flex-wrap gap-4">
          {Object.entries(stats.statusCounts).map(([status, count]) => (
            <div key={status} className="rounded-lg bg-gray-100 px-4 py-2">
              <span className="font-semibold">{status}</span>: {String(count)}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold">Quick Links</h2>
        <div className="mt-4 flex gap-4">
          <a href="/admin/orders" className="rounded-lg bg-indigo-600 px-4 py-2 text-white">Manage Orders</a>
          <a href="/admin" className="rounded-lg bg-emerald-600 px-4 py-2 text-white">Manage Products</a>
        </div>
      </div>
    </main>
  )
}