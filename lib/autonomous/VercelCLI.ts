import { exec } from 'child_process'
import { promisify } from 'util'
import { DeployResult } from './types'

const execAsync = promisify(exec)
const execAsyncWithTimeout = (cmd: string, timeout = 300000) => {
  return execAsync(cmd, { timeout, cwd: process.cwd(), env: { ...process.env, VERCEL_TOKEN: process.env.VERCEL_TOKEN } })
}

export class VercelCLI {
  async deployPreview(branch: string): Promise<DeployResult> {
    console.log(`[VercelCLI] Deploying preview for branch: ${branch}`)
    
    try {
      // Deploy preview
      const { stdout } = await execAsyncWithTimeout(
        `vercel deploy --prebuilt --yes --no-git-labels --env=GITHUB_TOKEN=${process.env.GITHUB_TOKEN} --env=VERCEL_TOKEN=${process.env.VERCEL_TOKEN}`,
        300000
      )
      
      // Extract URL from output
      const urlMatch = stdout.match(/https:\/\/[^\s]+\.vercel\.app/)
      const url = urlMatch ? urlMatch[0] : undefined
      
      // Get deploy ID
      const deployMatch = stdout.match(/deploy-[\w-]+/)
      const deployId = deployMatch ? deployMatch[0] : undefined
      
      console.log(`[VercelCLI] Preview deployed: ${url}`)
      
      return { success: true, url, deployId }
    } catch (error: any) {
      console.error('[VercelCLI] Deploy failed:', error.stderr || error.message)
      return { success: false, error: error.stderr || error.message }
    }
  }

  async deployProduction(): Promise<DeployResult> {
    console.log('[VercelCLI] Deploying to production...')
    
    try {
      const { stdout } = await execAsyncWithTimeout(
        `vercel --prod --yes --prebuilt`,
        300000
      )
      
      const urlMatch = stdout.match(/https:\/\/[^\s]+\.vercel\.app/)
      const url = urlMatch ? urlMatch[0] : undefined
      
      console.log(`[VercelCLI] Production deployed: ${url}`)
      
      return { success: true, url }
    } catch (error: any) {
      console.error('[VercelCLI] Production deploy failed:', error.stderr || error.message)
      return { success: false, error: error.stderr || error.message }
    }
  }

  async getDeployStatus(deployId: string): Promise<{ state: string; ready: boolean }> {
    try {
      const { stdout } = await execAsyncWithTimeout(
        `vercel deploy inspect ${deployId} --json 2>/dev/null || echo '{}'`
      )
      const data = JSON.parse(stdout)
      return { state: data.state || 'unknown', ready: data.ready || false }
    } catch {
      return { state: 'unknown', ready: false }
    }
  }

  async waitForDeploy(timeout = 300000): Promise<boolean> {
    console.log('[VercelCLI] Waiting for deployment...')
    
    const start = Date.now()
    while (Date.now() - start < timeout) {
      try {
        const { stdout } = await execAsyncWithTimeout('vercel ls --json 2>/dev/null | head -1')
        if (stdout.includes('READY')) {
          console.log('[VercelCLI] Deployment ready')
          return true
        }
      } catch {
        // Continue polling
      }
      await new Promise(r => setTimeout(r, 5000))
    }
    
    console.log('[VercelCLI] Deployment timeout')
    return false
  }

  async getProjectInfo(): Promise<{ name: string; id: string } | null> {
    try {
      const { stdout } = await execAsyncWithTimeout('vercel project ls --json 2>/dev/null | head -1')
      const data = JSON.parse(stdout)
      if (data[0]) {
        return { name: data[0].name, id: data[0].id }
      }
    } catch {
      return null
    }
    return null
  }
}

export const vercelCLI = new VercelCLI()