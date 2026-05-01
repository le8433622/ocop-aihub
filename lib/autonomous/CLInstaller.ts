import { exec } from 'child_process'
import { promisify } from 'util'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

const execAsync = promisify(exec)

const OPENCODE_VERSION = 'latest'
const OPENCODE_BASE_URL = 'https://github.com/anomalyco/opencode/releases/download'

class CLInstaller {
  private static instance: CLInstaller
  private installed = false

  static getInstance() {
    if (!CLInstaller.instance) {
      CLInstaller.instance = new CLInstaller()
    }
    return CLInstaller.instance
  }

  async ensureInstalled(): Promise<void> {
    if (this.installed) return

    console.log('[CLInstaller] Installing required CLIs...')

    try {
      await this.installGH()
      await this.installVercel()
      await this.installOpencode()

      await this.authenticateGH()
      await this.linkVercel()

      this.installed = true
      console.log('[CLInstaller] All CLIs installed and authenticated')
    } catch (error) {
      console.error('[CLInstaller] Installation error:', error)
      throw error
    }
  }

  private async installGH(): Promise<void> {
    try {
      await execAsync('which gh')
      console.log('[CLInstaller] gh already installed')
    } catch {
      console.log('[CLInstaller] Installing gh...')
      if (process.platform === 'darwin') {
        await execAsync('brew install gh')
      } else {
        await execAsync('sudo apt-get install -y gh')
      }
    }
  }

  private async installVercel(): Promise<void> {
    try {
      await execAsync('which vercel')
      console.log('[CLInstaller] vercel already installed')
    } catch {
      console.log('[CLInstaller] Installing vercel...')
      await execAsync('npm install -g vercel')
    }
  }

  private async installOpencode(): Promise<void> {
    const opencodePath = path.join(os.homedir(), '.local', 'bin', 'opencode')
    
    try {
      await execAsync(`which opencode`)
      console.log('[CLInstaller] opencode already installed')
      return
    } catch {
      // Download binary
    }

    const arch = process.arch === 'arm64' ? 'arm64' : 'x64'
    const platform = process.platform === 'darwin' ? 'darwin' : 'linux'
    const url = `${OPENCODE_BASE_URL}/${OPENCODE_VERSION}/opencode-${platform}-${arch}`

    console.log('[CLInstaller] Downloading opencode from', url)

    try {
      const { exec: execSync } = require('child_process')
      execSync(`curl -L ${url} -o ${opencodePath}`, { stdio: 'inherit' })
      execSync(`chmod +x ${opencodePath}`)
      
      // Add to PATH for current session
      const binDir = path.dirname(opencodePath)
      process.env.PATH = `${binDir}:${process.env.PATH}`
      
      console.log('[CLInstaller] opencode installed to', opencodePath)
    } catch (error) {
      console.error('[CLInstaller] Failed to download opencode:', error)
      throw error
    }
  }

  private async authenticateGH(): Promise<void> {
    const token = process.env.GITHUB_TOKEN
    if (!token) {
      throw new Error('GITHUB_TOKEN not set')
    }

    try {
      // Check if already authenticated
      await execAsync('gh auth status')
      console.log('[CLInstaller] gh already authenticated')
    } catch {
      console.log('[CLInstaller] Authenticating gh...')
      await execAsync(`echo "${token}" | gh auth login --with-token`)
      await execAsync('gh auth setup-git')
    }
  }

  private async linkVercel(): Promise<void> {
    const token = process.env.VERCEL_TOKEN
    if (!token) {
      throw new Error('VERCEL_TOKEN not set')
    }

    // Set Vercel token
    process.env.VERCEL_TOKEN = token
    
    try {
      await execAsync('vercel link --yes --cwd .')
      console.log('[CLInstaller] vercel linked')
    } catch (error) {
      console.log('[CLInstaller] vercel link failed (may already be linked):', error)
    }
  }

  getOpencodePath(): string {
    return path.join(os.homedir(), '.local', 'bin', 'opencode')
  }
}

export const clInstaller = CLInstaller.getInstance()