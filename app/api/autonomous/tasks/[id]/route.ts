import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../../lib/supabase'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: task, error } = await supabase
      .from('autonomous_tasks')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ task })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    
    await supabase
      .from('autonomous_tasks')
      .update({ status: 'failed', errorLog: 'Cancelled by user', updatedAt: new Date().toISOString() })
      .eq('id', params.id)
    
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await req.json()
    
    if (body.action === 'retry') {
      await supabase
        .from('autonomous_tasks')
        .update({ status: 'pending', errorLog: null, updatedAt: new Date().toISOString() })
        .eq('id', params.id)
      return NextResponse.json({ success: true, message: 'Task queued for retry' })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}