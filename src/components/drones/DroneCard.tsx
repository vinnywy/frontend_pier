/**
 * DroneCard — card de um drone dentro de uma estação. Drone ativo permite
 * escolher a rota (square/road) e seguir para a tela de voo. Drone fora de
 * serviço fica desabilitado.
 */
import { useNavigate } from 'react-router-dom'
import { BatteryMedium } from 'lucide-react'
import { Card } from '../ui/Card'
import { DroneMark } from '../icons/DroneMark'
import { cn } from '../../lib/cn'
import type { DroneInfo } from '../../lib/api/estacoes'
import type { RouteId } from '../../lib/api/rotas'

const ROTAS: { id: RouteId; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'road', label: 'Road' },
]

export function DroneCard({
  gatewayId,
  drone,
}: {
  gatewayId: string
  drone: DroneInfo
}) {
  const navigate = useNavigate()

  const escolherRota = (routeId: RouteId) => {
    if (!drone.ativo) return
    navigate(`/estacoes/${gatewayId}/drone/${drone.id}/voo?rota=${routeId}`)
  }

  return (
    <Card className="flex items-center gap-6 p-7">
      <div
        className={cn(
          'flex h-20 w-20 shrink-0 items-center justify-center rounded-full',
          drone.ativo ? 'bg-accent-soft text-primary' : 'bg-surface-muted text-text-muted',
        )}
      >
        <DroneMark className="h-11 w-11" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 className="truncate text-xl font-semibold text-text">{drone.nome}</h3>
        <span
          className={cn(
            'inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
            drone.ativo ? 'bg-accent-soft text-primary' : 'bg-surface-muted text-text-muted',
          )}
        >
          <span className="relative flex h-2 w-2">
            {drone.ativo && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            )}
            <span
              className={cn(
                'relative inline-flex h-2 w-2 rounded-full',
                drone.ativo ? 'bg-accent' : 'bg-text-muted',
              )}
            />
          </span>
          {drone.ativo ? 'Conexão ativa' : 'Fora de serviço'}
        </span>
      </div>

      {drone.bateria !== null && (
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-lg bg-surface-muted px-5 py-3 text-primary">
          <BatteryMedium className="h-6 w-6 rotate-90" strokeWidth={1.75} />
          <span className="text-sm font-semibold">{drone.bateria}%</span>
        </div>
      )}

      <div className="flex shrink-0 flex-col gap-2">
        {ROTAS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            disabled={!drone.ativo}
            onClick={() => escolherRota(id)}
            className={cn(
              'rounded-lg px-5 py-2 text-sm font-semibold transition-colors',
              drone.ativo
                ? 'bg-accent-soft text-primary hover:bg-accent hover:text-white'
                : 'cursor-not-allowed bg-surface-muted text-text-muted',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </Card>
  )
}