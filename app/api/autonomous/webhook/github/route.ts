import { NextResponse } from 'next/server'
import prisma from '../../../../../lib/prisma'
import crypto from 'crypto'

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET || ''

export async function POST(req: Request) {
  try {
    // Verify webhook signature if secret is set
    if (GITHUB_WEBHOOK_SECRET) {
      const signature = req.headers.get('x-hub-signature-256')
      const body = await req.text()
      
      const hmac = crypto.createHmac('sha256', GITHUB_WEBHOOK_SECRET)
      const digest = 'sha256=' + hmac.update(body).digest('hex')
      
      if (signature !== digest) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
      }
    }

    const event = req.headers.get('x-github-event')
    const payload = await req.json()

    console.log(`[Webhook] Received event: ${event}`)

    switch (event) {
      case 'pull_request':
        await handlePullRequest(payload)
        break
      case 'push':
        await handlePush(payload)
        break
      case 'status':
        await handleStatus(payload)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function handlePullRequest(payload: any) {
  const action = payload.action
  const pr = payload.pull_request
  const prNumber = pr.number
  const branch = pr.head?.ref
  const merged = pr.merged

  console.log(`[Webhook] PR #${prNumber}: ${action}, merged: ${merged}`)

  // Find task by branch name
  if (branch?.startsWith('autonomous/')) {
    const task = await prisma.autonomousTask.findFirst({
      where: { branch }
    })

    if (task) {
      if (action === 'closed' && merged) {
        await prisma.autonomousTask.update({
          where: { id: task.id },
          data: { status: 'merged', completedAt: new Date() }
        })
        console.log(`[Webhook] Task ${task.id} marked as merged`)
      }
    }
  }
}

async function handlePush(payload: any) {
  const ref = payload.ref
  const branch = ref.replace('refs/heads/', '')
  
  console.log(`[Webhook] Push to branch: ${branch}`)

  // Check if main branch was updated
  if (branch === 'main') {
    console.log('[Webhook] Main branch updated - production deploy triggered')
  }
}

async function handleStatus(payload: any) {
  const state = payload.state // pending, success, failure
  const context = payload.context
  const branch = payload.branches?.[0]?.name
  
  console.log(`[Webhook] Status: ${state} for ${context} on ${branch}`)
}