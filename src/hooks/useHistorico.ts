import { useCallback } from 'react'
import { getHistorico } from '../lib/api/historico'
import { useResource } from './useResource'

/**
 * Loads the detection history once (no polling — it is an audit view).
 * `limite` mirrors the backend query param.
 */
export function useHistorico(limite = 50) {
  const fetcher = useCallback(
    (signal: AbortSignal) => getHistorico(limite, signal),
    [limite],
  )
  return useResource(fetcher, [limite])
}
