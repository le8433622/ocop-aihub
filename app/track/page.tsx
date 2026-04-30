'use client'

import { useState } from 'react'

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const trackOrder = async () => {
    setLoading(true)
    const res = await fetch(`/api/orders/${orderId}`)
    const data = await res.json()
    setOrder(data.order)
    setLoading(false)
  }

  const statusSteps = ['UNPAID', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED']
  const currentIndex = order ? statusSteps.indexOf(order.status) : -1

  return (
    <main className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>

      <div className="mt-8 flex gap-4">
        <input
          type="text"
          value={orderId}
          onChange={e => setOrderId(e.target.value)}
          placeholder="Enter order ID"
          className="flex-1 rounded-lg border px-4 py-2"
        />
        <button onClick={trackOrder} disabled={loading} className="rounded-lg bg-indigo-600 px-6 py-2 text-white disabled:opacity-50">
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </div>

      {order && (
        <div className="mt-8 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-mono text-sm">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="font-bold text-lg">{order.total_amount?.toLocaleString()}₫</p>
            </div>
          </div>

          <div className="flex justify-between items-center relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -z-10" />
            {statusSteps.map((status, i) => (
              <div key={status} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i <= currentIndex ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {i < currentIndex ? '✓' : i + 1}
                </div>
                <span className="text-xs mt-2 text-gray-600">{status}</span>
              </div>
            ))}
          </div>

          {order.shipping_addr && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-gray-500">Shipping Address</p>
              <p className="mt-1">{order.shipping_name}<br/>{order.shipping_phone}<br/>{order.shipping_addr}</p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}