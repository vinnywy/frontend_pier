import type { PierStatus } from '../../lib/api/types'
import { cn } from '../../lib/cn'

const STYLES: Record<PierStatus, { label: string; className: string }> = {
  achado: {
    label: 'Achado',
    className: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  },
  nao_achado: {
    label: 'Não Achado',
    className: 'bg-surface-muted text-text-muted',
  },
  pendente: {
    label: 'Pendente',
    className: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
}

/** Pier lookup result badge used in the history table. */
export function PierStatusBadge({ status }: { status: PierStatus }) {
  const { label, className } = STYLES[status] ?? STYLES.pendente
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full px-3 py-1',
        'text-xs font-medium',
        className,
      )}
    >
      {label}
    </span>
  )
}
