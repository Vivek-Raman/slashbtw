import {
  ChevronRight,
  CircleUserRound,
  Palette,
  Settings2,
  Sparkles,
} from 'lucide-react'

import { cn } from '@/lib/utils'

const settingsSections = [
  { label: 'General', icon: Settings2 },
  { label: 'Appearance', icon: Palette },
  { label: 'Account', icon: CircleUserRound },
  { label: 'AI', icon: Sparkles },
] as const

type SettingsSection = (typeof settingsSections)[number]['label']

type SettingsNavigationProps = {
  activeSection: SettingsSection
  onSectionChange: (section: SettingsSection) => void
}

function SettingsNavigation({
  activeSection,
  onSectionChange,
}: SettingsNavigationProps) {
  return (
    <aside className="border-b px-4 py-5 md:border-r md:border-b-0 md:px-5 md:py-8">
      <p className="mb-3 px-2 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
        Settings
      </p>
      <nav
        aria-label="Settings sections"
        className="flex gap-1 overflow-x-auto md:flex-col"
      >
        {settingsSections.map(({ label, icon: Icon }) => {
          const isActive = activeSection === label

          return (
            <button
              key={label}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group flex min-w-fit cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-secondary text-foreground'
                  : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
              )}
              onClick={() => onSectionChange(label)}
            >
              <Icon className="size-4" />
              <span>{label}</span>
              <ChevronRight
                className={cn(
                  'ml-auto hidden size-3.5 md:block',
                  isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40',
                )}
              />
            </button>
          )
        })}
      </nav>
    </aside>
  )
}

export { SettingsNavigation, type SettingsSection }
