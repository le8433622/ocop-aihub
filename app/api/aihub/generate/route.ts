import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../../lib/supabase'

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  if (!process.env.NVAPI_TOKEN) {
    return new Response(JSON.stringify({ error: 'AI provider is not configured' }), { status: 503 })
  }

  const supabase = createServerSupabaseClient()
  const body = await req.json()
  const { taskType = 'generic', model = 'nvidia/llama-3.1-nemotron-70b-instruct', prompt = '' } = body
  if (!prompt || typeof prompt !== 'string') {
    return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 })
  }

  const { data: generation, error: logError } = await supabase
    .from('ai_generations')
    .insert([{ user_id: user.id, task_type: taskType, provider: 'NVIDIA_NIM', model, input: { prompt }, status: 'RUNNING' }])
    .select()
    .single()

  if (logError) return new Response(JSON.stringify({ error: logError.message }), { status: 500 })

  const forbidden = ['chua benh', 'tri ung thu', 'tri tieu duong', 'tri huyet ap', 'hieu qua 100%', 'thay the thuoc', 'cam ket khoi benh', 'thuoc gia truyen']
  if (forbidden.some((phrase) => prompt.toLowerCase().includes(phrase))) {
    await supabase.from('ai_generations').update({ status: 'FAILED', error: 'Prompt violates safety policy' }).eq('id', generation.id)
    return new Response(JSON.stringify({ error: 'Prompt violates safety policy' }), { status: 400 })
  }

  // Provider call is intentionally gated by configuration and logged. Replace this block with NVIDIA fetch when endpoint/model policy is finalized.
  const response = `Draft response for review: ${prompt}`
  await supabase.from('ai_generations').update({ status: 'SUCCEEDED', output: { text: response }, updated_at: new Date().toISOString() }).eq('id', generation.id)
  await supabase.from('audit_logs').insert([{ user_id: user.id, action: 'ai_generation_succeeded', model: 'ai_generations', model_id: generation.id }])
  return NextResponse.json({ ok: true, response })
}
