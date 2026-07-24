import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { AISettingsPanel } from '@/pages/settings/ai-settings-panel'
import {
  SettingsNavigation,
  type SettingsSection,
} from '@/pages/settings/settings-navigation'
import { SettingsPlaceholderPanel } from '@/pages/settings/settings-placeholder-panel'

type SettingsPageProps = {
  onBackToChat: () => void
}

function SettingsPage({ onBackToChat }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>('AI')

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AppHeader
        actions={
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBackToChat}
          >
            <MessageCircle />
            Back to chat
          </Button>
        }
      />

      <div className="mx-auto grid min-h-[calc(100vh-3.5rem)] max-w-6xl grid-cols-1 md:grid-cols-[220px_1fr]">
        <SettingsNavigation
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <section className="px-5 py-8 sm:px-9 md:px-12 md:py-11 lg:px-16">
          {activeSection === 'AI' ? (
            <AISettingsPanel />
          ) : (
            <SettingsPlaceholderPanel section={activeSection} />
          )}
        </section>
      </div>
    </main>
  )
}

export { SettingsPage }
