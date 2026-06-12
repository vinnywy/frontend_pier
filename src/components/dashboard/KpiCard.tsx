import type { LucideIcon } from 'lucide-react'
import { Card } from '../ui/Card'
import { cn } from '../../lib/cn'

interface KpiCardProps {
  label: string
  value: number | string
  icon?: LucideIcon
  loading?: boolean
  className?: string
}

/** Metric card with the signature pink accent rail on the left. */
export function KpiCard({
  label,
  value,
  icon: Icon,
  loading,
  className,
}: KpiCardProps) {
  return (
    <Card
      className={cn(
        'flex flex-col justify-center gap-2 border-l-[6px] border-l-accent px-6 py-8',
        'transition-shadow duration-200 hover:shadow-[0_8px_20px_-4px_rgba(163,56,88,0.25)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-text-muted">
        {Icon && <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />}
        <span className="text-base font-bold">{label}</span>
      </div>
      {loading ? (
        <span className="h-10 w-14 animate-pulse rounded bg-surface-muted" />
      ) : (
        <span className="text-[32px] font-medium leading-10 text-primary-strong">
          {value}
        </span>
      )}
    </Card>
  )
}
