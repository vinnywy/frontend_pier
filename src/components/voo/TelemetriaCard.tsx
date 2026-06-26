/**
 * TelemetriaCard — exibe os campos do JSON de telemetria do drone.
 * Usado ao lado do stream na tela de voo. Mostra "—" quando não há dado.
 */
import { BatteryMedium, Mountain, Compass, Thermometer } from 'lucide-react'
import { Card } from '../ui/Card'
import type { Telemetria } from '../../lib/api/types'

function fmt(v: number | null | undefined, suffix = ''): string {
  return v === null || v === undefined ? '—' : `${v}${suffix}`
}

export function TelemetriaCard({
  telemetria,
}: {
  telemetria: Telemetria | null
}) {
  const rows = [
    {
      icon: BatteryMedium,
      label: 'Bateria',
      value: fmt(telemetria?.bateria, '%'),
    },
    { icon: Mountain, label: 'Altura', value: fmt(telemetria?.altura, ' cm') },
    { icon: Compass, label: 'Yaw', value: fmt(telemetria?.yaw, '°') },
    {
      icon: Thermometer,
      label: 'Temp. máx.',
      value: fmt(telemetria?.temperatura_max, '°C'),
    },
  ]

  return (
    <Card className="flex h-full min-h-0 flex-1 flex-col gap-4 overflow-hidden border-t-[6px] border-t-accent p-6">
      <h3 className="text-xl font-semibold text-text">Telemetria</h3>
      <dl className="flex flex-1 flex-col justify-around gap-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 text-text-muted">
              <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-base">{label}</span>
            </dt>
            <dd className="text-base font-semibold text-primary">{value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}