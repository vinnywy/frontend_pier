import type {
  Alerta,
  DashboardResumo,
  DeteccaoBucket,
  DeteccaoHistorico,
  VooAtivo,
} from './types'

/**
 * Mock payloads mirroring the exact shapes in FRONTEND_ENDPOINTS.md.
 * These are consumed only while `USE_MOCKS` is true.
 */

export const mockResumo: DashboardResumo = {
  total_voos: 14,
  total_deteccoes_hoje: 37,
  total_alertas_pendentes: 2,
  total_placas_pier_confirmadas: 8,
  ultimo_voo: {
    id: 12,
    area_monitorada: 'Estacionamento Norte',
    timestamp_inicio: '2026-06-11T18:00:00Z',
    status_voo: 'em_andamento',
  },
}

export const mockVooAtivo: VooAtivo = {
  voo_id: 12,
  status_voo: 'em_andamento',
  area_monitorada: 'Estacionamento Norte',
  duracao_segundos: 847,
  telemetria: {
    bateria: 78,
    altura: 120,
    yaw: 45.0,
    temperatura_max: 27,
    timestamp: '2026-06-11T19:10:00Z',
  },
  deteccoes_recentes: [
    {
      id: 55,
      placa_lida: 'MJF4A91',
      confianca_ocr: 0.92,
      timestamp: '2026-06-11T19:08:00Z',
      pier_status: 'achado',
      alerta_id: 3,
      marca_veiculo: 'Chevrolet',
      modelo_veiculo: 'Celta',
      cor: 'cinza',
      dano_detectado: false,
    },
  ],
}

/** A second active flight so the "Atividade" grid demonstrates a list. */
export const mockVooAtivoSecundario: VooAtivo = {
  ...mockVooAtivo,
  voo_id: 13,
  duracao_segundos: 312,
  area_monitorada: 'Estacionamento Norte',
  telemetria: { ...mockVooAtivo.telemetria, bateria: 78, altura: 120 },
}

/**
 * Pending alerts awaiting an operator decision. Each mirrors the exact
 * `/alertas/pendentes` contract (detection vs. raw Pier response).
 */
export const mockAlertas: Alerta[] = [
  {
    id: 3,
    timestamp: '2026-06-11T19:05:00Z',
    status_alerta: 'pendente',
    consulta_pier: {
      placa_consultada: 'MJF4A91',
      resultado: 'achado',
      resposta_raw: {
        vehicle_lookup_id: '876543kljhgfd212a',
        vehicle: {
          make: 'GM - Chevrolet',
          model: 'Camaro SS 6.2 V8',
          fabrication_year: 2024,
          color: 'Amarelo',
          status: 'active',
          claims: [],
        },
      },
      deteccao: {
        id: 55,
        imagem_path: 'images/mjf4a91.jpg',
        placa_lida: 'MJF4A91',
        confianca_ocr: 0.92,
        marca_veiculo: 'Chevrolet',
        modelo_veiculo: 'Celta',
        ano_veiculo: '2023-2024',
        cor: 'Amarelo',
        dano_detectado: false,
        descricao_dano: null,
        timestamp: '2026-06-11T19:05:00Z',
        voo: {
          id: 12,
          area_monitorada: 'Estacionamento Norte',
          timestamp_inicio: '2026-06-11T18:00:00Z',
        },
      },
    },
  },
  {
    id: 4,
    timestamp: '2026-06-11T18:10:00Z',
    status_alerta: 'pendente',
    consulta_pier: {
      placa_consultada: 'KLP9D21',
      resultado: 'achado',
      resposta_raw: {
        vehicle_lookup_id: '112233aabbccdd44',
        vehicle: {
          make: 'Fiat',
          model: 'Toro Volcano 2.0 Turbo Diesel',
          fabrication_year: 2023,
          color: 'Vermelho',
          status: 'stolen',
          claims: ['BO-2026-00891'],
        },
      },
      deteccao: {
        id: 53,
        imagem_path: 'images/klp9d21.jpg',
        placa_lida: 'KLP9D21',
        confianca_ocr: 0.88,
        marca_veiculo: 'Fiat',
        modelo_veiculo: 'Toro',
        ano_veiculo: '2022-2024',
        cor: 'Vermelho',
        dano_detectado: true,
        descricao_dano: 'Risco na lateral direita',
        timestamp: '2026-06-11T18:10:00Z',
        voo: {
          id: 12,
          area_monitorada: 'Estacionamento Norte',
          timestamp_inicio: '2026-06-11T18:00:00Z',
        },
      },
    },
  },
  {
    id: 5,
    timestamp: '2026-06-10T20:02:00Z',
    status_alerta: 'pendente',
    consulta_pier: {
      placa_consultada: 'PWE3A77',
      resultado: 'achado',
      resposta_raw: {
        vehicle_lookup_id: '998877zzxxyy66',
        vehicle: {
          make: 'Honda',
          model: 'Civic Touring 1.5 Turbo',
          fabrication_year: 2021,
          color: 'Branco',
          status: 'active',
          claims: [],
        },
      },
      deteccao: {
        id: 50,
        imagem_path: 'images/pwe3a77.jpg',
        placa_lida: 'PWE3A77',
        confianca_ocr: 0.95,
        marca_veiculo: 'Honda',
        modelo_veiculo: 'Civic',
        ano_veiculo: '2020-2022',
        cor: 'Branco',
        dano_detectado: false,
        descricao_dano: null,
        timestamp: '2026-06-10T20:02:00Z',
        voo: {
          id: 11,
          area_monitorada: 'Pátio Leste',
          timestamp_inicio: '2026-06-10T19:30:00Z',
        },
      },
    },
  },
]

