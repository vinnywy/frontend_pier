import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { NewAlertPopup } from '../alertas/NewAlertPopup'

/** App shell: fixed sidebar + scrollable routed content. */
export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 p-8">
          <Outlet />
        </div>
      </main>
      <NewAlertPopup />
    </div>
  )
}
