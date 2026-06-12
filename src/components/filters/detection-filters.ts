import type { PierStatus } from '../../lib/api/types'

/** Shared filter state for the detection-style tables/lists. */
export interface DetectionFilterState {
  /** yyyy-mm-dd, as produced by a native date input. */
  data: string
  placaLida: string
  placaConsultada: string
  status: PierStatus | 'todos'
}

export const EMPTY_FILTERS: DetectionFilterState = {
  data: '',
  placaLida: '',
  placaConsultada: '',
  status: 'todos',
}
