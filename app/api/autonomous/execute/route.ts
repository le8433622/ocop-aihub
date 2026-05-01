import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

async function createTriggerIssue(task: string, taskId: string): Promise<{ success: boolean; issueUrl?: string; output: string }> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'le8433622/ocop-aihub'
  
  console.log('[Execute] GITHUB_TOKEN exists:', !!token)
  console.log('[Execute] Repo:', repo)
  
  if (!token) {
    return { success: false, output: 'GITHUB_TOKEN not configured in environment' }
  }

  try {
    const url = `https://api.github.com/repos/${repo}/issues`
    
    console.log('[Execute] Creating issue...')
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        title: `Auto Task: ${task.substring(0, 60)}`,
        body: `${task}\n\n---\n**Task ID:** \`${taskId}\`**Created by:** AIHub Execute API\n**Time:** ${new Date().toISOString()}`,
        labels: ['trigger', 'autonomous']
      })
    })

    if (response.ok) {
      const issue = await response.json()
      console.log('[Execute] Issue created:', issue.number)
      return { 
        success: true, 
        issueUrl: issue.html_url,
        output: `✅ Đã tạo issue #${issue.number}. Workflow sẽ tự động chạy trong 1-2 phút.`
      }
    } else {
      const error = await response.text()
      console.log('[Execute] GitHub API error:', error)
      return { success: false, output: `GitHub API error: ${error.substring(0, 200)}` }
    }
  } catch (error: any) {
    console.log('[Execute] Exception:', error.message)
    return { success: false, output: error.message }
  }
}

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

    // Update to executing
    await supabase
      .from('autonomous_tasks')
      .update({ status: 'executing', updatedat: new Date().toISOString() })
      .eq('id', taskId)

    console.log(`[Execute] Processing: ${task.description}`)

    // Create trigger issue
    const result = await createTriggerIssue(task.description, taskId)

    // Update status
    await supabase
      .from('autonomous_tasks')
      .update({ 
        status: result.success ? 'reviewing' : 'failed',
        testresults: { 
          trigger: result.success ? 'issue_created' : 'failed',
          output: result.output
        },
        updatedat: new Date().toISOString()
      })
      .eq('id', taskId)

    return NextResponse.json({ 
      success: result.success, 
      message: result.success ? 'Task triggered' : 'Execution failed',
      output: result.output,
      runUrl: result.issueUrl,
      taskId 
    })
  } catch (error: any) {
    console.error('[Execute] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}