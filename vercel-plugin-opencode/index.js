const { execSync } = require('child_process')
const { existsSync, mkdirSync, createWriteStream, createReadStream } = require('fs')
const { dirname, join } = require('path')
const https = require('https')
const http = require('http')

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = createWriteStream(dest)
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject)
        return
      }
      
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      file.close()
      reject(err)
    })
  })
}

module.exports = {
  name: 'opencode',
  version: '1.0.0',
  
  async build({ utils }) {
    const { spawn } = require('child_process')
    
    utils.status.show({ text: 'Installing Opencode CLI...' })
    
    const platform = process.platform === 'darwin' ? 'darwin' : 'linux'
    const arch = process.arch === 'arm64' ? 'arm64' : 'x64'
    const opencodeDir = join(process.env.HOME || '/root', '.opencode', 'bin')
    const opencodePath = join(opencodeDir, 'opencode')
    
    // Create directory
    if (!existsSync(opencodeDir)) {
      mkdirSync(opencodeDir, { recursive: true })
    }
    
    // Try to download latest release
    try {
      const versionUrl = 'https://api.github.com/repos/anomalyco/opencode/releases/latest'
      const versionRes = await fetch(versionUrl)
      const versionData = await versionRes.json()
      
      const asset = versionData.assets?.find(a => 
        a.name.includes(platform) && a.name.includes(arch)
      )
      
      if (asset) {
        utils.status.show({ text: 'Downloading Opencode...' })
        await downloadFile(asset.browser_download_url, opencodePath)
        
        // Make executable
        execSync(`chmod +x "${opencodePath}"`, { stdio: 'ignore' })
        
        utils.status.show({ text: '✅ Opencode installed!' })
        console.log(`✅ Opencode installed at: ${opencodePath}`)
        
        // Add to PATH for this build
        process.env.PATH = `${opencodeDir}:${process.env.PATH}`
        return
      }
    } catch (e) {
      console.log('Download failed, trying npm...')
    }
    
    // Fallback: try npm
    try {
      execSync('npm install -g opencode', { 
        stdio: 'inherit',
        env: { ...process.env, npm_config_unsafe_perm: 'true' }
      })
      utils.status.show({ text: '✅ Opencode installed via npm!' })
    } catch (e) {
      utils.status.show({ text: '⚠️ Opencode installation skipped' })
      console.log('Opencode installation skipped')
    }
  }
}