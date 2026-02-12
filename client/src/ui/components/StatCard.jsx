export default function StatCard({ label, value, trend }) {
  return (
    <div className="glass-panel rounded-2xl p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="font-display text-3xl font-semibold">{value}</p>
        {trend && <span className="text-xs text-neon">{trend}</span>}
      </div>
    </div>
  )
}
