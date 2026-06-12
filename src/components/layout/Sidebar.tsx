import { NavLink } from 'react-router-dom'
import {
  AlertTriangle,
  Camera,
  LayoutGrid,
  LogOut,
  ReceiptText,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import logoUrl from '../../assets/Logo.svg'
import { cn } from '../../lib/cn'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** `end` so the index route doesn't stay active on child routes. */
  end?: boolean
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/monitor', label: 'Live Monitor', icon: Camera },
  { to: '/alertas', label: 'Alertas', icon: AlertTriangle },
  { to: '/historico', label: 'Histórico', icon: ReceiptText },
]

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-surface px-6 py-8">
      <img
        src={logoUrl}
        alt="EagleEye"
        className="mb-8 h-16 w-auto self-center dark:brightness-0 dark:invert"
      />

      <nav className="flex flex-1 flex-col gap-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-4 rounded-lg px-5 py-3 text-base font-medium transition-colors duration-200',
                isActive
                  ? 'bg-surface-muted text-primary'
                  : 'text-text-muted hover:bg-surface-muted hover:text-text',
              )
            }
          >
            <Icon
              className="h-6 w-6 transition-transform duration-200 group-hover:scale-110"
              strokeWidth={1.5}
            />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="mt-4 flex items-center gap-4 border-t border-border-strong px-5 py-6 text-base font-medium text-text-muted transition-colors duration-200 hover:text-primary"
      >
        <LogOut className="h-6 w-6" strokeWidth={1.5} />
        Sair
      </button>
    </aside>
  )
}