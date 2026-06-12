import { Link } from 'react-router-dom'
import { BatteryMedium, Mountain, ArrowUpRight } from 'lucide-react'
import type { AtividadeVoo } from '../../lib/api/types'
import { Card } from '../ui/Card'
import { StatusPill } from '../ui/StatusPill'
import { DroneMark } from '../icons/DroneMark'
import { formatTime } from '../../lib/format'

/**
 * Clickable activity card. Navigates to the history filtered by this flight.
 * The exact history route is still TBD — using a query param keeps the URL
 * stable and avoids inventing a route shape the backend hasn't defined.
 */
export function ActivityCard({ voo }: { voo: AtividadeVoo }) {
  return (
    <Link
      to={`/historico?voo=${voo.voo_id}`}
      aria-label={`Ver histórico do voo em ${voo.area_monitorada}`}
      className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Card
        className="flex items-center gap-6 p-7 transition-all duration-200
          group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_-6px_rgba(163,56,88,0.28)]
          group-hover:ring-accent/40"
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-soft text-primary">
          <DroneMark className="h-11 w-11" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-xl font-semibold text-text">
              {voo.area_monitorada}
            </h3>
            <ArrowUpRight
              className="h-5 w-5 shrink-0 text-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary"
              aria-hidden="true"
            />
          </div>
          <p className="text-base font-bold text-text-muted">
            Iniciado às{' '}
            <span className="text-primary">{formatTime(voo.timestamp_inicio)}</span>
          </p>
          <StatusPill status={voo.status_voo} />
        </div>

        <Telemetry bateria={voo.bateria} altura={voo.altura} />
      </Card>
    </Link>
  )
}

function Telemetry({ bateria, altura }: { bateria: number; altura: number }) {
  return (
    <div className="flex shrink-0 items-stretch gap-4 rounded-lg bg-surface-muted px-5 py-3">
      <Metric icon={<BatteryMedium className="h-6 w-6 rotate-90" strokeWidth={1.75} />} value={`${bateria}%`} />
      <span className="w-px self-stretch bg-border-strong" />
      <Metric icon={<Mountain className="h-6 w-6" strokeWidth={1.75} />} value={`${altura} m`} />
    </div>
  )
}

function Metric({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 text-primary">
      {icon}
      <span className="text-sm font-semibold">{value}</span>
    </div>
  )
}
