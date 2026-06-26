/**
 * VooControle — tela de voo de um drone. Reúne o stream ao vivo, o mapa animado
 * do percurso, a telemetria e os controles de voo. Os controles seguem o mesmo
 * fluxo validado da CLI: preparar → (aguarda pronta) → iniciar.
 *
 * Não há botão de abortar voo: o backend ainda não suporta essa ação.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import DroneStream from '../components/DroneStream'
import { RouteMap } from '../components/voo/Routemap'
import { TelemetriaCard } from '../components/voo/TelemetriaCard'
import { cn } from '../lib/cn'
import {
  prepararRota,
  iniciarRota,
  getEstadoRota,
} from '../lib/api/rotas'
import type { EstadoRota, RouteId } from '../lib/api/rotas'
import { getVooAtivo } from '../lib/api/dashboard'
import { apiGet } from '../lib/api/client'
import type { Telemetria } from '../lib/api/types'

const API = import.meta.env.VITE_API_BASE_URL as string

const ROTAS: { id: RouteId; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'road', label: 'Road' },
]

export default function VooControle() {
  const { gatewayId = '7', droneId = '7' } = useParams()
  const [rota, setRota] = useState<RouteId | null>(null)

  const [estado, setEstado] = useState<EstadoRota>('idle')
  const [duration, setDuration] = useState<number | undefined>()
  const [telemetria, setTelemetria] = useState<Telemetria | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const [conectado, setConectado] = useState(false)
  const pollRef = useRef<number | undefined>(undefined)

  const emExecucao = estado === 'iniciando' || estado === 'em_execucao'

  // Polling do estado da rota enquanto há uma operação em curso.
  const acompanhar = useCallback(() => {
    window.clearInterval(pollRef.current)
    pollRef.current = window.setInterval(async () => {
      if (!rota) return
      try {
        const r = await getEstadoRota(rota)
        setEstado(r.estado)
        if (r.total_duration_s) setDuration(r.total_duration_s)
        if (r.estado === 'concluida' || r.estado === 'erro') {
          window.clearInterval(pollRef.current)
        }
      } catch {
        /* mantém o último estado em caso de falha pontual */
      }
    }, 1500)
  }, [rota])

  useEffect(() => () => window.clearInterval(pollRef.current), [])

  // Aguarda o drone publicar o stream antes de liberar os controles.
  useEffect(() => {
    const ctrl = new AbortController()
    const tick = () =>
      apiGet<{ ativo: boolean }>(
        `/stream/gateway/${gatewayId}/status`,
        ctrl.signal,
      )
        .then((r) => setConectado(Boolean(r.ativo)))
        .catch(() => setConectado(false))
    tick()
    const id = window.setInterval(tick, 2000)
    return () => {
      ctrl.abort()
      window.clearInterval(id)
    }
  }, [gatewayId])

  // Telemetria ao lado do stream (polling leve).
  useEffect(() => {
    const ctrl = new AbortController()
    const tick = () =>
      getVooAtivo(Number(droneId), ctrl.signal)
        .then((v) => setTelemetria(v.telemetria))
        .catch(() => {})
    tick()
    const id = window.setInterval(tick, 3000)
    return () => {
      ctrl.abort()
      window.clearInterval(id)
    }
  }, [droneId])

  const handlePreparar = async () => {
    if (!rota) return
    setErro(null)
    try {
      const r = await prepararRota(rota)
      setEstado(r.estado)
      acompanhar()
    } catch {
      setErro('Não foi possível preparar a rota.')
    }
  }

  const handleIniciar = async () => {
    if (!rota) return
    setErro(null)
    try {
      const r = await iniciarRota(rota)
      setEstado(r.estado)
      acompanhar()
    } catch {
      setErro('Não foi possível iniciar o voo. A rota está pronta?')
    }
  }

  return (
    <>
      <PageHeader title="Estação Butantã" />

      {erro && (
        <div className="rounded-lg border-l-4 border-red-500 bg-surface p-4 text-sm text-red-500">
          {erro}
        </div>
      )}

      <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_320px]">
        {/* Stream */}
        <div className="flex flex-col gap-4">
          <DroneStream gatewayId={gatewayId} apiBaseUrl={API} />
        </div>

        {/* Telemetria + controles */}
        <div className="flex h-full min-h-0 flex-col gap-6">
          <TelemetriaCard telemetria={telemetria} />

          <div className="flex flex-1 min-h-0 flex-col items-center justify-center gap-4 overflow-hidden rounded-lg bg-surface p-6">
            {!conectado ? (
              <p className="text-center text-sm text-text-muted">
                Aguardando conexão do drone…
              </p>
            ) : !rota ? (
              <>
                <p className="text-center text-sm text-text-muted">
                  Drone conectado. Escolha a rota do voo.
                </p>
                <div className="flex gap-3">
                  {ROTAS.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setRota(id)}
                      className="rounded-lg bg-accent-soft px-6 py-3 font-semibold text-primary transition-colors hover:bg-accent hover:text-white"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Mapa do percurso */}
                <div className="h-28 w-28 shrink-0 rounded-full bg-[#1a1d22] p-3">
                  <RouteMap routeId={rota} running={emExecucao} durationS={duration} />
                </div>

                <div className="flex gap-3">
                  {estado === 'pronta' ? (
                    <button
                      type="button"
                      onClick={handleIniciar}
                      className="rounded-lg bg-emerald-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-emerald-600"
                    >
                      Iniciar Vôo
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePreparar}
                      disabled={estado === 'preparando' || emExecucao}
                      className={cn(
                        'rounded-lg px-6 py-3 font-semibold transition-colors',
                        estado === 'preparando' || emExecucao
                          ? 'cursor-not-allowed bg-surface-muted text-text-muted'
                          : 'bg-accent text-white hover:bg-primary',
                      )}
                    >
                      {estado === 'preparando' ? 'Preparando…' : 'Preparar Vôo'}
                    </button>
                  )}
                </div>

                <EstadoLinha estado={estado} rota={rota} />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function EstadoLinha({ estado, rota }: { estado: EstadoRota; rota: RouteId }) {
  const texto: Record<EstadoRota, string> = {
    idle: `Rota "${rota}" selecionada. Prepare o voo para começar.`,
    preparando: 'Preparando a rota no gateway…',
    pronta: 'Rota pronta. Confirme para iniciar o voo.',
    iniciando: 'Iniciando o voo…',
    em_execucao: 'Voo em execução.',
    concluida: 'Voo concluído.',
    erro: 'A execução do voo terminou com erro.',
  }
  return (
    <p className="text-center text-sm text-text-muted">{texto[estado]}</p>
  )
}