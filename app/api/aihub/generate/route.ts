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

const NVAPI_TOKEN = process.env.NVAPI_TOKEN || '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'

export async function POST(req: Request) {
  const userId = getUserIdFromRequest(req)
  if (!userId) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  const body = await req.json()
  const { model = 'default', prompt = '' } = body
  // Simulate AI call (in production, call NVIDIA API with NVAPI_TOKEN)
  const response = `Simulated AI response for prompt: ${prompt}`
  // Log to ai_generations
  await pool.query(
    'INSERT INTO ai_generations (id, user_id, model, prompt, response, created_at) VALUES (gen_random_uuid(), $1, $2, $3, $4, now())',
    [userId, model, prompt, response]
  )
  // Also log to audit_logs
  await pool.query(
    'INSERT INTO audit_logs (id, user_id, action, model, model_id, timestamp) VALUES (gen_random_uuid(), $1, $2, $3, $4, now())',
    [userId, 'ai_generation', model, null]
  )
  return NextResponse.json({ ok: true, response })
}