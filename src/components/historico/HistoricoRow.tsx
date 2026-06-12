import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { DeteccaoHistorico } from '../../lib/api/types'
import { formatDate, formatTime } from '../../lib/format'
import { cn } from '../../lib/cn'
import { PierStatusBadge } from '../ui/PierStatusBadge'
import { VehicleDetails } from './VehicleDetails'
import { GRID_COLS } from './grid'

/** Expandable history row. Collapsed: summary columns. Expanded: vehicle card. */
export function HistoricoRow({ det }: { det: DeteccaoHistorico }) {
  const [open, setOpen] = useState(false)
  const consulta = det.consulta_pier[0]
  const Chevron = open ? ChevronUp : ChevronDown

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cn(
          GRID_COLS,
          'w-full px-6 py-4 text-left text-sm transition-colors hover:bg-surface-muted/60',
        )}
      >
        <Chevron
          className={cn('h-5 w-5', open ? 'text-primary' : 'text-text-muted')}
          aria-hidden="true"
        />
        <span className="text-text-muted">{formatDate(det.timestamp)}</span>
        <span className="text-text-muted">{formatTime(det.timestamp)} h</span>
        <span className="font-medium text-primary">{det.placa_lida}</span>
        <span className="font-medium text-primary">
          {consulta?.placa_consultada ?? '—'}
        </span>
        <span>
          {consulta ? (
            <PierStatusBadge status={consulta.resultado} />
          ) : (
            <span className="text-text-muted">—</span>
          )}
        </span>
        <span className="font-medium text-primary">
          {Math.round(det.confianca_ocr * 100)}%
        </span>
      </button>
      {open && <VehicleDetails det={det} />}
    </div>
  )
}
