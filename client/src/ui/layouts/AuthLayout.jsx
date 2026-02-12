import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10">
          <h1 className="font-display text-3xl font-semibold sm:text-4xl">
            Atlas Gym OS
          </h1>
          <p className="mt-3 text-base text-slate-300 sm:mt-4 sm:text-lg">
            A clean, modern gym management system for owners, trainers, and members.
          </p>
          <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-4">
            {[
              "Role-aware dashboards and permissions",
              "Unified plans, payments, attendance",
              "Workout, diet, and progress tracking"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-neon" />
                <span className="text-sm text-slate-300 sm:text-base">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
