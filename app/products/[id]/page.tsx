import prisma from '../../../lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: { supplier: true }
  })

  if (!product) notFound()

  return (
    <div className="min-h-screen pt-32 pb-24 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <nav className="mb-12 text-sm font-medium text-zinc-400">
          <Link href="/products" className="hover:text-emerald-700">Catalog</Link>
          <span className="mx-2">&rarr;</span>
          <span className="text-zinc-900 dark:text-white">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-emerald-100 to-amber-100 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-800">
               <span className="text-zinc-400 font-serif italic text-9xl opacity-30">{product.name.charAt(0)}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"></div>
               ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <div className="mb-8">
              {product.ocopStars && (
                <div className="inline-block bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg mb-6">
                  {product.ocopStars} STARS OCOP CERTIFIED
                </div>
              )}
              <h1 className="text-5xl md:text-6xl mb-4">{product.name}</h1>
              <p className="text-3xl font-black text-emerald-800 dark:text-emerald-400">${product.price.toFixed(2)}</p>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-10">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                {product.description || 'This premium OCOP product is a testament to Vietnamese local craftsmanship and heritage. Sourced directly from approved suppliers, it undergoes rigorous quality checks to ensure the best experience.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Origin</span>
                <span className="font-semibold">{product.origin || 'Viet Nam'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="block text-xs uppercase tracking-widest text-zinc-400 font-bold mb-1">Certificate</span>
                <span className="font-semibold">{product.certificateNumber || 'Verified OCOP'}</span>
              </div>
            </div>

            <div className="mt-auto space-y-4">
              <div className="flex gap-4">
                <div className="w-32 h-14 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-around px-4 border border-zinc-200 dark:border-zinc-800">
                  <button className="text-xl font-bold">-</button>
                  <span className="font-bold text-lg">1</span>
                  <button className="text-xl font-bold">+</button>
                </div>
                <button className="flex-1 btn-primary h-14 text-lg">Add to Cart</button>
              </div>
              <Link href={`/checkout?productId=${product.id}&quantity=1`} className="block w-full btn-secondary h-14 text-lg text-center flex items-center justify-center">Buy It Now</Link>
            </div>

            <div className="mt-12 pt-12 border-t border-zinc-100 dark:border-zinc-800">
              <h4 className="font-bold mb-4">Supplier Information</h4>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-700">
                  {product.supplier?.name?.charAt(0) || 'S'}
                </div>
                <div>
                  <p className="font-bold">{product.supplier?.name || 'Local Cooperative'}</p>
                  <p className="text-xs text-zinc-400 uppercase tracking-widest font-bold">Verified Partner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
