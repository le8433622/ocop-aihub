import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../../../lib/auth'
import { Pool } from 'pg'
require('dotenv').config()

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'ocopdb3',
  user: 'postgres',
  password: '',
})

type Body = {
  email: string
  password: string
}

export async function POST(req: Request) {
  try {
    const body: Body = await req.json()
    const result = await pool.query('SELECT id, email, name, password_hash FROM users WHERE email = $1', [body.email])
    const user = result.rows[0]
    if (!user || !user.password_hash) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }
    const ok = await bcrypt.compare(body.password, user.password_hash)
    if (!ok) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 })
    }
    const token = generateToken(user.id)
    return NextResponse.json({ token, user: { id: user.id, email: user.email, name: user.name } })
  } catch (e: any) {
    console.error(e)
    return new Response(JSON.stringify({ error: 'Server error', detail: e.message }), { status: 500 })
  }
}
