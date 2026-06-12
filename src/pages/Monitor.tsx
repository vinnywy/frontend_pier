import { Camera } from 'lucide-react'
import { PlaceholderPage } from '../components/layout/PlaceholderPage'

export default function Monitor() {
  return (
    <PlaceholderPage
      title="Live Monitor"
      icon={Camera}
      description="Acompanhamento do voo ativo em tempo real. Esta tela será integrada ao endpoint /dashboard/voo-ativo/{drone_id}."
    />
  )
}
