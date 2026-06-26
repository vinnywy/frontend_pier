import { useMemo, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { DetectionFilters } from '../components/filters/DetectionFilters'
import { EMPTY_FILTERS } from '../components/filters/detection-filters'
import type { DetectionFilterState } from '../components/filters/detection-filters'
import { AlertCard } from '../components/alertas/AlertCard'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { Card } from '../components/ui/Card'
import { useAlertasPendentes } from '../hooks/useAlertas'
import { updateAlertaStatus } from '../lib/api/alertas'
import type { AcaoAlerta, Alerta } from '../lib/api/types'

export default function Alertas() {
  const { data, loading } = useAlertasPendentes()
  const [filters, setFilters] = useState<DetectionFilterState>(EMPTY_FILTERS)
  // Resolved locally so a decided card disappears at once and never reappears
  // on the next poll (the real backend also drops it from /pendentes).
  const [resolved, setResolved] = useState<Set<number>>(new Set())
  const [submitting, setSubmitting] = useState<Set<number>>(new Set())
  const [error, setError] = useState<string | null>(null)

  const pending = useMemo(
    () =>
      (data ?? []).filter(
        (a) =>
          a?.consulta_pier?.deteccao &&
          !resolved.has(a.id) &&
          matchesFilters(a, filters),
      ),
    [data, resolved, filters],
  )

  const handleResolve = async (id: number, acao: AcaoAlerta) => {
    setError(null)
    setSubmitting((prev) => new Set(prev).add(id))
    setResolved((prev) => new Set(prev).add(id)) // optimistic
    try {
      await updateAlertaStatus(id, acao)
    } catch {
      setResolved((prev) => withoutId(prev, id)) // revert on failure
      setError('Não foi possível atualizar o alerta. Tente novamente.')
    } finally {
      setSubmitting((prev) => withoutId(prev, id))
    }
  }

  return (
    <>
      <PageHeader title="Alertas" alertCount={pending.length} />
      <DetectionFilters value={filters} onChange={setFilters} />

      {error && (
        <Card className="border-l-4 border-red-500 p-4 text-sm text-red-500">
          {error}
        </Card>
      )}

      <ErrorBoundary>
        <section className="flex flex-col gap-5">
          {loading && !data ? (
            Array.from({ length: 2 }).map((_, i) => <AlertSkeleton key={i} />)
          ) : pending.length === 0 ? (
            <EmptyState filtered={(data ?? []).length > 0} />
          ) : (
            pending.map((alerta) => (
              <AlertCard
                key={alerta.id}
                alerta={alerta}
                submitting={submitting.has(alerta.id)}
                onResolve={handleResolve}
              />
            ))
          )}
        </section>
      </ErrorBoundary>
    </>
  )
}

function EmptyState({ filtered }: { filtered: boolean }) {
  return (
    <Card className="flex flex-col items-center gap-3 p-12 text-center">
      <ShieldCheck className="h-10 w-10 text-primary" aria-hidden="true" />
      <p className="text-text-muted">
        {filtered
          ? 'Nenhum alerta corresponde aos filtros aplicados.'
          : 'Nenhum alerta pendente no momento.'}
      </p>
    </Card>
  )
}

function AlertSkeleton() {
  return (
    <Card className="flex flex-col gap-6 p-4 lg:flex-row">
      <div className="h-48 w-full animate-pulse rounded-lg bg-surface-muted lg:h-[200px] lg:w-72" />
      <div className="flex flex-1 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex flex-1 flex-col gap-2">
            <div className="h-6 w-1/2 animate-pulse rounded bg-surface-muted" />
            {Array.from({ length: 5 }).map((_, j) => (
              <div
                key={j}
                className="h-4 w-3/4 animate-pulse rounded bg-surface-muted"
              />
            ))}
          </div>
        ))}
      </div>
    </Card>
  )
}

function withoutId(set: Set<number>, id: number): Set<number> {
  const next = new Set(set)
  next.delete(id)
  return next
}

function matchesFilters(alerta: Alerta, f: DetectionFilterState): boolean {
  const consulta = alerta.consulta_pier
  const deteccao = consulta?.deteccao
  if (!deteccao) return false
  const { placa_consultada, resultado } = consulta

  if (f.data && (deteccao.timestamp ?? '').slice(0, 10) !== f.data) return false

  if (
    f.placaLida &&
    !(deteccao.placa_lida ?? '').toLowerCase().includes(f.placaLida.toLowerCase())
  ) {
    return false
  }

  if (
    f.placaConsultada &&
    !(placa_consultada ?? '').toLowerCase().includes(f.placaConsultada.toLowerCase())
  ) {
    return false
  }

  if (f.status !== 'todos' && resultado !== f.status) return false

  return true
}