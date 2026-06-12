/**
 * TypeScript mirror of the backend JSON contracts described in
 * FRONTEND_ENDPOINTS.md. Keeping these in one place means that when the
 * backend ships, the only thing that changes is the transport layer
 * (see `client.ts`) — components and hooks stay untouched.
 */

export type StatusVoo = 'em_andamento' | 'concluido' | 'cancelado'
export type PierStatus = 'achado' | 'nao_achado' | 'pendente'
export type StatusAlerta = 'pendente' | 'confirmado' | 'descartado'

/** GET /dashboard/resumo → `ultimo_voo` */
export interface VooResumo {
  id: number
  area_monitorada: string
  /** ISO-8601 timestamp */
  timestamp_inicio: string
  status_voo: StatusVoo
}

/** GET /dashboard/resumo */
export interface DashboardResumo {
  total_voos: number
  total_deteccoes_hoje: number
  total_alertas_pendentes: number
  total_placas_pier_confirmadas: number
  ultimo_voo: VooResumo
}

export interface Telemetria {
  bateria: number
  altura: number
  yaw: number
  temperatura_max: number
  /** ISO-8601 timestamp */
  timestamp: string
}

/**
 * VLM-derived fields (`marca_veiculo`, `modelo_veiculo`, `cor`,
 * `dano_detectado`) are filled asynchronously and may be null.
 */
export interface DeteccaoRecente {
  id: number
  placa_lida: string
  confianca_ocr: number
  timestamp: string
  pier_status: PierStatus
  alerta_id: number | null
  marca_veiculo: string | null
  modelo_veiculo: string | null
  cor: string | null
  dano_detectado: boolean | null
}

/** GET /dashboard/voo-ativo/{drone_id} */
export interface VooAtivo {
  voo_id: number
  status_voo: StatusVoo
  area_monitorada: string
  duracao_segundos: number
  telemetria: Telemetria
  deteccoes_recentes: DeteccaoRecente[]
}

/**
 * View-model for the "Atividade" cards on the Home screen. There is no single
 * backend endpoint that lists every active flight yet, so the service layer
 * composes this from `resumo.ultimo_voo` + the matching `voo-ativo`
 * telemetry. When the backend exposes a list endpoint, only the service
 * implementation in `dashboard.ts` needs to change.
 */
export interface AtividadeVoo {
  voo_id: number
  drone_id: number
  area_monitorada: string
  timestamp_inicio: string
  status_voo: StatusVoo
  bateria: number
  altura: number
}

/** A single bucket of the (currently mocked) detections chart. */
export interface DeteccaoBucket {
  label: string
  value: number
}

export type ChartRange = 'hoje' | 'semana'

/** One Pier lookup attached to a historic detection. */
export interface ConsultaPier {
  resultado: PierStatus
  placa_consultada: string
  /** ISO-8601 timestamp */
  timestamp_consulta: string
}

/** Raw Pier vehicle record (external API shape — English keys). */
export interface VeiculoPier {
  make: string
  model: string
  fabrication_year: number
  color: string
  status: string
  claims: unknown[]
}

export interface RespostaPierRaw {
  vehicle_lookup_id: string
  vehicle: VeiculoPier
}

/** Detection embedded in an alert (richer than `DeteccaoRecente`). */
export interface DeteccaoAlerta {
  id: number
  imagem_path: string
  placa_lida: string
  confianca_ocr: number
  marca_veiculo: string | null
  modelo_veiculo: string | null
  ano_veiculo: string | null
  cor: string | null
  dano_detectado: boolean | null
  descricao_dano: string | null
  /** ISO-8601 timestamp */
  timestamp: string
  voo: {
    id: number
    area_monitorada: string
    timestamp_inicio: string
  }
}

export interface ConsultaPierAlerta {
  placa_consultada: string
  resultado: PierStatus
  resposta_raw: RespostaPierRaw
  deteccao: DeteccaoAlerta
}

/** GET /alertas/pendentes → one item. */
export interface Alerta {
  id: number
  /** ISO-8601 timestamp */
  timestamp: string
  status_alerta: StatusAlerta
  consulta_pier: ConsultaPierAlerta
}

/** The operator's decision sent to PATCH /alertas/{id}/status. */
export type AcaoAlerta = 'confirmado' | 'descartado'

/** PATCH /alertas/{id}/status → response. */
export interface AlertaStatusUpdate {
  id: number
  status_alerta: StatusAlerta
  operador_notificado: string
  /** ISO-8601 timestamp */
  timestamp: string
}

/**
 * GET /deteccoes/historico/placas → one row.
 * VLM-derived fields (`marca_veiculo`, `modelo_veiculo`, `ano_veiculo`, `cor`,
 * `dano_detectado`) are filled asynchronously and may be null.
 */
export interface DeteccaoHistorico {
  id: number
  /** ISO-8601 timestamp */
  timestamp: string
  placa_lida: string
  confianca_ocr: number
  marca_veiculo: string | null
  modelo_veiculo: string | null
  ano_veiculo: string | null
  cor: string | null
  dano_detectado: boolean | null
  /** Path on the gateway; resolve with `imageUrl()` from the transport layer. */
  imagem_path: string
  consulta_pier: ConsultaPier[]
}
