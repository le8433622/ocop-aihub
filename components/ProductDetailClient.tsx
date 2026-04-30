'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface ProductDetailProps {
  product: {
    id: string
    name: string
    price: number
    description?: string
    image_url?: string
    ocop_stars?: number
    origin?: string
    stock_quantity?: number
    supplier?: { name?: string }
  }
}

export function ProductDetailClient({ product }: ProductDetailProps) {
  const [reviews, setReviews] = useState<any[]>([])
  const [quantity, setQuantity] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')

  useEffect(() => {
    fetch(`/api/reviews?productId=${product.id}`)
      .then(r => r.json())
      .then(d => setReviews(d.reviews ?? []))
  }, [product.id])

  const submitReview = async () => {
    await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, rating, comment })
    })
    const r = await fetch(`/api/reviews?productId=${product.id}`)
    const d = await r.json()
    setReviews(d.reviews ?? [])
    setComment('')
  }

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existing = cart.find((i: any) => i.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, quantity })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    alert('Added to cart!')
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null

  return (
    <div className="min-h-screen pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="mb-12 text-sm font-medium text-zinc-400">
          <Link href="/products" className="hover:text-emerald-700">Catalog</Link>
          <span className="mx-2">&rarr;</span>
          <span className="text-zinc-900">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-16">
          <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center overflow-hidden border border-zinc-200">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-zinc-400 font-serif italic text-9xl opacity-30">{product.name.charAt(0)}</span>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-8">
              {product.ocop_stars && (
                <div className="inline-block bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg mb-6">
                  {product.ocop_stars} STARS OCOP CERTIFIED
                </div>
              )}
              <h1 className="text-5xl md:text-6xl mb-4">{product.name}</h1>
              <p className="text-3xl font-black text-emerald-800">{product.price?.toLocaleString()}₫</p>
              {avgRating && (
                <p className="mt-2 text-amber-500 font-bold">★ {avgRating} ({reviews.length} reviews)</p>
              )}
            </div>

            <p className="text-zinc-600 text-lg leading-relaxed mb-10">
              {product.description || 'Premium OCOP product from Vietnam.'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Origin</span>
                <span className="font-semibold">{product.origin || 'Viet Nam'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                <span className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Stock</span>
                <span className="font-semibold">{product.stock_quantity ?? 0} available</span>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex gap-4">
                <div className="w-32 h-14 bg-zinc-100 rounded-full flex items-center justify-around px-4 border border-zinc-200">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-xl font-bold">-</button>
                  <span className="font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="text-xl font-bold">+</button>
                </div>
                <button onClick={addToCart} className="flex-1 btn-primary h-14 text-lg">Add to Cart</button>
              </div>
              <Link href={`/checkout?productId=${product.id}&quantity=${quantity}`} className="block w-full btn-secondary h-14 text-lg text-center flex items-center justify-center">Buy It Now</Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>

          <div className="mb-8 p-6 rounded-xl border bg-gray-50">
            <h3 className="font-semibold mb-4">Write a Review</h3>
            <div className="flex gap-2 mb-4">
              {[1,2,3,4,5].map(r => (
                <button key={r} onClick={() => setRating(r)} className={`text-2xl ${r <= rating ? 'text-amber-500' : 'text-gray-300'}`}>★</button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full rounded-lg border p-3 mb-4"
              rows={3}
            />
            <button onClick={submitReview} className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Submit Review</button>
          </div>

          <div className="space-y-4">
            {reviews.map((review: any) => (
              <div key={review.id} className="p-6 rounded-xl border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                  <span className="text-sm text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700">{review.comment || 'No comment'}</p>
              </div>
            ))}
            {reviews.length === 0 && <p className="text-gray-500">No reviews yet. Be the first!</p>}
          </div>
        </div>
      </div>
    </div>
  )
}