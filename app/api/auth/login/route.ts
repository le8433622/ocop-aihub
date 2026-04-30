import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../../../lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || 'https://usfbpktesdbriomlrzqn.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'b093552cf73a8b3591ff73d5c8260eea41d5b6922db6559a5f902aff12adae06'
)

type Body = {
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json()
    // Try to find user in Supabase
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, password_hash')
      .eq('email', body.email)
      .single()
    if (error || !data) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }
    const ok = await bcrypt.compare(body.password, data.password_hash)
    if (!ok) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }
    const token = generateToken(data.id)
    return NextResponse.json({ token, user: { id: data.id, email: data.email, name: data.name } })
  } catch (e: any) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Server error', detail: e.message }), { status: 500 })
  }
}
