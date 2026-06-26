/**
 * Estações — lista os gateways que falam com o backend. Cada card leva aos
 * drones daquele gateway. (Substitui a antiga página Monitor.)
 */
import { useEffect, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { EstacaoCard } from '../components/estacoes/EstacaoCard'
import { getEstacoes } from '../lib/api/estacoes'
import type { Estacao } from '../lib/api/estacoes'

export default function Estacoes() {
  const [estacoes, setEstacoes] = useState<Estacao[] | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    getEstacoes(ctrl.signal)
      .then(setEstacoes)
      .catch(() => setEstacoes([]))
    return () => ctrl.abort()
  }, [])

  return (
    <>
      <PageHeader title="Estações" />

      <section className="grid gap-6 md:grid-cols-2">
        {estacoes === null ? (
          Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="h-32 animate-pulse"><span /></Card>
          ))
        ) : estacoes.length === 0 ? (
          <Card className="p-12 text-center text-text-muted">
            Nenhuma estação conectada no momento.
          </Card>
        ) : (
          estacoes.map((e) => <EstacaoCard key={e.gateway_id} estacao={e} />)
        )}
      </section>
    </>
  )
}