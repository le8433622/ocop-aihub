import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: tasks, error } = await supabase
      .from('autonomous_tasks')
      .select('*')
      .order('createdat', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json({
      tasks: tasks || [],
      queue: { pending: 0, running: 0, completed: 0, failed: 0 }
    })
  } catch (error: any) {
    console.error('[Autonomous] List error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await req.json()
    const { prompt, type, priority } = body

    if (!prompt) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 })
    }

    const { data: task, error } = await supabase
      .from('autonomous_tasks')
      .insert([{
        description: prompt,
        type: type || 'feature',
        priority: priority || 5,
        status: 'pending',
        createdat: new Date().toISOString(),
        updatedat: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      task: {
        id: task.id,
        status: task.status,
        description: task.description
      }
    })
  } catch (error: any) {
    console.error('[Autonomous] Create error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}