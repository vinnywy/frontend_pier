/**
 * Thin transport layer. All network access goes through `apiGet` so that
 * switching from mocks to the real backend is a single env-var flip and the
 * base URL is configured in exactly one place.
 *
 * Configure via a `.env` file (see `.env.example`):
 *   VITE_API_BASE_URL=https://gateway.local
 *   VITE_USE_MOCKS=false
 */

const BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

/** When true (default until the backend is ready), services return mock data. */
export const USE_MOCKS =
  (import.meta.env.VITE_USE_MOCKS ?? 'true').toLowerCase() !== 'false'

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  if (!res.ok) {
    throw new ApiError(`GET ${path} failed`, res.status)
  }

  return res.json() as Promise<T>
}

export async function apiPatch<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    throw new ApiError(`PATCH ${path} failed`, res.status)
  }

  return res.json() as Promise<T>
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  signal?: AbortSignal,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    throw new ApiError(`POST ${path} failed`, res.status)
  }

  return res.json() as Promise<T>
}

/** Resolves after `ms`, used to simulate network latency for mock responses. */
export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}

/**
 * Resolves a backend `imagem_path` (e.g. "images/uuid.jpg") to a full URL.
 * Absolute URLs pass through untouched. When the gateway exposes the images,
 * this is the single place that needs to know how they are served.
 */
export function imageUrl(path: string): string {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${BASE_URL}/${path.replace(/^\//, '')}`
}