import type { ComponentType } from 'react'
import type { LucideProps } from 'lucide-react'
import { cn } from '../../lib/cn'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'date'
  icon?: ComponentType<LucideProps>
  className?: string
  'aria-label'?: string
}

/** Bordered text/date field with an optional trailing icon. */
export function SearchInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  icon: Icon,
  className,
  'aria-label': ariaLabel,
}: SearchInputProps) {
  return (
    <div
      className={cn(
        'flex h-10 items-center gap-2 rounded-lg border border-border-strong bg-surface px-3',
        'transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
        className,
      )}
    >
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-muted/70"
      />
      {Icon && (
        <Icon className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
      )}
    </div>
  )
}
