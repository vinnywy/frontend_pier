import { NotificationBell } from '../ui/NotificationBell'
import { ThemeToggle } from '../ui/ThemeToggle'

interface PageHeaderProps {
  title: string
  alertCount?: number
}

/** Top bar: page title plus the notification + theme controls. */
export function PageHeader({ title, alertCount }: PageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-8">
      <h1 className="text-5xl font-normal text-primary">{title}</h1>
      <div className="flex items-center gap-2">
        <NotificationBell count={alertCount} />
        <ThemeToggle />
      </div>
    </header>
  )
}
