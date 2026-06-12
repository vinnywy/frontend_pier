import { CheckCircle2, Trash2 } from 'lucide-react'
import type { AcaoAlerta, Alerta } from '../../lib/api/types'
import { formatDate, formatTime } from '../../lib/format'
import { cn } from '../../lib/cn'
import { Card } from '../ui/Card'
import { VehicleImage } from '../historico/VehicleImage'

interface AlertCardProps {
  alerta: Alerta
  submitting?: boolean
  onResolve: (id: number, acao: AcaoAlerta) => void
}

/**
 * Review card for the "tinder" flow: detection vs. Pier response side by side.
 * The operator confirms (sinistro real) or discards (falso positivo).
 */
export function AlertCard({ alerta, submitting, onResolve }: AlertCardProps) {
  const { deteccao, resposta_raw, placa_consultada } = alerta.consulta_pier
  const veiculo = resposta_raw.vehicle
  const confianca = Math.round(deteccao.confianca_ocr * 100)

  return (
    <Card className="flex flex-col gap-6 p-4 lg:flex-row lg:items-stretch">
      <VehicleImage
        path={deteccao.imagem_path}
        alt={`Veículo de placa ${deteccao.placa_lida}`}
        className="h-48 w-full lg:h-auto lg:min-h-[200px] lg:w-72"
      />

      <div className="grid flex-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
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

        <div className="flex flex-row items-center justify-between gap-4 lg:flex-col lg:items-end lg:justify-between">
          <div className="text-left lg:text-right">
            <p className="text-lg font-semibold text-emerald-500">
              {confianca}% de Confiança
            </p>
            <p className="text-base font-semibold text-text-muted">
              {formatDate(deteccao.timestamp)}
            </p>
            <p className="text-base font-semibold text-text-muted">
              {formatTime(deteccao.timestamp)} h
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ActionButton
              label="Confirmar sinistro"
              disabled={submitting}
              onClick={() => onResolve(alerta.id, 'confirmado')}
              className="text-emerald-500 hover:bg-emerald-500/10"
            >
              <CheckCircle2 className="h-9 w-9" strokeWidth={2} />
            </ActionButton>
            <ActionButton
              label="Descartar alerta"
              disabled={submitting}
              onClick={() => onResolve(alerta.id, 'descartado')}
              className="text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="h-8 w-8" strokeWidth={2} />
            </ActionButton>
          </div>
        </div>
      </div>
    </Card>
  )
}

function AttributeColumn({
  title,
  rows,
}: {
  title: string
  rows: ReadonlyArray<readonly [string, string]>
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-lg font-semibold text-amber-500">{title}</h3>
      <dl className="flex flex-col gap-1 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="flex gap-1">
            <dt className="shrink-0 font-medium text-primary">{label}:</dt>
            <dd className="truncate text-text-muted">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function ActionButton({
  children,
  label,
  disabled,
  onClick,
  className,
}: {
  children: React.ReactNode
  label: string
  disabled?: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center rounded-full p-1.5 transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary',
        'disabled:cursor-not-allowed disabled:opacity-40',
        className,
      )}
    >
      {children}
    </button>
  )
}
