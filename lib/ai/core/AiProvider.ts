export type AiMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export type AiCompletionInput = {
  model?: string
  messages: AiMessage[]
  temperature?: number
  maxTokens?: number
  responseFormat?: 'text' | 'json'
}

export type AiCompletionResult = {
  text: string
  model: string
  provider: string
  usage?: {
    promptTokens?: number
    outputTokens?: number
    totalTokens?: number
  }
  raw?: unknown
}

export interface AiProvider {
  name: string
  complete(input: AiCompletionInput): Promise<AiCompletionResult>
}
