import type { StatusVoo } from '../../lib/api/types'
import { cn } from '../../lib/cn'

const LABELS: Record<StatusVoo, string> = {
  em_andamento: 'Em Andamento',
  concluido: 'Concluído',
  cancelado: 'Cancelado',
}

/** Status badge for a flight, with a live pulsing dot while in progress. */
export function StatusPill({ status }: { status: StatusVoo }) {
  const active = status === 'em_andamento'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-3 py-1',
        'text-xs font-medium',
        active
          ? 'bg-accent-soft text-primary'
          : 'bg-surface-muted text-text-muted',
      )}
    >
      <span className="relative flex h-2 w-2">
        {active && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
        )}
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            active ? 'bg-accent' : 'bg-text-muted',
          )}
        />
      </span>
      {LABELS[status] ?? status}
    </span>
  )
}
