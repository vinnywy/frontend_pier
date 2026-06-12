import { useCallback, useEffect, useRef, useState } from 'react'

export interface ResourceState<T> {
  data: T | undefined
  /** True only on the first load (no data yet). Polling refreshes don't set it. */
  loading: boolean
  error: Error | undefined
  /** Imperatively re-run the fetcher (e.g. a manual refresh button). */
  refetch: () => void
}

interface Options {
  /** Poll interval in ms. Omit/0 to fetch once. See the polling cadences in
   *  FRONTEND_ENDPOINTS.md (Home → 30s, Monitor → 3s, Alertas → 5s). */
  intervalMs?: number
}

/**
 * Generic resource loader with optional polling and abort handling.
 * `deps` controls when the fetcher identity changes (e.g. a route param).
 */
export function useResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: ReadonlyArray<unknown> = [],
  { intervalMs }: Options = {},
): ResourceState<T> {
  const [data, setData] = useState<T>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error>()

  // Keep the latest fetcher without forcing the effect to re-run on every render.
  // Updated in an effect (not during render) so the poll effect below — which
  // runs afterwards on the same commit — always sees the current fetcher.
  const fetcherRef = useRef(fetcher)
  useEffect(() => {
    fetcherRef.current = fetcher
  })

  const [tick, setTick] = useState(0)
  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    const run = async () => {
      try {
        const result = await fetcherRef.current(controller.signal)
        if (active) {
          setData(result)
          setError(undefined)
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          setError(err instanceof Error ? err : new Error(String(err)))
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    run()

    const id = intervalMs ? window.setInterval(run, intervalMs) : undefined
    return () => {
      active = false
      controller.abort()
      if (id) window.clearInterval(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, intervalMs, ...deps])

  return { data, loading, error, refetch }
}