/**
 * Mock-only: a brand-new sinistro that "arrives" after the first poll so the
 * `NewAlertPopup` can be demonstrated. The real backend simply returns it in
 * `/alertas/pendentes` once detected — no special handling needed.
 */
export const mockNovoSinistro: Alerta = {
  id: 99,
  timestamp: '2026-06-12T08:30:00Z',
  status_alerta: 'pendente',
  consulta_pier: {
    placa_consultada: 'XYZ7H30',
    resultado: 'achado',
    resposta_raw: {
      vehicle_lookup_id: 'aa11bb22cc33dd44',
      vehicle: {
        make: 'Volkswagen',
        model: 'Nivus Highline 1.0 TSI',
        fabrication_year: 2023,
        color: 'Azul',
        status: 'stolen',
        claims: ['BO-2026-01044'],
      },
    },
    deteccao: {
      id: 60,
      imagem_path: 'images/xyz7h30.jpg',
      placa_lida: 'XYZ7H30',
      confianca_ocr: 0.97,
      marca_veiculo: 'Volkswagen',
      modelo_veiculo: 'Nivus',
      ano_veiculo: '2022-2024',
      cor: 'Azul',
      dano_detectado: false,
      descricao_dano: null,
      timestamp: '2026-06-12T08:30:00Z',
      voo: {
        id: 14,
        area_monitorada: 'Estacionamento Norte',
        timestamp_inicio: '2026-06-12T08:00:00Z',
      },
    },
  },
}

/**
 * Detection history. Mixed Pier results, a few null VLM fields, and spread
 * across days so the filters and pagination are exercised end-to-end.
 */
