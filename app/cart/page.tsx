'use client'

import { useState, useEffect } from 'react'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch {}
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.id !== id))
    } else {
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
    }
  }

  const remove = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const checkout = async () => {
    const cartItems = items.map(item => ({ productId: item.id, quantity: item.quantity }))
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cartItems })
    })
    const data = await res.json()
    if (data.checkout) {
      setItems([])
      localStorage.removeItem('cart')
      alert(`Order created: ${data.checkout.orderId}`)
    } else {
      alert(data.error || 'Checkout failed')
    }
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Shopping Cart</h1>

      {items.length === 0 ? (
        <p className="mt-8 text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map(item => (
            <div key={item.id} className="rounded-xl border bg-white p-6 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.price.toLocaleString()}₫ each</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-8 h-8 rounded border">-</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 rounded border">+</button>
                </div>
                <p className="w-24 text-right font-semibold">{(item.price * item.quantity).toLocaleString()}₫</p>
                <button onClick={() => remove(item.id)} className="text-red-500 text-sm">Remove</button>
              </div>
            </div>
          ))}

          <div className="rounded-xl border bg-white p-6 shadow-sm flex justify-between items-center">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-2xl font-bold">{total.toLocaleString()}₫</span>
          </div>

          <button
            onClick={checkout}
            className="w-full rounded-lg bg-indigo-600 py-3 text-lg font-semibold text-white hover:bg-indigo-700"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </main>
  )
}