export default function Card({ title, subtitle, children, action }) {
  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6">
      {(title || action) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {title && <h3 className="font-display text-lg font-semibold">{title}</h3>}
            {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </div>
  )
}
