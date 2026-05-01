import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await req.json()
    const { taskId } = body

    if (!taskId) {
      return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
    }

    const { data: task, error } = await supabase
      .from('autonomous_tasks')
      .select('*')
      .eq('id', taskId)
      .single()

    if (error || !task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    if (task.status !== 'pending' && task.status !== 'failed') {
      return NextResponse.json({ error: `Task is already ${task.status}` }, { status: 400 })
    }

    // Update task status to executing
    await supabase
      .from('autonomous_tasks')
      .update({ status: 'executing', updatedat: new Date().toISOString() })
      .eq('id', taskId)

    return NextResponse.json({ 
      success: true, 
      message: 'Task execution started',
      taskId 
    })
  } catch (error: any) {
    console.error('[Execute] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}