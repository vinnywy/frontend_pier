import { Search } from 'lucide-react'
import { SearchInput } from '../ui/SearchInput'
import { Select } from '../ui/Select'
import type { DetectionFilterState } from './detection-filters'

const STATUS_OPTIONS = [
  { value: 'todos', label: 'Buscar por Status' },
  { value: 'achado', label: 'Achado' },
  { value: 'nao_achado', label: 'Não Achado' },
  { value: 'pendente', label: 'Pendente' },
] as const

interface DetectionFiltersProps {
  value: DetectionFilterState
  onChange: (next: DetectionFilterState) => void
}

/** Functional filter bar (data + placas + status) shared by Histórico and Alertas. */
export function DetectionFilters({ value, onChange }: DetectionFiltersProps) {
  const set = <K extends keyof DetectionFilterState>(
    key: K,
    next: DetectionFilterState[K],
  ) => onChange({ ...value, [key]: next })

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SearchInput
        type="date"
        aria-label="Filtrar por data"
        className="min-w-[150px] flex-1"
        value={value.data}
        onChange={(v) => set('data', v)}
      />
      <SearchInput
        icon={Search}
        placeholder="Placa lida"
        className="min-w-[150px] flex-1"
        value={value.placaLida}
        onChange={(v) => set('placaLida', v)}
      />
      <SearchInput
        icon={Search}
        placeholder="Placa consultada"
        className="min-w-[150px] flex-1"
        value={value.placaConsultada}
        onChange={(v) => set('placaConsultada', v)}
      />
      <Select
        aria-label="Filtrar por status"
        className="min-w-[170px]"
        options={STATUS_OPTIONS}
        value={value.status}
        onChange={(v) => set('status', v as DetectionFilterState['status'])}
      />
    </div>
  )
}
