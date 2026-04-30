import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '../lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createServerSupabaseClient()
  const { data: products } = await supabase.from('products').select('id, updated_at')
  const productEntries = (products || []).map((p: any) => ({
    url: `https://ocop-aihub.vercel.app/products/${p.id}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
  }))
  return [
    {
      url: 'https://ocop-aihub.vercel.app',
      lastModified: new Date(),
    },
    {
      url: 'https://ocop-aihub.vercel.app/admin',
      lastModified: new Date(),
    },
    ...productEntries,
  ]
}
