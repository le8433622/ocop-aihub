import prisma from '../prisma'
import { MAX_CONCURRENT_TASKS } from './types'
import { executeTask } from './executor'

export class TaskQueue {
  async addToQueue(taskId: string): Promise<void> {
    console.log(`[TaskQueue] Adding task ${taskId} to queue`)
    
    await prisma.autonomousTask.update({
      where: { id: taskId },
      data: { status: 'pending' }
    })
  }

  async processQueue(): Promise<void> {
    console.log('[TaskQueue] Processing queue...')
    
    // Get pending tasks ordered by priority
    const pendingTasks = await prisma.autonomousTask.findMany({
      where: { status: 'pending' },
      orderBy: { priority: 'desc' },
      take: MAX_CONCURRENT_TASKS
    })

    console.log(`[TaskQueue] Found ${pendingTasks.length} pending tasks`)

    // Process in parallel
    const promises = pendingTasks.map((task: any) => 
      executeTask(task.id).catch(err => {
        console.error(`[TaskQueue] Task ${task.id} failed:`, err)
      })
    )

    await Promise.all(promises)
  }

  async getQueueStatus(): Promise<{
    pending: number
    running: number
    completed: number
    failed: number
  }> {
    const [pending, running, completed, failed] = await Promise.all([
      prisma.autonomousTask.count({ where: { status: 'pending' } }),
      prisma.autonomousTask.count({ where: { status: { in: ['planning', 'executing', 'reviewing', 'deploying'] } } }),
      prisma.autonomousTask.count({ where: { status: 'merged' } }),
      prisma.autonomousTask.count({ where: { status: 'failed' } })
    ])

    return { pending, running, completed, failed }
  }

  async cancelTask(taskId: string): Promise<void> {
    await prisma.autonomousTask.update({
      where: { id: taskId },
      data: { status: 'failed', errorLog: 'Cancelled by user' }
    })
  }

  async retryTask(taskId: string): Promise<void> {
    const task = await prisma.autonomousTask.findUnique({ where: { id: taskId } })
    if (!task) return

    await prisma.autonomousTask.update({
      where: { id: taskId },
      data: { 
        status: 'pending',
        errorLog: null,
        branch: null,
        commitHash: null,
        prUrl: null,
        prNumber: null
      }
    })
  }
}

export const taskQueue = new TaskQueue()