export type TaskType = 'feature' | 'bugfix' | 'improvement' | 'security'
export type TaskStatus = 'pending' | 'planning' | 'executing' | 'reviewing' | 'deploying' | 'merged' | 'failed'
export type StepStatus = 'pending' | 'running' | 'success' | 'failed'

export interface Subtask {
  id: string
  description: string
  status: 'pending' | 'completed' | 'failed'
  file?: string
  output?: string
}

export interface TaskContext {
  userId?: string
  prompt: string
  type?: TaskType
  priority?: number
}

export interface ExecutionResult {
  success: boolean
  output: string
  error?: string
  duration: number
}

export interface CLIResult {
  success: boolean
  stdout: string
  stderr: string
  code: number
}

export interface ReviewResults {
  lint: 'pass' | 'fail' | 'skipped'
  typecheck: 'pass' | 'fail' | 'skipped'
  security: 'pass' | 'fail'
  secretsFound: string[]
}

export interface DeployResult {
  success: boolean
  url?: string
  deployId?: string
  error?: string
}

export const AUTO_MERGE_CRITERIA = {
  lint: 'pass',
  typecheck: 'pass',
  previewDeploy: 'success',
} as const

export const BLOCKED_PATTERNS = [
  /\/api\/auth\//,
  /\/prisma\/schema/,
  /\.env/,
  /payment.*route/,
  /\/admin\/.*\/route/,
]

export const MAX_CONCURRENT_TASKS = 3
export const MAX_RETRIES = 3