import { exec } from 'child_process'
import { promisify } from 'util'
import { CLIResult } from './types'

const execAsync = promisify(exec)
const execAsyncWithTimeout = (cmd: string, timeout = 120000) => {
  return execAsync(cmd, { timeout, cwd: process.cwd() })
}

const GITHUB_REPO = process.env.GITHUB_REPO || 'ocop-aihub/ocop-aihub'
const MAIN_BRANCH = 'main'

export class GitHubCLI {
  async createBranch(branchName: string, baseBranch = MAIN_BRANCH): Promise<void> {
    console.log(`[GitHubCLI] Creating branch: ${branchName} from ${baseBranch}`)
    
    // Fetch latest
    await execAsyncWithTimeout(`git fetch origin ${baseBranch}:${baseBranch} 2>/dev/null || true`)
    
    // Create branch
    await execAsyncWithTimeout(`git checkout -b ${branchName} origin/${baseBranch}`)
    console.log(`[GitHubCLI] Branch created: ${branchName}`)
  }

  async commitFiles(message: string, files?: string[]): Promise<string> {
    console.log(`[GitHubCLI] Committing changes...`)
    
    // Add all files or specific files
    if (files && files.length > 0) {
      for (const file of files) {
        await execAsyncWithTimeout(`git add "${file}"`)
      }
    } else {
      await execAsyncWithTimeout(`git add -A`)
    }

    // Check if there are changes
    try {
      const { stdout } = await execAsyncWithTimeout('git diff --cached --name-only')
      if (!stdout.trim()) {
        console.log('[GitHubCLI] No changes to commit')
        return ''
      }
    } catch {
      return ''
    }

    // Commit
    await execAsyncWithTimeout(`git commit -m "${message}"`)
    
    // Get commit hash
    const { stdout } = await execAsyncWithTimeout('git rev-parse HEAD')
    const commitHash = stdout.trim()
    console.log(`[GitHubCLI] Committed: ${commitHash}`)
    
    return commitHash
  }

  async pushBranch(branchName: string): Promise<void> {
    console.log(`[GitHubCLI] Pushing branch: ${branchName}`)
    await execAsyncWithTimeout(`git push -u origin ${branchName}`)
    console.log(`[GitHubCLI] Branch pushed`)
  }

  async createPR(title: string, body: string, branchName: string): Promise<{ url: string; number: number }> {
    console.log(`[GitHubCLI] Creating PR...`)
    
    const { stdout } = await execAsyncWithTimeout(
      `gh pr create --title "${title}" --body "${body}" --base ${MAIN_BRANCH} --head ${branchName}`
    )
    
    // Get PR URL and number
    const { stdout: listOutput } = await execAsyncWithTimeout(
      `gh pr list --head ${branchName} --json url,number --jq '.[0]'`
    )
    
    const pr = JSON.parse(listOutput)
    console.log(`[GitHubCLI] PR created: ${pr.url}`)
    
    return { url: pr.url, number: pr.number }
  }

  async addPRLabels(prNumber: number, labels: string[]): Promise<void> {
    if (labels.length === 0) return
    
    console.log(`[GitHubCLI] Adding labels: ${labels.join(', ')}`)
    await execAsyncWithTimeout(`gh pr edit ${prNumber} --add-label "${labels.join(',')}"`)
  }

  async mergePR(prNumber: number): Promise<void> {
    console.log(`[GitHubCLI] Merging PR #${prNumber}`)
    
    try {
      await execAsyncWithTimeout(
        `gh pr merge ${prNumber} --admin --auto`,
        60000
      )
      console.log(`[GitHubCLI] PR merged`)
    } catch (error: any) {
      if (error.message?.includes('auto-merge')) {
        console.log('[GitHubCLI] PR merge requires review, skipping auto-merge')
      } else {
        throw error
      }
    }
  }

  async deleteBranch(branchName: string): Promise<void> {
    try {
      console.log(`[GitHubCLI] Deleting branch: ${branchName}`)
      await execAsyncWithTimeout(`git push origin --delete ${branchName} 2>/dev/null || true`)
      await execAsyncWithTimeout(`git branch -D ${branchName} 2>/dev/null || true`)
      console.log(`[GitHubCLI] Branch deleted`)
    } catch (error) {
      console.log('[GitHubCLI] Branch deletion failed (may not exist):', error)
    }
  }

  async getPRStatus(prNumber: number): Promise<{ state: string; merged: boolean }> {
    const { stdout } = await execAsyncWithTimeout(
      `gh pr view ${prNumber} --json state,merged --jq '{state: .state, merged: .merged}'`
    )
    return JSON.parse(stdout)
  }

  async runCLI(args: string): Promise<CLIResult> {
    try {
      const { stdout, stderr } = await execAsyncWithTimeout(`gh ${args}`)
      return { success: true, stdout, stderr, code: 0 }
    } catch (error: any) {
      return {
        success: false,
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        code: error.code || 1
      }
    }
  }
}

export const githubCLI = new GitHubCLI()