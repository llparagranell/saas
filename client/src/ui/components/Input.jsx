export default function Input({ label, className = "", inputClassName = "", ...props }) {
  return (
    <label className={`grid gap-2 text-sm ${className}`.trim()}>
      <span className="text-slate-300">{label}</span>
      <input
        {...props}
        className={`rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 outline-none focus:border-neon/60 ${inputClassName}`.trim()}
      />
    </label>
  )
}
