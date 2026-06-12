import { useCallback } from 'react'
import {
  getAtividade,
  getDeteccoesChart,
  getResumo,
} from '../lib/api/dashboard'
import type { ChartRange } from '../lib/api/types'
import { useResource } from './useResource'

/** Home polling cadence per FRONTEND_ENDPOINTS.md. */
const HOME_POLL_MS = 30_000

export function useResumo() {
  return useResource((signal) => getResumo(signal), [], {
    intervalMs: HOME_POLL_MS,
  })
}

export function useAtividade() {
  return useResource(() => getAtividade(), [], { intervalMs: HOME_POLL_MS })
}

export function useDeteccoesChart(range: ChartRange) {
  const fetcher = useCallback(() => getDeteccoesChart(range), [range])
  return useResource(fetcher, [range])
}
