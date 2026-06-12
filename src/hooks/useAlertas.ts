import { getAlertasPendentes } from '../lib/api/alertas'
import { useResource } from './useResource'

/** Alerts polling cadence per FRONTEND_ENDPOINTS.md. */
const ALERTAS_POLL_MS = 5_000

export function useAlertasPendentes() {
  return useResource((signal) => getAlertasPendentes(signal), [], {
    intervalMs: ALERTAS_POLL_MS,
  })
}
