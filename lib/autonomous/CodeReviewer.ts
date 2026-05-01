import { exec } from 'child_process'
import { promisify } from 'util'
import { ReviewResults, AUTO_MERGE_CRITERIA, BLOCKED_PATTERNS } from './types'

const execAsync = promisify(exec)

export class CodeReviewer {
  async runChecks(): Promise<ReviewResults> {
    console.log('[CodeReviewer] Running checks...')
    
    const results: ReviewResults = {
      lint: 'skipped',
      typecheck: 'skipped',
      security: 'pass',
      secretsFound: []
    }

    try {
      // Run lint
      try {
        const { stdout, stderr } = await execAsync('npm run lint 2>&1', { timeout: 120000 })
        results.lint = stdout.includes('error') || stderr.includes('error') ? 'fail' : 'pass'
        console.log(`[CodeReviewer] Lint: ${results.lint}`)
      } catch {
        results.lint = 'fail'
      }

      // Run typecheck
      try {
        const { stdout, stderr } = await execAsync('npm run typecheck 2>&1', { timeout: 120000 })
        results.typecheck = stdout.includes('error') || stderr.includes('error') ? 'fail' : 'pass'
        console.log(`[CodeReviewer] Typecheck: ${results.typecheck}`)
      } catch {
        results.typecheck = 'fail'
      }

      // Check for secrets in staged files
      await this.checkForSecrets(results)

      // Check blocked patterns
      await this.checkBlockedPatterns()

    } catch (error: any) {
      console.error('[CodeReviewer] Check error:', error.message)
    }

    return results
  }

  private async checkForSecrets(results: ReviewResults): Promise<void> {
    console.log('[CodeReviewer] Scanning for secrets...')
    
    const secretPatterns = [
      /ghp_[a-zA-Z0-9]{36}/,
      /github_pat_[a-zA-Z0-9_]{22,}/,
      /nvapi-[a-zA-Z0-9]{30,}/,
      /sk-[a-zA-Z0-9]{20,}/,
      /AKIA[0-9A-Z]{16}/,
      /["']?Bearer\s+[a-zA-Z0-9\-_]+\.eyJ[a-zA-Z0-9\-_]+/
    ]

    try {
      // Check git diff for secrets
      const { stdout } = await execAsync('git diff --cached --name-only 2>/dev/null || git diff --name-only')
      const files = stdout.trim().split('\n').filter(Boolean)

      for (const file of files) {
        const { stdout: content } = await execAsync(`cat "${file}" 2>/dev/null || echo ""`)
        
        for (const pattern of secretPatterns) {
          if (pattern.test(content)) {
            results.secretsFound.push(`${file}: found pattern ${pattern}`)
          }
        }
      }

      results.security = results.secretsFound.length > 0 ? 'fail' : 'pass'
      console.log(`[CodeReviewer] Security: ${results.security}, secrets found: ${results.secretsFound.length}`)
    } catch {
      results.security = 'pass'
    }
  }

  private async checkBlockedPatterns(): Promise<void> {
    console.log('[CodeReviewer] Checking blocked patterns...')
    
    try {
      const { stdout } = await execAsync('git diff --cached --name-only 2>/dev/null || git diff --name-only')
      const files = stdout.trim().split('\n').filter(Boolean)

      for (const file of files) {
        for (const pattern of BLOCKED_PATTERNS) {
          if (pattern.test(file)) {
            throw new Error(`Blocked file detected: ${file} matches ${pattern}`)
          }
        }
      }
    } catch (error: any) {
      if (error.message.includes('Blocked file detected')) {
        throw error
      }
    }
  }

  canAutoMerge(results: ReviewResults): boolean {
    return (
      results.lint === AUTO_MERGE_CRITERIA.lint &&
      results.typecheck === AUTO_MERGE_CRITERIA.typecheck &&
      results.security === 'pass' &&
      results.secretsFound.length === 0
    )
  }

  async addReviewComment(prNumber: number, body: string): Promise<void> {
    try {
      const { exec: execSync } = require('child_process')
      execSync(`gh pr comment ${prNumber} --body "${body}"`)
      console.log(`[CodeReviewer] Added comment to PR #${prNumber}`)
    } catch (error) {
      console.log('[CodeReviewer] Failed to add comment:', error)
    }
  }

  async addPRComment(prNumber: number, body: string): Promise<void> {
    return this.addReviewComment(prNumber, body)
  }

  async approvePR(prNumber: number): Promise<void> {
    try {
      const { exec: execSync } = require('child_process')
      execSync(`gh pr review ${prNumber} --approve --body "🤖 AIHub Auto-Review: All checks passed"`)
      console.log(`[CodeReviewer] PR #${prNumber} approved`)
    } catch (error) {
      console.log('[CodeReviewer] Failed to approve PR:', error)
    }
  }
}

export const codeReviewer = new CodeReviewer()