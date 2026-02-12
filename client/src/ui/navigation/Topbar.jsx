import { Menu, Moon, Sun, UserCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useTheme } from "../../context/ThemeContext.jsx"
import { useAuth } from "../../context/AuthContext.jsx"

export default function Topbar({ onMenuToggle }) {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleRoleChange = (event) => {
    const nextRole = event.target.value
    // If role is unchanged, do nothing
    if (nextRole === user?.role) return
    // Require fresh login for switching between admin / trainer / member
    logout()
    navigate("/login")
  }

  return (
    <div className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-slate-800/70 dark:bg-carbon/80 sm:px-6 lg:px-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-100 p-2 text-slate-800 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              Atlas OS
            </p>
            <h2 className="font-display text-xl font-semibold sm:text-2xl">Welcome back, {user?.name}</h2>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:gap-3">
          <select
            value={user?.role || "admin"}
            onChange={handleRoleChange}
            className="min-w-[10rem] flex-1 rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/60 sm:flex-none"
          >
            <option value="admin">Admin view</option>
            <option value="trainer">Trainer view</option>
            <option value="member">Member view</option>
          </select>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/60"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-300 bg-slate-100 px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/60 md:flex">
            <UserCircle size={18} />
            <span className="max-w-[16rem] truncate">{user?.email}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
