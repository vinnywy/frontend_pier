import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAlertasPendentes } from '../../hooks/useAlertas'
import type { Alerta } from '../../lib/api/types'
import { formatDate, formatTime } from '../../lib/format'
import { Modal } from '../ui/Modal'
import { VehicleImage } from '../historico/VehicleImage'
import { AttributeColumn } from './AttributeColumn'

/**
 * Global watcher: while alerts poll (5s), the first alert that appears *after*
 * the initial load pops up as "Novo Sinistro Detectado". Mounted once in the
 * app shell. Integration is automatic — it consumes the same `/alertas/pendentes`.
 */
export function NewAlertPopup() {
  const { data } = useAlertasPendentes()
  const navigate = useNavigate()
  const seen = useRef<Set<number> | null>(null)
  const [active, setActive] = useState<Alerta | null>(null)

  useEffect(() => {
    if (!data) return
    // First successful load: remember existing alerts without popping up.
    if (seen.current === null) {
      seen.current = new Set(data.map((a) => a.id))
      return
    }
    const fresh = data.find((a) => !seen.current!.has(a.id))
    if (fresh) {
      data.forEach((a) => seen.current!.add(a.id))
      setActive((curr) => curr ?? fresh)
    }
  }, [data])

  if (!active) return null

  const { deteccao, resposta_raw, placa_consultada } = active.consulta_pier
  const veiculo = resposta_raw.vehicle
  const confianca = Math.round(deteccao.confianca_ocr * 100)
  const close = () => setActive(null)

  return (
    <Modal
      open
      title="Novo Sinistro Detectado"
      onClose={close}
      footer={
        <>
          <button
            type="button"
            onClick={close}
            className="rounded-lg bg-surface px-4 py-2 text-xs font-medium text-text-muted shadow-sm transition-colors hover:bg-surface-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              close()
              navigate('/alertas')
            }}
            className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-white shadow-sm transition-colors hover:bg-accent/90"
          >
            Visualizar
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <VehicleImage
          path={deteccao.imagem_path}
          alt={`Veículo de placa ${deteccao.placa_lida}`}
          className="h-56 w-full"
        />

        <div className="grid grid-cols-2 gap-6">
          <AttributeColumn
            title="Detecção"
            rows={[
              ['Placa Lida', deteccao.placa_lida],
              ['Marca', deteccao.marca_veiculo ?? '—'],
              ['Modelo', deteccao.modelo_veiculo ?? '—'],
              ['Ano', deteccao.ano_veiculo ?? '—'],
              ['Cor', deteccao.cor ?? '—'],
            ]}
          />
          <AttributeColumn
            title="Resposta Pier"
            rows={[
              ['Placa Consultada', placa_consultada],
              ['Marca', veiculo.make],
              ['Modelo', veiculo.model],
              ['Ano', String(veiculo.fabrication_year)],
              ['Cor', veiculo.color],
            ]}
          />
        </div>

        <div>
          <p className="text-lg font-semibold text-emerald-500">
            {confianca}% de Confiança
          </p>
          <p className="text-base font-semibold text-text-muted">
            {formatDate(deteccao.timestamp)}
          </p>
          <p className="text-base font-semibold text-text-muted">
            {formatTime(deteccao.timestamp)} H
          </p>
        </div>
      </div>
    </Modal>
  )
}
