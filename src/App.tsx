import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import Home from './pages/Home'
import Estacoes from './pages/Estacoes'
import EstacaoDrones from './pages/EstacaoDrones'
import VooControle from './pages/VooControle'
import Alertas from './pages/Alertas'
import Historico from './pages/Historico'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="estacoes" element={<Estacoes />} />
        <Route path="estacoes/:gatewayId" element={<EstacaoDrones />} />
        <Route
          path="estacoes/:gatewayId/drone/:droneId/voo"
          element={<VooControle />}
        />
        <Route path="alertas" element={<Alertas />} />
        <Route path="historico" element={<Historico />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}