export const mockHistorico: DeteccaoHistorico[] = [
  {
    id: 55,
    timestamp: '2026-06-11T19:05:00Z',
    placa_lida: 'MJF4A91',
    confianca_ocr: 0.96,
    marca_veiculo: 'Chevrolet',
    modelo_veiculo: 'Camaro',
    ano_veiculo: '2023-2025',
    cor: 'Amarelo',
    dano_detectado: false,
    imagem_path: 'images/mjf4a91.jpg',
    consulta_pier: [
      {
        resultado: 'achado',
        placa_consultada: 'MJF4A91',
        timestamp_consulta: '2026-06-11T19:05:01Z',
      },
    ],
  },
  {
    id: 54,
    timestamp: '2026-06-11T18:42:00Z',
    placa_lida: 'RQT2B88',
    confianca_ocr: 0.9,
    marca_veiculo: 'Volkswagen',
    modelo_veiculo: 'Gol',
    ano_veiculo: '2019-2021',
    cor: 'Prata',
    dano_detectado: false,
    imagem_path: 'images/rqt2b88.jpg',
    consulta_pier: [
      {
        resultado: 'nao_achado',
        placa_consultada: 'RQT2B88',
        timestamp_consulta: '2026-06-11T18:42:02Z',
      },
    ],
  },
  {
    id: 53,
    timestamp: '2026-06-11T18:10:00Z',
    placa_lida: 'KLP9D21',
    confianca_ocr: 0.88,
    marca_veiculo: 'Fiat',
    modelo_veiculo: 'Toro',
    ano_veiculo: '2022-2024',
    cor: 'Vermelho',
    dano_detectado: true,
    imagem_path: 'images/klp9d21.jpg',
    consulta_pier: [
      {
        resultado: 'achado',
        placa_consultada: 'KLP9D21',
        timestamp_consulta: '2026-06-11T18:10:03Z',
      },
    ],
  },
  {
    id: 52,
    timestamp: '2026-06-11T17:55:00Z',
    placa_lida: 'BXT5F09',
    confianca_ocr: 0.72,
    marca_veiculo: null,
    modelo_veiculo: null,
    ano_veiculo: null,
    cor: null,
    dano_detectado: null,
    imagem_path: 'images/bxt5f09.jpg',
    consulta_pier: [
      {
        resultado: 'pendente',
        placa_consultada: 'BXT5F09',
        timestamp_consulta: '2026-06-11T17:55:01Z',
      },
    ],
  },
  {
    id: 51,
    timestamp: '2026-06-11T17:20:00Z',
    placa_lida: 'GHN7C44',
    confianca_ocr: 0.94,
    marca_veiculo: 'Toyota',
    modelo_veiculo: 'Corolla',
    ano_veiculo: '2021-2023',
    cor: 'Preto',
    dano_detectado: false,
    imagem_path: 'images/ghn7c44.jpg',
    consulta_pier: [
      {
        resultado: 'nao_achado',
        placa_consultada: 'GHN7C44',
        timestamp_consulta: '2026-06-11T17:20:02Z',
      },
    ],
  },
  {
    id: 50,
    timestamp: '2026-06-10T20:02:00Z',
    placa_lida: 'PWE3A77',
    confianca_ocr: 0.91,
    marca_veiculo: 'Honda',
    modelo_veiculo: 'Civic',
    ano_veiculo: '2020-2022',
    cor: 'Branco',
    dano_detectado: false,
    imagem_path: 'images/pwe3a77.jpg',
    consulta_pier: [
      {
        resultado: 'achado',
        placa_consultada: 'PWE3A77',
        timestamp_consulta: '2026-06-10T20:02:04Z',
      },
    ],
  },
  {
    id: 49,
    timestamp: '2026-06-10T19:31:00Z',
    placa_lida: 'TUV8K12',
    confianca_ocr: 0.85,
    marca_veiculo: 'Jeep',
    modelo_veiculo: 'Compass',
    ano_veiculo: '2022-2024',
    cor: 'Cinza',
    dano_detectado: false,
    imagem_path: 'images/tuv8k12.jpg',
    consulta_pier: [
      {
        resultado: 'nao_achado',
        placa_consultada: 'TUV8K12',
        timestamp_consulta: '2026-06-10T19:31:01Z',
      },
    ],
  },
  {
    id: 48,
    timestamp: '2026-06-10T18:47:00Z',
    placa_lida: 'CDE4M55',
    confianca_ocr: 0.79,
    marca_veiculo: 'Hyundai',
    modelo_veiculo: 'HB20',
    ano_veiculo: '2019-2021',
    cor: 'Azul',
    dano_detectado: true,
    imagem_path: 'images/cde4m55.jpg',
    consulta_pier: [
      {
        resultado: 'pendente',
        placa_consultada: 'CDE4M55',
        timestamp_consulta: '2026-06-10T18:47:02Z',
      },
    ],
  },
  {
    id: 47,
    timestamp: '2026-06-10T18:05:00Z',
    placa_lida: 'FGH6N33',
    confianca_ocr: 0.93,
    marca_veiculo: 'Renault',
    modelo_veiculo: 'Kwid',
    ano_veiculo: '2021-2023',
    cor: 'Laranja',
    dano_detectado: false,
    imagem_path: 'images/fgh6n33.jpg',
    consulta_pier: [
      {
        resultado: 'achado',
        placa_consultada: 'FGH6N33',
        timestamp_consulta: '2026-06-10T18:05:03Z',
      },
    ],
  },
  {
    id: 46,
    timestamp: '2026-06-09T21:14:00Z',
    placa_lida: 'JKL2P90',
    confianca_ocr: 0.87,
    marca_veiculo: 'Ford',
    modelo_veiculo: 'Ranger',
    ano_veiculo: '2023-2025',
    cor: 'Preto',
    dano_detectado: false,
    imagem_path: 'images/jkl2p90.jpg',
    consulta_pier: [
      {
        resultado: 'nao_achado',
        placa_consultada: 'JKL2P90',
        timestamp_consulta: '2026-06-09T21:14:01Z',
      },
    ],
  },
  {
    id: 45,
    timestamp: '2026-06-09T20:38:00Z',
    placa_lida: 'MNO5Q21',
    confianca_ocr: 0.95,
    marca_veiculo: 'Chevrolet',
    modelo_veiculo: 'Onix',
    ano_veiculo: '2022-2024',
    cor: 'Branco',
    dano_detectado: false,
    imagem_path: 'images/mno5q21.jpg',
    consulta_pier: [
      {
        resultado: 'achado',
        placa_consultada: 'MNO5Q21',
        timestamp_consulta: '2026-06-09T20:38:02Z',
      },
    ],
  },
  {
    id: 44,
    timestamp: '2026-06-09T19:59:00Z',
    placa_lida: 'STU8R64',
    confianca_ocr: 0.68,
    marca_veiculo: null,
    modelo_veiculo: null,
    ano_veiculo: null,
    cor: null,
    dano_detectado: null,
    imagem_path: 'images/stu8r64.jpg',
    consulta_pier: [
      {
        resultado: 'pendente',
        placa_consultada: 'STU8R64',
        timestamp_consulta: '2026-06-09T19:59:01Z',
      },
    ],
  },
]

export const mockChart: Record<'hoje' | 'semana', DeteccaoBucket[]> = {
  hoje: [
    { label: '08:00', value: 7 },
    { label: '10:00', value: 13 },
    { label: '12:00', value: 5 },
    { label: '14:00', value: 24 },
    { label: '16:00', value: 18 },
    { label: '18:00', value: 38 },
  ],
  semana: [
    { label: 'Seg', value: 42 },
    { label: 'Ter', value: 31 },
    { label: 'Qua', value: 55 },
    { label: 'Qui', value: 28 },
    { label: 'Sex', value: 63 },
    { label: 'Sáb', value: 19 },
    { label: 'Dom', value: 12 },
  ],
}
