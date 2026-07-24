import { ArrowRight, Monitor } from 'lucide-react'

import { Button } from '@/components/ui/button'
import CanvasPage from '@/components/CanvasPage'

function App() {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'

  if (pathname === '/canvas') {
    return <CanvasPage />
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-6">
      <section className="w-full max-w-xl rounded-xl border bg-card p-8 text-card-foreground shadow-sm">
        <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Monitor className="size-6" />
        </div>
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Electron + React + Vite
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Your desktop app is ready.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tailwind CSS v4 and shadcn/ui are configured. Start building in{' '}
          <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
            src/App.tsx
          </code>
          .
        </p>
        <Button className="mt-6">
          Get started
          <ArrowRight />
        </Button>
      </section>
    </main>
  )
}

export default App
