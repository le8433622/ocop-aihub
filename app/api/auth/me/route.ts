import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser, getUserRole } from '../../../../lib/supabase'

export async function GET(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name')
    .eq('id', user.id)
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  const role = await getUserRole(supabase, user.id)
  return NextResponse.json({ user: { ...data, role } })
}

export async function PATCH(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const supabase = createServerSupabaseClient()
  const body = await req.json()

  const { data, error } = await supabase
    .from('users')
    .update({ name: body.name ?? null })
    .eq('id', user.id)
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ user: data })
}