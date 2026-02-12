import { useState } from "react"
import { Outlet } from "react-router-dom"
import Sidebar from "../navigation/Sidebar.jsx"
import Topbar from "../navigation/Topbar.jsx"

export default function DashboardLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="page-shell">
      <div className="flex min-h-screen">
        <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <main className="min-w-0 flex-1">
          <Topbar onMenuToggle={() => setMobileNavOpen((open) => !open)} />
          <div className="px-4 pb-10 pt-4 sm:px-6 md:pb-12 md:pt-6 lg:px-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
