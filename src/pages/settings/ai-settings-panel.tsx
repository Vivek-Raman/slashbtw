import { useEffect, useState, type FormEvent } from 'react'
import { Check, KeyRound, LoaderCircle, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { AISettings } from '@/types/electron'

const defaultSettings: AISettings = {
  baseUrl: 'https://api.openai.com/v1',
  apiKey: '',
  model: '',
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

function AISettingsPanel() {
  const [settings, setSettings] = useState<AISettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  useEffect(() => {
    let isCancelled = false

    async function loadSettings() {
      try {
        const savedSettings = await window.electron?.settings.getAI()

        if (!isCancelled && savedSettings) {
          setSettings(savedSettings)
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadSettings()

    return () => {
      isCancelled = true
    }
  }, [])

  const isConfigured = Boolean(
    settings.baseUrl.trim() && settings.apiKey.trim() && settings.model.trim(),
  )

  function updateSetting(field: keyof AISettings, value: string) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [field]: value,
    }))
    setSaveState('idle')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!window.electron) {
      setSaveState('error')
      return
    }

    setSaveState('saving')

    try {
      const savedSettings = await window.electron.settings.setAI(settings)
      setSettings(savedSettings)
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  return (
    <div className="page-enter max-w-2xl">
      <div className="mb-9">
        <div className="mb-3 flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3.5" />
          AI configuration
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] sm:text-[2.15rem]">
          Bring your own model.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
          Connect an OpenAI-compatible provider. Chat requests use the values
          saved here.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-xl border bg-card shadow-[0_1px_2px_rgb(0_0_0/0.03)]">
          <div className="flex items-center justify-between border-b px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground">
                <KeyRound className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Provider credentials</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  OpenAI-compatible endpoint
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  isConfigured ? 'bg-emerald-500' : 'bg-amber-500',
                )}
              />
              {isConfigured ? 'Configured' : 'Needs setup'}
            </div>
          </div>

          <fieldset
            disabled={isLoading || saveState === 'saving'}
            className="space-y-6 px-5 py-6 disabled:opacity-60 sm:px-6"
          >
            <div className="grid gap-2">
              <Label htmlFor="base-url">Base URL</Label>
              <Input
                id="base-url"
                name="baseUrl"
                type="text"
                autoComplete="url"
                required
                value={settings.baseUrl}
                placeholder="https://api.openai.com/v1"
                onChange={(event) =>
                  updateSetting('baseUrl', event.target.value)
                }
              />
              <p className="text-xs leading-5 text-muted-foreground">
                The OpenAI-compatible API endpoint used for chat requests.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="api-key">API key</Label>
              <Input
                id="api-key"
                name="apiKey"
                type="password"
                autoComplete="off"
                required
                spellCheck={false}
                value={settings.apiKey}
                placeholder="sk-..."
                onChange={(event) => updateSetting('apiKey', event.target.value)}
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Stored locally as plain text in Electron&apos;s user data folder.
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                name="model"
                type="text"
                autoComplete="off"
                required
                spellCheck={false}
                value={settings.model}
                placeholder="gpt-4.1-mini"
                onChange={(event) => updateSetting('model', event.target.value)}
              />
              <p className="text-xs leading-5 text-muted-foreground">
                Enter the exact model identifier exposed by your provider.
              </p>
            </div>
          </fieldset>

          <div className="flex min-h-16 items-center justify-between gap-4 border-t bg-muted/20 px-5 py-3 sm:px-6">
            <p
              aria-live="polite"
              className={cn(
                'flex items-center gap-1.5 text-xs',
                saveState === 'error'
                  ? 'text-destructive'
                  : 'text-muted-foreground',
              )}
            >
              {saveState === 'saved' ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  Saved to this device
                </>
              ) : null}
              {saveState === 'error'
                ? 'Could not save settings. Open the desktop app and try again.'
                : null}
            </p>
            <Button type="submit" disabled={isLoading || saveState === 'saving'}>
              {saveState === 'saving' ? (
                <LoaderCircle className="animate-spin" />
              ) : null}
              {saveState === 'saving' ? 'Saving' : 'Save changes'}
            </Button>
          </div>
        </div>
      </form>

      <div className="mt-5 flex items-start gap-3 rounded-lg border border-dashed px-4 py-3.5">
        <Sparkles className="mt-0.5 size-4 text-muted-foreground" />
        <p className="text-xs leading-5 text-muted-foreground">
          New chat requests use the latest saved provider configuration.
          Credentials are not encrypted.
        </p>
      </div>
    </div>
  )
}

export { AISettingsPanel }
