import Link from 'next/link'

export type Product = {
  id: string
  name: string
  price: number
  description?: string
  ocopStars?: number
  slug?: string
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="card-premium group">
      <div className="relative h-64 mb-6 rounded-xl overflow-hidden bg-zinc-100">
        {product.ocopStars && (
          <div className="absolute top-4 right-4 z-10 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            {product.ocopStars} STARS OCOP
          </div>
        )}
        <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center">
          <span className="text-zinc-400 font-serif italic text-4xl opacity-50">
            {product.name.charAt(0)}
          </span>
        </div>
      </div>
      <Link href={`/products/${product.id}`}>
        <h3 className="text-2xl mb-2 group-hover:text-emerald-700 transition-colors cursor-pointer">
          {product.name}
        </h3>
      </Link>
      <p className="text-zinc-500 text-sm mb-4 line-clamp-2">
        {product.description || 'Premium OCOP product representing Vietnamese heritage.'}
      </p>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-black text-zinc-900 dark:text-white">
          ${product.price.toFixed(2)}
        </span>
        <button className="text-emerald-700 font-bold uppercase text-xs tracking-widest border-b-2 border-transparent hover:border-emerald-700 transition-all py-1">
          Add to Cart
        </button>
      </div>
    </div>
  )
}
