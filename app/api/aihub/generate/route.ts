import { NextResponse } from 'next/server'
import { getBearerUser } from '../../../../lib/supabase'
import { NvidiaProvider } from '../../../../lib/ai/providers/NvidiaProvider'
import { AiTaskRunner } from '../../../../lib/ai/core/AiTaskRunner'

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  try {
    const body = await req.json()
    const { taskType = 'generic', model, prompt } = body

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 })
    }

    const provider = new NvidiaProvider()
    const runner = new AiTaskRunner(provider)

    const result = await runner.run(
      {
        model,
        messages: [{ role: 'user', content: prompt }],
      },
      {
        userId: user.id,
        taskType,
        model,
      }
    )

    return NextResponse.json({
      ok: true,
      response: result.text,
      generationId: (result as any).id, // Runner doesn't return the ID easily, but we can update runner if needed
    })
  } catch (error: any) {
    console.error('[AIHUB_GENERATE_ERROR]', error)
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal Server Error',
      }),
      { status: error.message?.includes('safety policy') ? 400 : 500 }
    )
  }
}
