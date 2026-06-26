/**
 * RouteMap — mapa animado do percurso do drone.
 * Desenha a rota (square ou road) e uma seta que a percorre, sincronizada com
 * o tempo total do voo (total_duration_s do backend). Sem dependências externas.
 *
 * - square: quadrado fechado.
 * - road: formato de L.
 * O traçado é puramente ilustrativo do percurso; a velocidade da seta espelha
 * a duração real reportada pelo backend.
 */
import { useEffect, useRef, useState } from 'react'
import type { RouteId } from '../../lib/api/rotas'

interface RouteMapProps {
  routeId: RouteId
  /** Liga a animação. Quando false, mostra o traçado parado. */
  running: boolean
  /** Duração total do percurso em segundos (vinda do backend). */
  durationS?: number
}

/** Pontos do caminho em coordenadas do viewBox (0..100). Fechado para square. */
const PATHS: Record<RouteId, [number, number][]> = {
  // quadrado
  square: [
    [30, 75],
    [30, 25],
    [75, 25],
    [75, 75],
    [30, 75],
  ],
  // L: sobe, vira à direita, desce um degrau
  road: [
    [32, 78],
    [32, 30],
    [60, 30],
    [60, 55],
    [82, 55],
  ],
}

function pointsToPath(points: [number, number][]): string {
  return points
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`)
    .join(' ')
}

/** Interpola a posição e o ângulo da seta ao longo do polyline em t∈[0,1]. */
function posAt(points: [number, number][], t: number) {
  const segs = points.length - 1
  const total = segs
  const scaled = Math.min(Math.max(t, 0), 1) * total
  const i = Math.min(Math.floor(scaled), segs - 1)
  const localT = scaled - i
  const [x1, y1] = points[i]
  const [x2, y2] = points[i + 1]
  const x = x1 + (x2 - x1) * localT
  const y = y1 + (y2 - y1) * localT
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  return { x, y, angle }
}

export function RouteMap({ routeId, running, durationS }: RouteMapProps) {
  const points = PATHS[routeId]
  const [t, setT] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)
  const duration = (durationS && durationS > 0 ? durationS : 6) * 1000

  useEffect(() => {
    if (!running) {
      setT(0)
      return
    }
    startRef.current = performance.now()
    const tick = (now: number) => {
      const elapsed = now - startRef.current
      const next = (elapsed % duration) / duration
      setT(next)
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [running, duration])

  const { x, y, angle } = posAt(points, running ? t : 0)
  const d = pointsToPath(points)
  const idle = !running

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      role="img"
      aria-label={`Mapa do percurso ${routeId}`}
    >
      {/* traçado base (apagado quando idle) */}
      <path
        d={d}
        fill="none"
        stroke={idle ? 'var(--map-idle, #3f5a4a)' : 'var(--map-route, #f472a0)'}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={idle ? 0.5 : 1}
      />
      {/* rastro percorrido */}
      {running && (
        <path
          d={d}
          fill="none"
          stroke="#16a34a"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - t}
        />
      )}
      {/* seta */}
      {running && (
        <g transform={`translate(${x} ${y}) rotate(${angle + 90})`}>
          <path
            d="M 0 -5 L 4 5 L 0 2 L -4 5 Z"
            fill="#fbcfe2"
            stroke="#fff"
            strokeWidth={0.5}
          />
        </g>
      )}
    </svg>
  )
}