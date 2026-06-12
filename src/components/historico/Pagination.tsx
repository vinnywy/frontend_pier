import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { Select } from '../ui/Select'

const SIZE_OPTIONS = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
]

interface PaginationProps {
  page: number
  pageCount: number
  pageSize: number
  total: number
  shown: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

/** Footer with "showing X of Y", page-size selector and page navigation. */
export function Pagination({
  page,
  pageCount,
  pageSize,
  total,
  shown,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1)

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border px-6 py-4">
      <p className="text-xs font-medium text-text-muted">
        Mostrando <span className="text-primary-strong">{shown}</span> de{' '}
        <span className="text-primary-strong">{total}</span> detecções
      </p>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-xs text-text-muted">
          <Select
            aria-label="Itens por página"
            className="h-8 min-w-[68px]"
            options={SIZE_OPTIONS}
            value={String(pageSize)}
            onChange={(v) => onPageSizeChange(Number(v))}
          />
          <span>/ página</span>
        </div>

        <NavButton disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </NavButton>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'h-8 min-w-8 rounded-lg px-2 text-xs font-medium transition-colors',
              p === page
                ? 'bg-accent text-white'
                : 'text-text-muted hover:bg-surface-muted',
            )}
          >
            {p}
          </button>
        ))}

        <NavButton
          disabled={page >= pageCount}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
        </NavButton>
      </div>
    </div>
  )
}

function NavButton({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'h-8 rounded-lg px-3 text-xs font-medium shadow-sm transition-colors',
        disabled
          ? 'cursor-not-allowed bg-surface-muted text-text-muted/50'
          : 'bg-surface text-text-muted hover:bg-surface-muted',
      )}
    >
      {children}
    </button>
  )
}
