import { useState } from 'react'
import {
  AlertTriangle,
  PlaneTakeoff,
  Radar,
  ShieldCheck,
} from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { KpiCard } from '../components/dashboard/KpiCard'
import { DetectionsChart } from '../components/dashboard/DetectionsChart'
import { ActivityCard } from '../components/dashboard/ActivityCard'
import { Card } from '../components/ui/Card'
import {
  useAtividade,
  useDeteccoesChart,
  useResumo,
} from '../hooks/useDashboard'
import type { ChartRange } from '../lib/api/types'

export default function Home() {
  const { data: resumo, loading: resumoLoading } = useResumo()
  const { data: atividade, loading: atividadeLoading } = useAtividade()

  const [range, setRange] = useState<ChartRange>('hoje')
  const { data: chart, loading: chartLoading } = useDeteccoesChart(range)

  return (
    <>
      <PageHeader title="Overview" alertCount={resumo?.total_alertas_pendentes} />

      {/* KPIs + chart */}
      <section className="grid gap-5 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-4">
          <KpiCard
            className="col-span-2"
            label="Detecções — Hoje"
            value={resumo?.total_deteccoes_hoje ?? 0}
            icon={Radar}
            loading={resumoLoading}
          />
          <KpiCard
            label="Alertas Pendentes"
            value={resumo?.total_alertas_pendentes ?? 0}
            icon={AlertTriangle}
            loading={resumoLoading}
          />
          <KpiCard
            label="Total de Voos"
            value={resumo?.total_voos ?? 0}
            icon={PlaneTakeoff}
            loading={resumoLoading}
          />
          <KpiCard
            className="col-span-2"
            label="Placas Confirmadas"
            value={resumo?.total_placas_pier_confirmadas ?? 0}
            icon={ShieldCheck}
            loading={resumoLoading}
          />
        </div>

        <DetectionsChart
          data={chart ?? []}
          range={range}
          onRangeChange={setRange}
          loading={chartLoading}
        />
      </section>

      {/* Active flights */}
      <section className="flex flex-col gap-5">
        <h2 className="text-3xl font-medium text-primary">Atividade</h2>
        <div className="grid gap-5 xl:grid-cols-2">
          {atividadeLoading && !atividade
            ? Array.from({ length: 2 }).map((_, i) => <ActivitySkeleton key={i} />)
            : atividade?.map((voo) => (
                <ActivityCard key={voo.voo_id} voo={voo} />
              ))}
          {!atividadeLoading && atividade?.length === 0 && (
            <Card className="p-7 text-text-muted">Nenhum voo ativo no momento.</Card>
          )}
        </div>
      </section>
    </>
  )
}

function ActivitySkeleton() {
  return (
    <Card className="flex items-center gap-6 p-7">
      <div className="h-20 w-20 shrink-0 animate-pulse rounded-full bg-surface-muted" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-6 w-2/3 animate-pulse rounded bg-surface-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-surface-muted" />
        <div className="h-6 w-32 animate-pulse rounded-full bg-surface-muted" />
      </div>
      <div className="h-20 w-36 animate-pulse rounded-lg bg-surface-muted" />
    </Card>
  )
}
