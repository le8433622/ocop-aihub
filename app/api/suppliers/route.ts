import { NextResponse } from 'next/server'
import { getUserIdFromRequest } from '../../../../lib/auth'
import { Pool } from 'pg'
require('dotenv').config()

const pool = new Pool({
  host: '127.0.0.1',
  port: 5432,
  database: 'ocopdb3',
  user: 'postgres',
  password: '',
})

export async function GET(req: Request) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  const result = await pool.query('SELECT * FROM suppliers')
  return NextResponse.json({ suppliers: result.rows })
}

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  const body = await req.json()
  if (!body.name) return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  const result = await pool.query(
    'INSERT INTO suppliers (id, name, user_id, created_at) VALUES (gen_random_uuid(), $1, $2, now()) RETURNING *',
    [body.name, userId]
  )
  return NextResponse.json({ supplier: result.rows[0] })
}
