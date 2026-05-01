import { NvidiaProvider } from '../ai/providers/NvidiaProvider'
import { Subtask, TaskType } from './types'
import { randomUUID } from 'crypto'

export class TaskPlanner {
  private provider: NvidiaProvider

  constructor() {
    this.provider = new NvidiaProvider()
  }

  async analyze(prompt: string, type?: TaskType): Promise<{
    type: TaskType
    priority: number
    subtasks: Subtask[]
    description: string
  }> {
    console.log('[TaskPlanner] Analyzing task...')

    const systemPrompt = `You are an expert software architect. Given a user request for the OCOP AIHub commerce platform (Next.js + TypeScript + Prisma + Supabase), break it down into specific, actionable subtasks.

Respond ONLY with valid JSON in this format:
{
  "type": "feature|bugfix|improvement|security",
  "priority": 1-10,
  "description": "Brief summary of what this task accomplishes",
  "subtasks": [
    {"id": "1", "description": "Specific actionable task", "file": "optional-file-path.ts"}
  ]
}

Focus on:
- Breaking down into small, independently implementable tasks
- Identify files that need to be created or modified
- Consider dependencies between tasks
- Estimate priority (10=critical, 5=normal, 1=low)`

    try {
      const response = await this.provider.complete({
        model: 'meta/llama-3.1-70b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      })

      const content = response.text || ''
      
      // Parse JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return {
          type: parsed.type || type || 'feature',
          priority: parsed.priority || 5,
          description: parsed.description || prompt,
          subtasks: (parsed.subtasks || []).map((s: any, i: number) => ({
            id: s.id || randomUUID(),
            description: s.description,
            file: s.file,
            status: 'pending' as const
          }))
        }
      }
    } catch (error) {
      console.error('[TaskPlanner] AI analysis failed:', error)
    }

    // Fallback: create single task
    return {
      type: type || 'feature',
      priority: 5,
      description: prompt,
      subtasks: [{
        id: randomUUID(),
        description: prompt,
        status: 'pending'
      }]
    }
  }

  async estimateComplexity(subtasks: Subtask[]): Promise<number> {
    // Simple complexity estimate based on number of subtasks
    const baseComplexity = subtasks.length * 2
    
    // Add time for file creation vs modification
    const fileTasks = subtasks.filter(s => s.file).length
    const additional = fileTasks > 5 ? 3 : fileTasks > 3 ? 2 : 1
    
    return Math.min(baseComplexity + additional, 10)
  }

  determineType(prompt: string): TaskType {
    const lower = prompt.toLowerCase()
    if (lower.includes('fix') || lower.includes('bug') || lower.includes('error')) {
      return 'bugfix'
    }
    if (lower.includes('security') || lower.includes('vulnerability') || lower.includes('auth')) {
      return 'security'
    }
    if (lower.includes('optimize') || lower.includes('improve') || lower.includes('performance')) {
      return 'improvement'
    }
    return 'feature'
  }
}

export const taskPlanner = new TaskPlanner()