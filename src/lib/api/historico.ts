/**
 * Detection-history service. Like the dashboard service, components and hooks
 * depend only on these functions, so flipping `USE_MOCKS` is the only change
 * needed when the backend ships.
 */
import { USE_MOCKS, apiGet, delay } from './client'
import { mockHistorico } from './mocks'
import type { DeteccaoHistorico } from './types'

/** GET /deteccoes/historico/placas?limite=50 */
export async function getHistorico(
  limite = 50,
  signal?: AbortSignal,
): Promise<DeteccaoHistorico[]> {
  if (USE_MOCKS) return delay(mockHistorico)
  return apiGet<DeteccaoHistorico[]>(
    `/deteccoes/historico/placas?limite=${limite}`,
    signal,
  )
}
