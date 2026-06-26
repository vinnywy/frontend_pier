/**
 * EstacaoDrones — drones cadastrados na estação clicada. Drone ativo permite
 * escolher a rota e seguir para a tela de voo. Mostra os KPIs da operação.
 */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Camera, Plane, AlertTriangle, BadgeCheck } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { KpiCard } from '../components/dashboard/KpiCard'
import { DroneCard } from '../components/drones/DroneCard'
import { getEstacao } from '../lib/api/estacoes'
import { getResumo } from '../lib/api/dashboard'
import type { Estacao } from '../lib/api/estacoes'
import type { DashboardResumo } from '../lib/api/types'

export default function EstacaoDrones() {
  const { gatewayId = '7' } = useParams()
  const [estacao, setEstacao] = useState<Estacao | null>(null)
  const [resumo, setResumo] = useState<DashboardResumo | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    getEstacao(gatewayId, ctrl.signal)
      .then(setEstacao)
      .catch(() => setEstacao(null))
    getResumo(ctrl.signal)
      .then(setResumo)
      .catch(() => setResumo(null))
    return () => ctrl.abort()
  }, [gatewayId])

  return (
    <>
      <PageHeader title={estacao?.nome ?? 'Estação'} />

      <section className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        <KpiCard label="Detecções Hoje" value={resumo?.total_deteccoes_hoje ?? '—'} icon={Camera} loading={!resumo} />
        <KpiCard label="Total de Vôos" value={resumo?.total_voos ?? '—'} icon={Plane} loading={!resumo} />
        <KpiCard label="Alertas Pendentes" value={resumo?.total_alertas_pendentes ?? '—'} icon={AlertTriangle} loading={!resumo} />
        <KpiCard label="Placas Confirmadas" value={resumo?.total_placas_pier_confirmadas ?? '—'} icon={BadgeCheck} loading={!resumo} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        {estacao === null
          ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="h-32 animate-pulse"><span /></Card>
            ))
          : estacao.drones.map((d) => (
              <DroneCard key={d.id} gatewayId={gatewayId} drone={d} />
            ))}
      </section>
    </>
  )
}