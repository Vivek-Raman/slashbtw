import { Bot } from 'lucide-react'
import type { UIMessage } from 'ai'

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageHeader,
} from '@/components/ui/message'
import { cn } from '@/lib/utils'

type ChatMessageProps = {
  message: UIMessage
}

function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const textParts = message.parts.filter((part) => part.type === 'text')

  return (
    <Message align={isUser ? 'end' : 'start'}>
      {isUser ? null : (
        <MessageAvatar className="size-8 self-start border bg-foreground text-background">
          <Bot className="size-4" />
        </MessageAvatar>
      )}
      <MessageContent
        className={cn('max-w-[82%] gap-1.5', isUser ? 'items-end' : 'items-start')}
      >
        {isUser ? null : <MessageHeader className="px-0">Slash</MessageHeader>}
        <div
          className={cn(
            'max-w-full text-[15px] leading-6',
            isUser
              ? 'rounded-2xl rounded-br-md bg-foreground px-4 py-2.5 text-background'
              : 'rounded-2xl rounded-bl-md border bg-card px-4 py-3 shadow-[0_1px_2px_rgb(0_0_0/0.03)]',
          )}
        >
          {textParts.map((part, index) => (
            <p key={`${message.id}-text-${index}`} className="whitespace-pre-wrap">
              {part.text}
            </p>
          ))}
        </div>
      </MessageContent>
    </Message>
  )
}

function ChatTypingIndicator() {
  return (
    <Message>
      <MessageAvatar className="size-8 self-start border bg-foreground text-background">
        <Bot className="size-4" />
      </MessageAvatar>
      <MessageContent className="max-w-[82%] items-start gap-1.5">
        <MessageHeader className="px-0">Slash</MessageHeader>
        <div
          className="flex h-11 items-center gap-1 rounded-2xl rounded-bl-md border bg-card px-4 shadow-[0_1px_2px_rgb(0_0_0/0.03)]"
          aria-label="Slash is thinking"
        >
          <span className="thinking-dot" />
          <span className="thinking-dot [animation-delay:140ms]" />
          <span className="thinking-dot [animation-delay:280ms]" />
        </div>
      </MessageContent>
    </Message>
  )
}

export { ChatMessage, ChatTypingIndicator }
