import { NextResponse } from 'next/server'
import { getUserIdFromRequest } from '../../../../lib/auth'
import { Pool } from 'pg'

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
  const result = await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId])
  return NextResponse.json({ orders: result.rows })
}

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  const body = await req.json()
  if (!body.totalAmount) return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400 })
  const result = await pool.query(
    'INSERT INTO orders (id, user_id, status, total_amount, created_at) VALUES (gen_random_uuid(), $1, $2, $3, now()) RETURNING *',
    [userId, 'UNPAID', body.totalAmount]
  )
  return NextResponse.json({ order: result.rows[0] })
}
