import { NextResponse } from 'next/server'
import { createServerSupabaseClient, getBearerUser } from '../../../../lib/supabase'

async function sendEmail(to: string, subject: string, html: string) {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) {
    console.log('RESEND_API_KEY not set, skipping email send')
    return { success: false, error: 'Email service not configured' }
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'OCOP AIHub <noreply@ocop-aihub.vercel.app>',
      to,
      subject,
      html,
    }),
  })

  return await res.json()
}

export async function POST(req: Request) {
  const user = await getBearerUser(req)
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })

  const body = await req.json()
  const { to, template, data } = body

  if (!to || !template) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  let subject = 'OCOP AIHub Notification'
  let html = '<p>You have a new notification.</p>'

  const templates: Record<string, { subject: string; html: string }> = {
    order_confirmed: {
      subject: 'Order Confirmed - OCOP AIHub',
      html: `<h1>Your order has been confirmed!</h1><p>Order ID: ${data.orderId}</p><p>Total: ${data.totalAmount}₫</p>`,
    },
    order_shipped: {
      subject: 'Order Shipped - OCOP AIHub',
      html: `<h1>Your order has been shipped!</h1><p>Order ID: ${data.orderId}</p><p>Tracking: ${data.tracking || 'N/A'}</p>`,
    },
    order_delivered: {
      subject: 'Order Delivered - OCOP AIHub',
      html: `<h1>Your order has been delivered!</h1><p>Order ID: ${data.orderId}</p><p>Thank you for shopping with us.</p>`,
    },
    review_received: {
      subject: 'New Review - OCOP AIHub',
      html: `<h1>You received a new review!</h1><p>Rating: ${data.rating}/5</p><p>Comment: ${data.comment || 'No comment'}</p>`,
    },
  }

  if (templates[template]) {
    subject = templates[template].subject
    html = templates[template].html
  }

  const result = await sendEmail(to, subject, html)

  const supabase = createServerSupabaseClient()
  await supabase.from('audit_logs').insert([{
    user_id: user.id,
    action: 'email_sent',
    model: 'email',
    metadata: { to, template, result: result.success ? 'sent' : 'failed' }
  }])

  return NextResponse.json({ success: true, result })
}