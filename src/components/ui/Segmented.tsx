import { cn } from '../../lib/cn'

interface SegmentedOption<T extends string> {
  value: T
  label: string
}

interface SegmentedProps<T extends string> {
  options: ReadonlyArray<SegmentedOption<T>>
  value: T
  onChange: (value: T) => void
  'aria-label'?: string
}

/** Compact pill toggle (e.g. Hoje / Semana). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
}: SegmentedProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex items-center gap-1 rounded-full bg-surface-muted p-1"
    >
      {options.map((opt) => {
        const selected = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors duration-200',
              selected
                ? 'bg-surface text-primary shadow-sm'
                : 'text-text-muted hover:text-text',
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
