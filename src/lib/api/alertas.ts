/**
 * Alerts service. The "tinder" actions (confirm / discard) go through
 * `updateAlertaStatus`; switching to the real backend is a `USE_MOCKS` flip.
 */
import { USE_MOCKS, apiGet, apiPatch, delay } from './client'
import { mockAlertas } from './mocks'
import type { AcaoAlerta, Alerta, AlertaStatusUpdate } from './types'

// TODO(auth): replace with the authenticated operator id once auth exists.
const OPERADOR = 'op-01'

/** GET /alertas/pendentes */
export async function getAlertasPendentes(
  signal?: AbortSignal,
): Promise<Alerta[]> {
  if (USE_MOCKS) return delay(mockAlertas)
  return apiGet<Alerta[]>('/alertas/pendentes', signal)
}

/**
 * PATCH /alertas/{id}/status — `confirmado` records the sinistro, `descartado`
 * marks a false positive. The backend persists both to the history.
 */
export async function updateAlertaStatus(
  id: number,
  status: AcaoAlerta,
): Promise<AlertaStatusUpdate> {
  if (USE_MOCKS) {
    return delay({
      id,
      status_alerta: status,
      operador_notificado: OPERADOR,
      timestamp: new Date().toISOString(),
    })
  }
  return apiPatch<AlertaStatusUpdate>(`/alertas/${id}/status`, {
    status,
    operador: OPERADOR,
  })
}
