import { useEffect, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import {
  AlertCircle,
  Bot,
  MessageSquare,
  Plus,
  Settings2,
  Sparkles,
} from 'lucide-react'

import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from '@/components/ui/message-scroller'
import { rendererChatTransport } from '@/lib/renderer-chat-transport'
import { ChatComposer } from '@/pages/chat/chat-composer'
import { ChatMessage, ChatTypingIndicator } from '@/pages/chat/chat-message'
import type { AISettings } from '@/types/electron'

type ChatPageProps = {
  onOpenSettings: () => void
}

function ChatPage({ onOpenSettings }: ChatPageProps) {
  const [settings, setSettings] = useState<AISettings | null>(null)
  const {
    clearError,
    error,
    messages,
    sendMessage,
    setMessages,
    status,
  } = useChat({
    messages: [],
    transport: rendererChatTransport,
  })

  useEffect(() => {
    let isCancelled = false

    async function loadSettings() {
      const savedSettings = await window.electron?.settings.getAI()

      if (!isCancelled) {
        setSettings(
          savedSettings ?? {
            baseUrl: '',
            apiKey: '',
            model: '',
          },
        )
      }
    }

    void loadSettings()

    return () => {
      isCancelled = true
    }
  }, [])

  const isBusy = status === 'submitted' || status === 'streaming'
  const isConfigured = Boolean(
    settings?.baseUrl.trim() &&
      settings.apiKey.trim() &&
      settings.model.trim(),
  )

  function handleNewChat() {
    clearError()
    setMessages([])
  }

  function handleSend(text: string) {
    clearError()
    void sendMessage({ text })
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <AppHeader
        actions={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Open settings"
            onClick={onOpenSettings}
          >
            <Settings2 />
          </Button>
        }
      />

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-60 shrink-0 flex-col border-r bg-muted/20 p-3 md:flex">
          <Button
            type="button"
            variant="outline"
            className="h-10 w-full justify-start bg-background shadow-none"
            onClick={handleNewChat}
          >
            <Plus />
            New chat
          </Button>

          <div className="mt-6">
            <p className="px-2 text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              Today
            </p>
            <button
              type="button"
              className="mt-2 flex w-full cursor-pointer items-center gap-2 rounded-lg bg-secondary px-2.5 py-2 text-left text-sm font-medium"
            >
              <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate">New conversation</span>
            </button>
          </div>

          <button
            type="button"
            className="mt-auto flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            onClick={onOpenSettings}
          >
            <Settings2 className="size-4" />
            Settings
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <div className="flex h-14 shrink-0 items-center justify-between border-b px-4 sm:px-6">
            <div>
              <h1 className="text-sm font-semibold">New conversation</h1>
              <p className="text-[11px] text-muted-foreground">
                {isConfigured ? 'Provider configured' : 'Setup required'}
              </p>
            </div>
            <div className="flex max-w-48 items-center gap-1.5 rounded-full border bg-muted/30 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
              <Sparkles className="size-3 shrink-0" />
              <span className="truncate">
                {settings?.model || 'No model configured'}
              </span>
            </div>
          </div>

          <MessageScrollerProvider
            autoScroll
            defaultScrollPosition="end"
            scrollPreviousItemPeek={48}
          >
            <div className="flex min-h-0 flex-1 flex-col">
              <MessageScroller className="flex-1">
                <MessageScrollerViewport>
                  <MessageScrollerContent className="mx-auto w-full max-w-3xl justify-end px-4 py-8 sm:px-8">
                    {messages.length === 0 ? (
                      <MessageScrollerItem>
                        <div className="flex min-h-64 flex-col items-center justify-center text-center">
                          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-sm">
                            <Bot className="size-6" />
                          </div>
                          <h2 className="text-xl font-semibold tracking-tight">
                            What can I help with?
                          </h2>
                          <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                            {isConfigured
                              ? 'Start a conversation with your configured model.'
                              : 'Configure an AI provider in Settings to start chatting.'}
                          </p>
                          {isConfigured ? null : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-5"
                              onClick={onOpenSettings}
                            >
                              <Settings2 />
                              Configure AI
                            </Button>
                          )}
                        </div>
                      </MessageScrollerItem>
                    ) : (
                      messages.map((message) => (
                        <MessageScrollerItem
                          key={message.id}
                          messageId={message.id}
                          scrollAnchor={message.role === 'user'}
                        >
                          <ChatMessage message={message} />
                        </MessageScrollerItem>
                      ))
                    )}
                    {status === 'submitted' ? (
                      <MessageScrollerItem>
                        <ChatTypingIndicator />
                      </MessageScrollerItem>
                    ) : null}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>

              {error ? (
                <div
                  role="alert"
                  className="mx-auto mb-1 flex w-[calc(100%-2rem)] max-w-3xl items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2.5 text-xs text-destructive"
                >
                  <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                  <span className="min-w-0 flex-1">{error.message}</span>
                  <button
                    type="button"
                    className="cursor-pointer font-semibold underline underline-offset-2"
                    onClick={onOpenSettings}
                  >
                    Settings
                  </button>
                </div>
              ) : null}

              <ChatComposer
                disabled={!isConfigured || settings === null}
                isBusy={isBusy}
                placeholder={
                  isConfigured
                    ? 'Ask Slash anything'
                    : 'Configure AI in Settings to start'
                }
                onSend={handleSend}
              />
            </div>
          </MessageScrollerProvider>
        </section>
      </div>
    </main>
  )
}

export { ChatPage }
