/**
 * EstacaoCard — card de uma estação/gateway na lista. Clicável: leva aos drones
 * daquele gateway. O ponto de status reflete se o gateway está publicando.
 */
import { Link } from 'react-router-dom'
import { ArrowUpRight, Radio } from 'lucide-react'
import { Card } from '../ui/Card'
import { DroneMark } from '../icons/DroneMark'
import { cn } from '../../lib/cn'
import type { Estacao } from '../../lib/api/estacoes'

export function EstacaoCard({ estacao }: { estacao: Estacao }) {
  return (
    <Link
      to={`/estacoes/${estacao.gateway_id}`}
      aria-label={`Abrir drones de ${estacao.nome}`}
      className="group block rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <Card
        className="flex items-center gap-6 p-7 transition-all duration-200
          group-hover:-translate-y-1 group-hover:shadow-[0_12px_24px_-6px_rgba(163,56,88,0.28)]"
      >
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-accent-soft text-primary">
          <DroneMark className="h-11 w-11" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-xl font-semibold text-text">
              {estacao.nome}
            </h3>
            <ArrowUpRight
              className="h-5 w-5 shrink-0 text-text-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary"
              aria-hidden="true"
            />
          </div>
          <StatusBadge ativo={estacao.ativo} />
        </div>
      </Card>
    </Link>
  )
}

function StatusBadge({ ativo }: { ativo: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-medium',
        ativo ? 'bg-accent-soft text-primary' : 'bg-surface-muted text-text-muted',
      )}
    >
      <Radio className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
      {ativo ? 'Conexão ativa' : 'Fora de serviço'}
    </span>
  )
}