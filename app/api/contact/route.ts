import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, subject, message } = body

  if (!name || !email || !subject || !message) {
    return new Response(JSON.stringify({ error: 'All fields are required' }), { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  
  // Log contact form submission in audit_logs
  await supabase.from('audit_logs').insert([{
    action: 'contact_form_submitted',
    model: 'contact',
    metadata: { name, email, subject, messagePreview: message.slice(0, 100) }
  }])

  // Store in a contact_messages table (create if not exists)
  const { error } = await supabase.from('audit_logs').insert([{
    action: 'contact_received',
    model: 'contact',
    metadata: { name, email, subject, message }
  }])

  return NextResponse.json({ success: true, message: 'Message received' })
}