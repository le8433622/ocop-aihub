import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    
    const { data: tasks, error } = await supabase
      .from('autonomous_tasks')
      .select('*')
      .order('priority', { ascending: false })

    if (error) throw error

    return NextResponse.json({ tasks: tasks || [] })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}