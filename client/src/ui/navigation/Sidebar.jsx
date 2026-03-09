import { NavLink } from "react-router-dom"
import { Dumbbell, Users, UserCog, CalendarCheck, CreditCard, ChartBar, NotebookText, HeartPulse, Salad, ClipboardList } from "lucide-react"
import { useAuth } from "../../context/AuthContext.jsx"

const superAdminLinks = [{ to: "/app/super-admin", label: "Gyms", icon: ChartBar }]

const adminLinks = [
  { to: "/app/dashboard", label: "Dashboard", icon: ChartBar },
  { to: "/app/members", label: "Members", icon: Users },
  { to: "/app/trainers", label: "Trainers", icon: UserCog },
  { to: "/app/plans", label: "Plans", icon: NotebookText },
  { to: "/app/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/app/payments", label: "Payments", icon: CreditCard },
  { to: "/app/reports", label: "Reports", icon: ChartBar }
]

const memberLinks = [
  { to: "/app/member-home", label: "Overview", icon: Dumbbell },
  { to: "/app/member-workouts", label: "Workouts", icon: HeartPulse },
  { to: "/app/member-diet", label: "Diet Plans", icon: Salad },
  { to: "/app/member-attendance", label: "Attendance", icon: CalendarCheck }
]

const trainerLinks = [
  { to: "/app/trainer-home", label: "Overview", icon: Dumbbell },
  { to: "/app/trainer-members", label: "Members", icon: Users },
  { to: "/app/trainer-plans", label: "Plans", icon: ClipboardList }
]

const linkStyles = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-slate-900 text-white dark:bg-slate-800"
      : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/70"
  }`

export default function Sidebar({ mobileOpen = false, onClose = () => {} }) {
  const { role, user } = useAuth()
  const gymLabel =
    role === "super_admin" ? "Platform Admin" : user?.gymName || "Your Gym"
  const links =
    role === "super_admin"
      ? superAdminLinks
      : role === "trainer"
        ? trainerLinks
        : role === "member"
          ? memberLinks
          : adminLinks

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/50 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white/95 px-6 py-8 backdrop-blur transition-transform duration-200 dark:border-slate-800/70 dark:bg-carbon/95 lg:static lg:z-auto lg:translate-x-0 lg:bg-white/80 lg:dark:bg-carbon/80 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neon/10 text-neon">
            <Dumbbell size={20} />
          </div>
          <div>
            <p className="font-display text-lg font-semibold">{gymLabel}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Management OS</p>
          </div>
        </div>

        <nav className="mt-10 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkStyles} onClick={onClose}>
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
          Tip: Use the top bar to switch roles and preview role-based views.
        </div>
      </aside>
    </>
  )
}
