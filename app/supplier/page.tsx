'use client'

import { useState, useEffect } from 'react'

export default function SupplierDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [tab, setTab] = useState<'products' | 'orders'>('products')

  useEffect(() => {
    fetch('/api/suppliers/me')
      .then(r => r.json())
      .then(d => {
        if (d.products) setProducts(d.products)
        if (d.orders) setOrders(d.orders)
      })
  }, [])

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Supplier Dashboard</h1>

      <div className="mt-6 flex gap-2">
        {(['products', 'orders'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              tab === t
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t === 'products' ? 'My Products' : 'Orders'}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Add New Product</h2>
            <form
              className="mt-4 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const data = {
                  name: (form.elements.namedItem('name') as HTMLInputElement).value,
                  price: Number((form.elements.namedItem('price') as HTMLInputElement).value),
                  description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
                  stockQuantity: Number((form.elements.namedItem('stock') as HTMLInputElement).value),
                }
                await fetch('/api/products', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(data),
                })
                location.reload()
              }}
            >
              <input name="name" placeholder="Product name" required className="w-full rounded border px-3 py-2 text-sm" />
              <input name="price" type="number" placeholder="Price" required className="w-full rounded border px-3 py-2 text-sm" />
              <textarea name="description" placeholder="Description" className="w-full rounded border px-3 py-2 text-sm" />
              <input name="stock" type="number" placeholder="Stock quantity" required className="w-full rounded border px-3 py-2 text-sm" />
              <button type="submit" className="rounded bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700">
                Add Product
              </button>
            </form>
          </div>

          {products.map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-gray-500">{p.approval_status}</p>
                </div>
                <p className="text-lg font-bold">{p.price?.toLocaleString()}₫</p>
              </div>
            </div>
          ))}

          {!products.length && (
            <p className="mt-8 text-center text-gray-500">No products yet.</p>
          )}
        </div>
      )}

      {tab === 'orders' && (
        <div className="mt-8 space-y-4">
          {orders.map((o: any) => (
            <div key={o.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <p className="font-mono text-sm">{o.id}</p>
              <p className="text-sm text-gray-500">{o.status}</p>
              <p className="font-semibold">{o.total_amount?.toLocaleString()}₫</p>
            </div>
          ))}
          {!orders.length && (
            <p className="mt-8 text-center text-gray-500">No orders yet.</p>
          )}
        </div>
      )}
    </main>
  )
}
