import Link from 'next/link'
import { createServerSupabaseClient } from '../lib/supabase'

export default async function HomePage() {
  const supabase = createServerSupabaseClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, description')
    .eq('approval_status', 'APPROVED')
    .limit(8)

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-green-700 text-white py-20 text-center">
        <h1 className="text-4xl font-bold">Welcome to OCOP AIHub</h1>
        <p className="mt-4 text-lg">White-label commerce platform for OCOP products</p>
        <Link
          href="/products"
          className="mt-8 inline-block bg-white text-green-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Browse Products
        </Link>
      </section>

      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product: any) => (
            <div key={product.id} className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800">{product.name}</h3>
              <p className="text-gray-600 text-sm mt-2">{product.description}</p>
              <p className="text-green-700 font-bold mt-4">${product.price}</p>
              <Link
                href={`/products/${product.id}`}
                className="mt-4 inline-block text-sm text-green-600 hover:underline"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
