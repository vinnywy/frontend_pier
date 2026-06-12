import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

interface CardProps {
  children: ReactNode
  className?: string
}

/** Base surface used across the dashboard: white panel, soft shadow, rounded. */
export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-surface shadow-[0_4px_8px_-1px_rgba(0,0,0,0.18)]',
        'ring-1 ring-black/5 dark:ring-white/5',
        className,
      )}
    >
      {children}
    </div>
  )
}
