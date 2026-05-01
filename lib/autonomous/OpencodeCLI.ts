import { spawn } from 'child_process'
import * as path from 'path'
import * as os from 'os'
import { ExecutionResult } from './types'

export class OpencodeCLI {
  private opencodePath: string

  constructor() {
    this.opencodePath = path.join(os.homedir(), '.local', 'bin', 'opencode')
  }

  async execute(taskDescription: string, workdir?: string): Promise<ExecutionResult> {
    const startTime = Date.now()
    console.log(`[OpencodeCLI] Executing task: ${taskDescription.substring(0, 100)}...`)

    return new Promise((resolve) => {
      const args = [taskDescription]
      
      // Use working directory or current dir
      const cwd = workdir || process.cwd()
      
      const child = spawn(this.opencodePath, args, {
        cwd,
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env }
      })

      let stdout = ''
      let stderr = ''

      child.stdout.on('data', (data) => {
        stdout += data.toString()
      })

      child.stderr.on('data', (data) => {
        stderr += data.toString()
      })

      child.on('close', (code) => {
        const duration = Date.now() - startTime
        const success = code === 0
        
        console.log(`[OpencodeCLI] Completed in ${duration}ms, exit code: ${code}`)
        
        resolve({
          success,
          output: stdout,
          error: stderr || undefined,
          duration
        })
      })

      child.on('error', (error) => {
        const duration = Date.now() - startTime
        console.error('[OpencodeCLI] Error:', error.message)
        
        resolve({
          success: false,
          output: '',
          error: error.message,
          duration
        })
      })

      // Timeout after 5 minutes
      setTimeout(() => {
        child.kill()
        const duration = Date.now() - startTime
        resolve({
          success: false,
          output: stdout,
          error: 'Task timeout after 5 minutes',
          duration
        })
      }, 300000)
    })
  }

  async executeMultiple(tasks: string[], workdir?: string): Promise<ExecutionResult[]> {
    const results: ExecutionResult[] = []
    
    for (let i = 0; i < tasks.length; i++) {
      console.log(`[OpencodeCLI] Task ${i + 1}/${tasks.length}`)
      const result = await this.execute(tasks[i], workdir)
      results.push(result)
      
      // Stop if failed
      if (!result.success) {
        console.log('[OpencodeCLI] Task failed, stopping')
        break
      }
    }
    
    return results
  }

  setPath(customPath: string): void {
    this.opencodePath = customPath
  }

  async getVersion(): Promise<string> {
    try {
      const { stdout } = await new Promise<{ stdout: string }>((resolve, reject) => {
        const child = spawn(this.opencodePath, ['--version'])
        let stdout = ''
        child.stdout.on('data', (d) => { stdout += d.toString() })
        child.on('close', (code) => {
          if (code === 0) resolve({ stdout })
          else reject(new Error('Version check failed'))
        })
        child.on('error', reject)
      })
      return stdout.trim()
    } catch {
      return 'unknown'
    }
  }
}

export const opencodeCLI = new OpencodeCLI()