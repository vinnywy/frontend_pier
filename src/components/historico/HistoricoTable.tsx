import type { DeteccaoHistorico } from '../../lib/api/types'
import { cn } from '../../lib/cn'
import { HistoricoRow } from './HistoricoRow'
import { GRID_COLS } from './grid'

const HEADERS = [
  'Data',
  'Horário',
  'Placa Lida',
  'Placa Consultada',
  'Status',
  'Confiança',
]

interface HistoricoTableProps {
  rows: DeteccaoHistorico[]
  loading?: boolean
}

/** Detection history table: tinted header + expandable rows. */
export function HistoricoTable({ rows, loading }: HistoricoTableProps) {
  return (
    <div>
      <div
        className={cn(
          GRID_COLS,
          'bg-accent px-6 py-5 text-sm font-medium text-white',
        )}
      >
        <span aria-hidden="true" />
        {HEADERS.map((header) => (
          <span key={header}>{header}</span>
        ))}
      </div>

      <div className="bg-surface">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)
        ) : rows.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-text-muted">
            Nenhuma detecção encontrada para os filtros aplicados.
          </p>
        ) : (
          rows.map((det) => <HistoricoRow key={det.id} det={det} />)
        )}
      </div>
    </div>
  )
}

function RowSkeleton() {
  return (
    <div className={cn(GRID_COLS, 'border-b border-border px-6 py-4')}>
      <div className="h-5 w-5 animate-pulse rounded bg-surface-muted" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="h-4 w-2/3 animate-pulse rounded bg-surface-muted"
        />
      ))}
    </div>
  )
}
