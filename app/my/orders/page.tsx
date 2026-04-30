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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const url = filter ? `/api/my/orders?status=${filter}` : '/api/my/orders'
    fetch(url)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
  }, [filter])

  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>

      <div className="mt-6 flex gap-2">
        {['', 'UNPAID', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
          <button
            key={s || 'ALL'}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              filter === s
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{order.id}</p>
              </div>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] ?? 'bg-gray-100 text-gray-800'}`}>
                {order.status}
              </span>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-semibold">{order.total_amount?.toLocaleString()}₫</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {order.items?.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <p className="mb-2 text-sm font-medium text-gray-700">Items</p>
                <ul className="space-y-2">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="flex justify-between text-sm">
                      <span>{item.product?.name ?? 'Product'} x {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()}₫</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {order.payments?.[0] && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
                Payment: {order.payments[0].status} via {order.payments[0].provider ?? '—'}
              </div>
            )}
          </div>
        ))}

        {!orders.length && (
          <p className="mt-8 text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </main>
  )
}
