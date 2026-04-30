'use client'

import { useState, useEffect } from 'react'

export default function ResellerDashboard() {
  const [products, setProducts] = useState<any[]>([])
  const [cart, setCart] = useState<Record<string, number>>({})

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
  }, [])

  const addToCart = (productId: string) => {
    setCart(prev => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }))
  }

  const getCartItems = () => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = products.find(p => p.id === id)
      return { ...product, quantity: qty }
    }).filter(Boolean)
  }

  const total = getCartItems().reduce((sum, item: any) => sum + item.price * item.quantity, 0)

  const submitCheckout = async () => {
    const items = getCartItems().map((item: any) => ({
      productId: item.id,
      quantity: item.quantity
    }))
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    })
    const data = await res.json()
    if (data.checkout) {
      alert(`Checkout created! Order: ${data.checkout.orderId}`)
      setCart({})
    }
  }

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Reseller Dashboard</h1>
      <p className="mt-2 text-gray-600">Browse products and create bulk orders for your storefront.</p>

      <div className="mt-8 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {products.slice(0, 6).map((p) => (
            <div key={p.id} className="rounded-xl border bg-white p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{p.name}</h3>
                <p className="text-sm text-gray-500">{p.stock_quantity} in stock</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{p.price?.toLocaleString()}₫</p>
                <button
                  onClick={() => addToCart(p.id)}
                  className="mt-2 rounded bg-indigo-600 px-3 py-1 text-xs text-white hover:bg-indigo-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold">Cart</h2>
          <div className="mt-4 space-y-2">
            {getCartItems().map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()}₫</span>
              </div>
            ))}
          </div>
          {getCartItems().length > 0 && (
            <>
              <div className="mt-4 border-t pt-4 flex justify-between font-semibold">
                <span>Total</span>
                <span>{total.toLocaleString()}₫</span>
              </div>
              <button
                onClick={submitCheckout}
                className="mt-4 w-full rounded bg-indigo-600 py-2 text-sm text-white hover:bg-indigo-700"
              >
                Checkout
              </button>
            </>
          )}
          {getCartItems().length === 0 && (
            <p className="mt-4 text-sm text-gray-500">Cart is empty</p>
          )}
        </div>
      </div>
    </main>
  )
}
