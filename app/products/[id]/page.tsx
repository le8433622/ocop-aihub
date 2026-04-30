import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '../../../lib/supabase'
import { ProductDetailClient } from '../../../components/ProductDetailClient'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('id', params.id)
    .single()

  return {
    title: product?.name ? `${product.name} - OCOP AIHub` : 'Product - OCOP AIHub',
    description: product?.description?.slice(0, 160) || 'Premium OCOP certified product from Vietnam',
    openGraph: {
      title: product?.name,
      description: product?.description?.slice(0, 160),
    },
  }
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabaseClient()
  const { data: product } = await supabase
    .from('products')
    .select('*, supplier:suppliers(id, name)')
    .eq('id', params.id)
    .single()

  if (!product) notFound()

  return <ProductDetailClient product={product} />
}