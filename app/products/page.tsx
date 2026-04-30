'use client'

import { useState, useEffect } from 'react'
import { ProductCard } from '../../lib/components/ProductCard'

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [stars, setStars] = useState('')

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('q', search)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (stars) params.set('stars', stars)

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(d => setProducts(d.products ?? []))
  }, [search, minPrice, maxPrice, stars])

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-5xl mb-4">Exquisite <span className="text-emerald-700">Catalog</span></h1>
          <p className="text-zinc-500">Discover the finest certified products from all regions of Vietnam.</p>
        </header>

        <div className="grid md:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="space-y-10">
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-400 mb-6">Search</h4>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-400 mb-6">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-400 mb-6">OCOP Stars</h4>
              <ul className="space-y-3 font-medium">
                {[5, 4, 3].map(s => (
                  <li
                    key={s}
                    onClick={() => setStars(stars === String(s) ? '' : String(s))}
                    className={`flex items-center gap-2 cursor-pointer hover:text-amber-500 ${stars === String(s) ? 'text-amber-500' : ''}`}
                  >
                    <span className="text-amber-400">{'★'.repeat(s)}{'☆'.repeat(5-s)}</span> {s} Stars
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {products.length === 0 ? (
              <div className="p-20 text-center rounded-3xl border">
                <h3 className="text-2xl mb-4">No products found</h3>
                <p className="text-zinc-500">Try adjusting your filters or check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product as any} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
