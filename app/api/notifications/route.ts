import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../lib/supabase'

export async function GET(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ notifications: data ?? [] })
}

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const { userId, title, message, type } = body

  if (!userId || !title || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_id: userId, title, message, type: type ?? 'info' }])
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ notification: data })
}

export async function PATCH(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const { searchParams } = new URL(req.url)
  const notificationId = searchParams.get('id')

  if (!notificationId) return new Response(JSON.stringify({ error: 'Notification ID required' }), { status: 400 })

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ success: true })
}