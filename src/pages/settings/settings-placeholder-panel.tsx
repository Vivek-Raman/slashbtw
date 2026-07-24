import type { SettingsSection } from '@/pages/settings/settings-navigation'

type SettingsPlaceholderPanelProps = {
  section: Exclude<SettingsSection, 'AI'>
}

function SettingsPlaceholderPanel({
  section,
}: SettingsPlaceholderPanelProps) {
  return (
    <div className="page-enter max-w-xl py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{section}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This settings section is coming soon.
      </p>
    </div>
  )
}

export { SettingsPlaceholderPanel }
