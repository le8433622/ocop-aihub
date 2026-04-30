import Link from 'next/link'
import { createServerSupabaseClient } from '../../lib/supabase'

export default async function ProductsPage() {
  const supabase = createServerSupabaseClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, description')
    .eq('approval_status', 'APPROVED')
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-gray-800">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {products?.map((product: any) => (
          <div key={product.id} className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
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
    </main>
  )
}
