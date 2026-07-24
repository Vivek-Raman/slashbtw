import {
  convertToModelMessages,
  streamText,
  toUIMessageStream,
  type ChatTransport,
  type UIMessage,
} from 'ai'

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The provider request failed.'
}

class RendererChatTransport implements ChatTransport<UIMessage> {
  async sendMessages({
    messages,
    abortSignal,
  }: Parameters<ChatTransport<UIMessage>['sendMessages']>[0]) {
    const settings = await window.electron?.settings.getAI()

    if (!settings) {
      throw new Error('Live AI requests are available in the desktop app.')
    }

    if (!settings.baseUrl || !settings.apiKey || !settings.model) {
      throw new Error('Configure the Base URL, API key, and model in Settings.')
    }

    const { createOpenAICompatible } =
      await import('@ai-sdk/openai-compatible')

    const provider = createOpenAICompatible({
      name: 'custom-provider',
      baseURL: settings.baseUrl,
      apiKey: settings.apiKey,
    })

    const result = streamText({
      model: provider(settings.model),
      messages: await convertToModelMessages(messages),
      abortSignal,
      onError: () => {},
    })

    return toUIMessageStream({
      stream: result.stream,
      originalMessages: messages,
      onError: getErrorMessage,
    })
  }

  async reconnectToStream() {
    return null
  }
}

const rendererChatTransport = new RendererChatTransport()

export { rendererChatTransport }
