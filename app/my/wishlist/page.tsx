'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/wishlist')
      .then(r => r.json())
      .then(d => setItems(d.wishlist ?? []))
      .finally(() => setLoading(false))
  }, [])

  const remove = async (productId: string) => {
    await fetch(`/api/wishlist?productId=${productId}`, { method: 'DELETE' })
    setItems(prev => prev.filter((i: any) => i.product_id !== productId))
  }

  const addToCart = (product: any) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find((i: any) => i.id === product.id)
    if (existing) existing.quantity += 1
    else cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 })
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <main className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">My Wishlist</h1>

      {items.length === 0 ? (
        <p className="mt-8 text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="mt-8 space-y-4">
          {items.map((item: any) => (
            <div key={item.id} className="rounded-xl border bg-white p-6 shadow-sm flex items-center gap-6">
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-400">
                {item.product?.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{item.product?.name}</h3>
                <p className="text-gray-500">{item.product?.price?.toLocaleString()}₫</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => addToCart(item.product)} className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white">
                  Add to Cart
                </button>
                <button onClick={() => remove(item.product_id)} className="rounded-lg border px-3 py-1 text-sm text-red-500">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/products" className="text-indigo-600 hover:underline">Continue Shopping</Link>
      </div>
    </main>
  )
}