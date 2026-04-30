import prisma from '../../lib/prisma'
import { ProductCard } from '../../lib/components/ProductCard'
import Link from 'next/link'

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { approvalStatus: 'APPROVED' },
    orderBy: { updatedAt: 'desc' }
  })

  return (
    <div className="min-h-screen pt-32 pb-24 bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-5xl mb-4">Exquisite <span className="text-emerald-700">Catalog</span></h1>
          <p className="text-zinc-500">Discover the finest certified products from all regions of Vietnam.</p>
        </header>

        <div className="grid md:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <aside className="space-y-10">
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-400 mb-6">Categories</h4>
              <ul className="space-y-3 font-medium">
                <li className="text-emerald-700">All Products</li>
                <li className="hover:text-emerald-700 transition-colors cursor-pointer">Tea & Coffee</li>
                <li className="hover:text-emerald-700 transition-colors cursor-pointer">Honey & Spices</li>
                <li className="hover:text-emerald-700 transition-colors cursor-pointer">Handicrafts</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold uppercase text-xs tracking-widest text-zinc-400 mb-6">OCOP Rating</h4>
              <ul className="space-y-3 font-medium">
                <li className="flex items-center gap-2 hover:text-amber-500 cursor-pointer">
                  <span className="text-amber-400">★★★★★</span> 5 Stars
                </li>
                <li className="flex items-center gap-2 hover:text-amber-500 cursor-pointer">
                  <span className="text-amber-400">★★★★</span> 4 Stars
                </li>
                <li className="flex items-center gap-2 hover:text-amber-500 cursor-pointer">
                  <span className="text-amber-400">★★★</span> 3 Stars
                </li>
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="md:col-span-3">
            {products.length === 0 ? (
              <div className="glass p-20 text-center rounded-3xl">
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
