import { NextResponse } from 'next/server'

export async function GET() {
  const isConfigured = !!process.env.NVAPI_TOKEN
  const model = process.env.NVIDIA_DEFAULT_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct'

  return NextResponse.json({
    status: 'ok',
    provider: 'NVIDIA_NIM',
    configured: isConfigured,
    model: model,
  })
}
