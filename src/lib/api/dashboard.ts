/**
 * Dashboard service. Components and hooks depend only on these functions —
 * never on `fetch` directly — so the mock/real switch is fully encapsulated.
 */
import { USE_MOCKS, apiGet, delay } from './client'
import {
  mockChart,
  mockResumo,
  mockVooAtivo,
  mockVooAtivoSecundario,
} from './mocks'
import type {
  AtividadeVoo,
  ChartRange,
  DashboardResumo,
  DeteccaoBucket,
  VooAtivo,
} from './types'

/** GET /dashboard/resumo */
export async function getResumo(signal?: AbortSignal): Promise<DashboardResumo> {
  if (USE_MOCKS) return delay(mockResumo)
  return apiGet<DashboardResumo>('/dashboard/resumo', signal)
}

/** GET /dashboard/voo-ativo/{drone_id} */
export async function getVooAtivo(
  droneId: number,
  signal?: AbortSignal,
): Promise<VooAtivo> {
  if (USE_MOCKS) return delay(mockVooAtivo)
  return apiGet<VooAtivo>(`/dashboard/voo-ativo/${droneId}`, signal)
}

function toAtividade(voo: VooAtivo, droneId: number): AtividadeVoo {
  return {
    voo_id: voo.voo_id,
    drone_id: droneId,
    area_monitorada: voo.area_monitorada,
    timestamp_inicio: mockResumo.ultimo_voo.timestamp_inicio,
    status_voo: voo.status_voo,
    bateria: voo.telemetria.bateria,
    altura: voo.telemetria.altura,
  }
}

/**
 * View-model for the "Atividade" cards. The backend has no "list active
 * flights" endpoint yet, so for now this composes mock flights. When such an
 * endpoint exists, swap the mock branch for a real call — the return type is
 * already the stable contract the UI consumes.
 */
export async function getAtividade(): Promise<AtividadeVoo[]> {
  if (USE_MOCKS) {
    return delay([
      toAtividade(mockVooAtivo, 1),
      toAtividade(mockVooAtivoSecundario, 2),
    ])
  }
  // TODO(backend): replace with the real list endpoint once available.
  const voo = await getVooAtivo(1)
  return [toAtividade(voo, 1)]
}

/**
 * Detections chart series. Currently mocked end-to-end (per the brief). When a
 * real aggregation endpoint exists, route it through here keyed by range.
 */
export async function getDeteccoesChart(
  range: ChartRange,
): Promise<DeteccaoBucket[]> {
  return delay(mockChart[range], 200)
}
