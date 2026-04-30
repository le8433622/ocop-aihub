import { NextResponse } from 'next/server'
import { createRequestSupabaseClient, getBearerUser } from '../../../../lib/supabase'

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File
  const productId = formData.get('productId') as string

  if (!file || !productId) {
    return new Response(JSON.stringify({ error: 'File and productId required' }), { status: 400 })
  }

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const supabase = createRequestSupabaseClient(req)
  const fileName = `${productId}/${Date.now()}-${file.name}`
  
  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(fileName, buffer, { contentType: file.type })

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const { data: urlData } = supabase.storage
    .from('product-images')
    .getPublicUrl(fileName)

  const { error: updateError } = await supabase
    .from('products')
    .update({ image_url: urlData.publicUrl })
    .eq('id', productId)

  if (updateError) return new Response(JSON.stringify({ error: updateError.message }), { status: 500 })

  return NextResponse.json({ url: urlData.publicUrl })
}