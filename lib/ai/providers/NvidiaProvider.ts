import { AiCompletionInput, AiCompletionResult, AiProvider } from '../core/AiProvider'

export class NvidiaProvider implements AiProvider {
  readonly name = 'NVIDIA_NIM'
  private readonly apiKey: string
  private readonly baseUrl: string
  private readonly defaultModel: string

  constructor() {
    this.apiKey = process.env.NVAPI_TOKEN || ''
    this.baseUrl = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1'
    this.defaultModel = process.env.NVIDIA_DEFAULT_MODEL || 'nvidia/llama-3.1-nemotron-70b-instruct'
  }

  async complete(input: AiCompletionInput): Promise<AiCompletionResult> {
    if (!this.apiKey) {
      throw new Error('NVIDIA API key (NVAPI_TOKEN) is not configured')
    }

    const model = input.model || this.defaultModel
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: input.messages,
        temperature: input.temperature ?? 0.5,
        max_tokens: input.maxTokens ?? 1024,
        stream: false,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`NVIDIA API error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content || ''

    return {
      text,
      model,
      provider: this.name,
      usage: {
        promptTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
      raw: data,
    }
  }
}
