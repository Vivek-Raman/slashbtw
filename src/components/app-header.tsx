import type { ReactNode } from 'react'
import { Bot } from 'lucide-react'

type AppHeaderProps = {
  actions?: ReactNode
}

function AppHeader({ actions }: AppHeaderProps) {
  return (
    <header className="app-drag-region flex h-14 items-center border-b bg-background/90 px-5 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background shadow-sm">
          <Bot className="size-4" strokeWidth={2.2} />
        </div>
        <span className="text-sm font-semibold tracking-tight">Slash</span>
      </div>
      {actions ? (
        <div className="app-no-drag-region ml-auto flex items-center gap-2">
          {actions}
        </div>
      ) : null}
    </header>
  )
}

export { AppHeader }
