'use client'

import { useState, useEffect } from 'react'

const statusColors: Record<string, string> = {
  UNPAID: 'bg-yellow-100 text-yellow-800',
  PAID: 'bg-green-100 text-green-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  REFUND_REVIEW: 'bg-orange-100 text-orange-800',
  REFUNDED: 'bg-red-100 text-red-800',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
  }, [])

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    location.reload()
  }

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
      <p className="mt-2 text-gray-600">Admin view of all orders with status management.</p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{order.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="text-sm">{order.user?.name ?? order.user?.email ?? '—'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">{order.total_amount?.toLocaleString()}₫</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                  {order.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <label htmlFor={`status-${order.id}`} className="text-sm text-gray-700">Update status:</label>
              <select
                id={`status-${order.id}`}
                className="rounded border px-2 py-1 text-sm"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) updateStatus(order.id, e.target.value)
                }}
              >
                <option value="" disabled>Select…</option>
                <option value="PAID">PAID</option>
                <option value="PROCESSING">PROCESSING</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="REFUND_REVIEW">REFUND_REVIEW</option>
                <option value="REFUNDED">REFUNDED</option>
              </select>
            </div>
          </div>
        ))}

        {!orders.length && (
          <p className="mt-8 text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </main>
  )
}
