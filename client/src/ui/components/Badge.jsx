export default function Badge({ tone = "default", children }) {
  const styles =
    tone === "success"
      ? "bg-emerald-500/15 text-emerald-300"
      : tone === "warning"
      ? "bg-amber-500/15 text-amber-300"
      : "bg-slate-700/50 text-slate-300"
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>{children}</span>
  )
}
