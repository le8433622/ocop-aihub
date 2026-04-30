import prisma from '../../prisma'
import { AiCompletionInput, AiProvider } from './AiProvider'
import { FORBIDDEN_PHRASES } from '../safety/forbidden-phrases'

export type TaskContext = {
  userId?: string
  taskType: string
  model?: string
  metadata?: any
}

export class AiTaskRunner {
  private provider: AiProvider

  constructor(provider: AiProvider) {
    this.provider = provider
  }

  async run(input: AiCompletionInput, context: TaskContext) {
    // 1. Initial logging (PENDING -> RUNNING)
    const generation = await prisma.aiGeneration.create({
      data: {
        userId: context.userId,
        taskType: context.taskType,
        provider: this.provider.name,
        model: input.model || context.model || 'unknown',
        input: input as any,
        status: 'RUNNING',
      },
    })

    try {
      // 2. Safety Scan (Input)
      const inputText = input.messages.map((m) => m.content).join(' ')
      const violatesSafety = FORBIDDEN_PHRASES.some((phrase) =>
        inputText.toLowerCase().includes(phrase.toLowerCase())
      )

      if (violatesSafety) {
        throw new Error('Prompt violates safety policy: medical claims or unauthorized keywords detected.')
      }

      // 3. Execute AI call
      const result = await this.provider.complete(input)

      // 4. Safety Scan (Output)
      const outputViolatesSafety = FORBIDDEN_PHRASES.some((phrase) =>
        result.text.toLowerCase().includes(phrase.toLowerCase())
      )

      if (outputViolatesSafety) {
        throw new Error('AI output violates safety policy.')
      }

      // 5. Success update
      const updatedGeneration = await prisma.aiGeneration.update({
        where: { id: generation.id },
        data: {
          output: result as any,
          status: 'SUCCEEDED',
        },
      })

      // 6. Audit Log
      await prisma.auditLog.create({
        data: {
          userId: context.userId,
          action: 'ai_generation_succeeded',
          model: 'AiGeneration',
          modelId: generation.id,
          metadata: { taskType: context.taskType },
        },
      })

      return result
    } catch (error: any) {
      // 7. Failure update
      await prisma.aiGeneration.update({
        where: { id: generation.id },
        data: {
          status: 'FAILED',
          error: error.message,
        },
      })

      // 8. Audit Log (Failure)
      await prisma.auditLog.create({
        data: {
          userId: context.userId,
          action: 'ai_generation_failed',
          model: 'AiGeneration',
          modelId: generation.id,
          metadata: { error: error.message, taskType: context.taskType },
        },
      })

      throw error
    }
  }
}
