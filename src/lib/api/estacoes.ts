/**
 * Estações (gateways) e seus drones.
 *
 * Não há endpoint de "listar gateways" no backend ainda. Nesta etapa o sistema
 * opera com UM gateway real (o notebook, GATEWAY_ID=7). Compomos o view-model
 * a partir do que existe: o status do stream (se está publicando) define se o
 * gateway/drone está ativo, e o /dashboard/voo-ativo dá a telemetria.
 *
 * Quando o backend expuser uma lista de gateways, só este arquivo muda.
 */
import { USE_MOCKS, apiGet, delay } from './client'
import { getVooAtivo } from './dashboard'
import type { Telemetria } from './types'

export interface DroneInfo {
  id: number
  nome: string
  ativo: boolean
  bateria: number | null
  telemetria: Telemetria | null
}

export interface Estacao {
  gateway_id: string
  nome: string
  ativo: boolean
  drones: DroneInfo[]
}

interface StreamStatus {
  gateway_id: string
  ativo: boolean
  tem_frame: boolean
}

const GATEWAY_ID = '7'
const DRONE_ID = 7

/** GET /stream/gateway/{id}/status — diz se o gateway está publicando. */
async function getStreamStatus(
  gatewayId: string,
  signal?: AbortSignal,
): Promise<boolean> {
  try {
    const r = await apiGet<StreamStatus>(
      `/stream/gateway/${gatewayId}/status`,
      signal,
    )
    return Boolean(r.ativo)
  } catch {
    return false
  }
}

/**
 * Lista as estações. Real: um gateway, cujo "ativo" vem do status do stream.
 * O drone real (id 7) fica ativo quando o gateway publica; um segundo drone é
 * mockado para ilustrar o layout e nunca fica ativo.
 */
export async function getEstacoes(signal?: AbortSignal): Promise<Estacao[]> {
  if (USE_MOCKS) {
    return delay([
      {
        gateway_id: GATEWAY_ID,
        nome: 'Estação Butantã',
        ativo: true,
        drones: [],
      },
    ])
  }

  const ativo = await getStreamStatus(GATEWAY_ID, signal)
  return [
    {
      gateway_id: GATEWAY_ID,
      nome: 'Estação Butantã',
      ativo,
      drones: [],
    },
  ]
}

/** Detalhe de uma estação com seus drones (1 real + 1 mockado). */
export async function getEstacao(
  gatewayId: string,
  signal?: AbortSignal,
): Promise<Estacao> {
  const ativo = USE_MOCKS ? true : await getStreamStatus(gatewayId, signal)

  let telemetria: Telemetria | null = null
  let bateria: number | null = null
  if (ativo) {
    try {
      const voo = await getVooAtivo(DRONE_ID, signal)
      telemetria = voo.telemetria
      bateria = voo.telemetria.bateria
    } catch {
      // sem voo ativo ainda — segue só com o status
    }
  }

  return {
    gateway_id: gatewayId,
    nome: 'Estação Butantã',
    ativo,
    drones: [
      {
        id: DRONE_ID,
        nome: 'Drone A',
        ativo,
        bateria,
        telemetria,
      },
      // Drone mockado: ilustra o layout, nunca fica ativo.
      { id: -1, nome: 'Drone B', ativo: false, bateria: 78, telemetria: null },
    ],
  }
}