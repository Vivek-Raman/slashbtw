import { useState } from 'react'

import CanvasPage from '@/components/CanvasPage'
import { ChatPage } from '@/pages/chat/chat-page'
import { SettingsPage } from '@/pages/settings/settings-page'

type AppView = 'chat' | 'settings'

function App() {
  const [view, setView] = useState<AppView>('chat')
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/'

  if (pathname === '/canvas') {
    return <CanvasPage />
  }

  return view === 'chat' ? (
    <ChatPage onOpenSettings={() => setView('settings')} />
  ) : (
    <SettingsPage onBackToChat={() => setView('chat')} />
  )
}

export default App
