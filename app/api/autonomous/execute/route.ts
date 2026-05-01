import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '../../../../lib/supabase'

async function triggerViaIssue(task: string, taskId: string): Promise<{ success: boolean; issueUrl?: string; output: string }> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'le8433622/ocop-aihub'
  
  if (!token) {
    return { success: false, output: 'GITHUB_TOKEN not configured' }
  }

  try {
    // Create issue with trigger label
    const url = `https://api.github.com/repos/${repo}/issues`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28'
      },
      body: JSON.stringify({
        title: `Auto Task: ${task.substring(0, 50)}`,
        body: `${task}\n\n---\nTask ID: ${taskId}\nCreated by: AIHub API`,
        labels: ['trigger']
      })
    })

    if (response.ok) {
      const issue = await response.json()
      return { 
        success: true, 
        issueUrl: issue.html_url,
        output: `Created trigger issue: ${issue.html_url}` 
      }
    } else {
      const error = await response.text()
      return { success: false, output: `GitHub API error: ${error}` }
    }
  } catch (error: any) {
    return { success: false, output: error.message }
  }
}

async function triggerViaPush(task: string, taskId: string): Promise<{ success: boolean; output: string }> {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'le8433622/ocop-aihub'
  
  if (!token) {
    return { success: false, output: 'GITHUB_TOKEN not configured' }
  }

  try {
    // Get current commit SHA
    const refRes = await fetch(`https://api.github.com/repos/${repo}/git/ref/heads/main`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    })
    const refData = await refRes.json()
    const commitSha = refData.object.sha

    // Create a new file with task info to trigger workflow
    const triggerFile = `.aihub/triggers/${taskId}.json`
    const content = JSON.stringify({
      task,
      taskId,
      created: new Date().toISOString()
    }, null, 2)
    const encodedContent = Buffer.from(content).toString('base64')

    // Create blob
    const blobRes = await fetch(`https://api.github.com/repos/${repo}/git/blobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: encodedContent,
        encoding: 'base64'
      })
    })
    const blob = await blobRes.json()

    // Get tree
    const treeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees/${commitSha}?recursive=1`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json'
      }
    })
    const treeData = await treeRes.json()

    // Create new tree
    const newTreeRes = await fetch(`https://api.github.com/repos/${repo}/git/trees`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        base_tree: commitSha,
        tree: [
          {
            path: triggerFile,
            mode: '100644',
            type: 'blob',
            sha: blob.sha
          }
        ]
      })
    })
    const newTree = await newTreeRes.json()

    // Create commit
    const commitRes = await fetch(`https://api.github.com/repos/${repo}/git/commits`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `[AIHub] Trigger task: ${task.substring(0, 30)}...`,
        tree: newTree.sha,
        parents: [commitSha]
      })
    })
    const commit = await commitRes.json()

    // Update ref
    await fetch(`https://api.github.com/repos/${repo}/git/refs/heads/main`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sha: commit.sha,
        force: true
      })
    })

    return { 
      success: true, 
      output: `Triggered workflow via push: ${triggerFile}` 
    }
  } catch (error: any) {
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

    await supabase
      .from('autonomous_tasks')
      .update({ status: 'executing', updatedat: new Date().toISOString() })
      .eq('id', taskId)

    console.log(`[Execute] Processing: ${task.description}`)

    // Try pushing a trigger file first (most reliable)
    const pushResult = await triggerViaPush(task.description, taskId)
    
    // If push failed, try creating an issue
    let result = pushResult
    if (!pushResult.success) {
      console.log('[Execute] Push failed, trying issue method...')
      const issueResult = await triggerViaIssue(task.description, taskId)
      result = {
        success: issueResult.success,
        output: issueResult.output,
        runUrl: issueResult.issueUrl
      }
    }

    await supabase
      .from('autonomous_tasks')
      .update({ 
        status: result.success ? 'reviewing' : 'failed',
        testresults: { 
          push: pushResult.success ? 'triggered' : 'failed',
          issue: result.success 
        },
        updatedat: new Date().toISOString()
      })
      .eq('id', taskId)

    return NextResponse.json({ 
      success: true, 
      message: result.success ? 'Task execution triggered' : 'Execution failed',
      output: result.output,
      runUrl: result.runUrl,
      taskId 
    })
  } catch (error: any) {
    console.error('[Execute] Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}