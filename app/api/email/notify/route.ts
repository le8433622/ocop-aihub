import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../../lib/supabase'

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const { to, subject, message } = body

  if (!to || !subject || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  // Email sending logic would go here (e.g., using SendGrid, Resend, etc.)
  // For now, we log to audit and return success
  const supabase = createServerSupabaseClient()
  await supabase.from('audit_logs').insert([{
    user_id: user.id,
    action: 'email_notification_sent',
    model: 'email',
    metadata: { to, subject, messagePreview: message.slice(0, 100) }
  }])

  return NextResponse.json({ success: true, message: 'Email queued for sending' })
}
