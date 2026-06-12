import type { DeteccaoHistorico } from '../../lib/api/types'
import { VehicleImage } from './VehicleImage'

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm">
      <span className="font-semibold text-primary">{label}:</span>{' '}
      <span className="text-text-muted">{value}</span>
    </p>
  )
}

/** Expanded row body: snapshot + VLM-derived vehicle attributes. */
export function VehicleDetails({ det }: { det: DeteccaoHistorico }) {
  return (
    <div className="flex flex-wrap items-center gap-6 bg-surface px-6 pb-6 pt-1">
      <VehicleImage path={det.imagem_path} alt={`Veículo de placa ${det.placa_lida}`} />
      <div className="grid gap-2">
        <Field label="Marca do Veículo" value={det.marca_veiculo ?? 'Não identificada'} />
        <Field label="Modelo do Veículo" value={det.modelo_veiculo ?? 'Não identificado'} />
        <Field label="Ano do Veículo" value={det.ano_veiculo ?? 'Não identificado'} />
        <Field label="Cor do Veículo" value={det.cor ?? 'Não identificada'} />
        {det.dano_detectado != null && (
          <Field
            label="Dano Detectado"
            value={det.dano_detectado ? 'Sim' : 'Não'}
          />
        )}
      </div>
    </div>
  )
}
