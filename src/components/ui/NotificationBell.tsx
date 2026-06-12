import { Bell } from 'lucide-react'
import { IconButton } from './IconButton'

interface NotificationBellProps {
  /** Number of pending alerts; renders a badge when > 0. Wiring is TODO. */
  count?: number
}

/**
 * Notification trigger. Not functional yet (per the brief) — it only surfaces
 * the pending-alert count so the wiring later is a one-line `onClick`.
 */
export function NotificationBell({ count = 0 }: NotificationBellProps) {
  const hasAlerts = count > 0
  return (
    <IconButton label="Notificações" className="relative">
      <Bell className="h-7 w-7" strokeWidth={2} />
      {hasAlerts && (
        <span className="absolute right-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-white">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </IconButton>
  )
}
