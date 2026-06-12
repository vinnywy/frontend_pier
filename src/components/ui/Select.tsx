import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: ReadonlyArray<SelectOption>
  className?: string
  'aria-label'?: string
}

/** Styled wrapper around a native <select> with a chevron affordance. */
export function Select({
  value,
  onChange,
  options,
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  return (
    <div
      className={cn(
        'relative flex h-10 items-center rounded-lg border border-border-strong bg-surface',
        className,
      )}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={ariaLabel}
        className="h-full w-full cursor-pointer appearance-none bg-transparent pl-3 pr-9 text-sm text-text outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-surface text-text">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 h-4 w-4 text-text-muted"
        aria-hidden="true"
      />
    </div>
  )
}
