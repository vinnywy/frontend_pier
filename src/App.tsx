import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import Home from './pages/Home'
import Monitor from './pages/Monitor'
import Alertas from './pages/Alertas'
import Historico from './pages/Historico'

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="monitor" element={<Monitor />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="historico" element={<Historico />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
