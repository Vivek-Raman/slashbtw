type AISettings = {
  baseUrl: string
  apiKey: string
  model: string
}

type ElectronBridge = {
  settings: {
    getAI: () => Promise<AISettings>
    setAI: (settings: AISettings) => Promise<AISettings>
  }
}

declare global {
  interface Window {
    electron?: ElectronBridge
  }
}

export type { AISettings, ElectronBridge }
