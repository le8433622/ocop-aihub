import Link from 'next/link'
import { createServerSupabaseClient } from '../../../lib/supabase'

export async function generateMetadata({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', params.id)
    .single()
  return {
    title: data?.name || 'Product',
    description: data?.description || 'OCOP AIHub Product',
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .eq('approval_status', 'APPROVED')
    .single()

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Product not found.</p>
      </main>
    )
  }

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <Link href="/products" className="text-green-600 hover:underline text-sm">
        &larr; Back to Products
      </Link>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-xl h-64 md:h-96 flex items-center justify-center">
          <span className="text-gray-400">Product Image</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-4 text-2xl text-green-700 font-bold">${product.price}</p>
          <p className="mt-6 text-gray-600">{product.description}</p>
          <form action="/checkout" className="mt-8">
            <input type="hidden" name="productId" value={product.id} />
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              className="mt-1 w-24 rounded-lg border border-gray-300 px-3 py-2"
            />
            <button className="ml-3 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              Start Checkout
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
