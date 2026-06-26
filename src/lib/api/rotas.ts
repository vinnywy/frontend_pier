/**
 * Rotas service — controla o voo do drone via backend (mesmo fluxo da CLI).
 * Fluxo: preparar → (gateway prepara) → estado pronta → iniciar → executa.
 * Tudo passa pelo backend; o frontend só dispara e acompanha por polling.
 */
import { apiGet, apiPost } from './client'

export type RouteId = 'square' | 'road'

export type EstadoRota =
  | 'idle'
  | 'preparando'
  | 'pronta'
  | 'iniciando'
  | 'em_execucao'
  | 'concluida'
  | 'erro'

export interface ComandoRota {
  action: string
  velocity_pct: number
  duration_s: number
}

export interface EstadoRotaResp {
  route_id: string
  estado: EstadoRota
  commands: ComandoRota[] | null
  total_duration_s: number | null
  resultado?: unknown
}

/** POST /rotas/preparar */
export function prepararRota(routeId: RouteId): Promise<EstadoRotaResp> {
  return apiPost<EstadoRotaResp>('/rotas/preparar', { route_id: routeId })
}

/** POST /rotas/{route_id}/iniciar */
export function iniciarRota(routeId: RouteId): Promise<EstadoRotaResp> {
  return apiPost<EstadoRotaResp>(`/rotas/${routeId}/iniciar`, {
    route_id: routeId,
    confirmed: true,
  })
}

/** GET /rotas/{route_id}/estado */
export function getEstadoRota(
  routeId: RouteId,
  signal?: AbortSignal,
): Promise<EstadoRotaResp> {
  return apiGet<EstadoRotaResp>(`/rotas/${routeId}/estado`, signal)
}