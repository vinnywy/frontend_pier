import { useMemo, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { DetectionFilters } from '../components/filters/DetectionFilters'
import { EMPTY_FILTERS } from '../components/filters/detection-filters'
import type { DetectionFilterState } from '../components/filters/detection-filters'
import { HistoricoTable } from '../components/historico/HistoricoTable'
import { Pagination } from '../components/historico/Pagination'
import { Card } from '../components/ui/Card'
import { useHistorico } from '../hooks/useHistorico'
import type { DeteccaoHistorico } from '../lib/api/types'

export default function Historico() {
  const { data, loading } = useHistorico()
  const [filters, setFilters] = useState<DetectionFilterState>(EMPTY_FILTERS)
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => (data ?? []).filter((d) => matchesFilters(d, filters)),
    [data, filters],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  // Clamp so deleting/filtering rows never leaves us on an empty page.
  const current = Math.min(page, pageCount)
  const rows = filtered.slice((current - 1) * pageSize, current * pageSize)

  const handleFilters = (next: DetectionFilterState) => {
    setFilters(next)
    setPage(1)
  }
  const handlePageSize = (size: number) => {
    setPageSize(size)
    setPage(1)
  }

  return (
    <>
      <PageHeader title="Histórico" />
      <DetectionFilters value={filters} onChange={handleFilters} />

      <Card className="overflow-hidden">
        <HistoricoTable rows={rows} loading={loading} />
        {!loading && (
          <Pagination
            page={current}
            pageCount={pageCount}
            pageSize={pageSize}
            total={filtered.length}
            shown={rows.length}
            onPageChange={setPage}
            onPageSizeChange={handlePageSize}
          />
        )}
      </Card>
    </>
  )
}

function matchesFilters(
  det: DeteccaoHistorico,
  f: DetectionFilterState,
): boolean {
  if (f.data && det.timestamp.slice(0, 10) !== f.data) return false

  if (
    f.placaLida &&
    !det.placa_lida.toLowerCase().includes(f.placaLida.toLowerCase())
  ) {
    return false
  }

  if (
    f.placaConsultada &&
    !det.consulta_pier.some((c) =>
      c.placa_consultada.toLowerCase().includes(f.placaConsultada.toLowerCase()),
    )
  ) {
    return false
  }

  if (
    f.status !== 'todos' &&
    !det.consulta_pier.some((c) => c.resultado === f.status)
  ) {
    return false
  }

  return true
  }
