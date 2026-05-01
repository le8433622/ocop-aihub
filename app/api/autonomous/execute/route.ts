import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function triggerGitHubActions(task: string, taskId: string): Promise<{ success: boolean; runUrl?: string; output: string }> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'ocop-aihub/ocop-aihub'
  
  if (!token) {
    return { success: false, output: 'GITHUB_TOKEN not configured' }
  }

  try {
    // Trigger repository dispatch event
    const url = `https://api.github.com/repos/${repo}/dispatches`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        event_type: 'execute_task',
        client_payload: {
          task,
          taskId
        }
      })
    })

    if (response.ok) {
      return { 
        success: true, 
        runUrl: `https://github.com/${repo}/actions`,
        output: `GitHub Actions workflow triggered for: ${task}` 
      }
    } else {
      const error = await response.text()
      return { success: false, output: `GitHub API error: ${error}` }
    }
  } catch (error: any) {
    return { success: false, output: error.message }
  }
}

async function runLocalOpencode(task: string): Promise<{ success: boolean; output: string }> {
  try {
    const { stdout, stderr } = await execAsync(
      `npx -y opencode@latest "${task}"`,
      { timeout: 300000 }
    )
    return { success: true, output: stdout || stderr }
  } catch (e: any) {
    return { success: false, output: e.message }
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

    await supabase
      .from('autonomous_tasks')
      .update({ status: 'executing', updatedat: new Date().toISOString() })
      .eq('id', taskId)

    console.log(`[Execute] Processing: ${task.description}`)

    // Try GitHub Actions first (primary method)
    const githubResult = await triggerGitHubActions(task.description, taskId)
    
    // If GitHub Actions failed, try local (fallback)
    let result = githubResult
    if (!githubResult.success) {
      console.log('[Execute] GitHub Actions failed, trying local opencode...')
      const localResult = await runLocalOpencode(task.description)
      result = {
        success: localResult.success,
        output: localResult.output,
        runUrl: undefined
      }
    }

    await supabase
      .from('autonomous_tasks')
      .update({ 
        status: result.success ? 'reviewing' : 'failed',
        testresults: { 
          github: githubResult.success ? 'triggered' : 'failed',
          local: result.success 
        },
        updatedat: new Date().toISOString()
      })
      .eq('id', taskId)

    return NextResponse.json({ 
      success: true, 
      message: result.success ? 'Task execution started' : 'Execution failed',
      output: result.output,
      runUrl: result.runUrl,
      taskId 
    })
  } catch (error: any) {
    console.error('[Execute] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}