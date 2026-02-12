export default function Button({ variant = "primary", children, className = "", ...props }) {
  const styles =
    variant === "secondary"
      ? "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800/80 dark:text-slate-100 dark:hover:bg-slate-800"
      : "bg-sky-600 text-white hover:bg-sky-700 dark:bg-neon/20 dark:text-neon dark:hover:bg-neon/30"
  return (
    <button
      {...props}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${styles} ${className}`.trim()}
    >
      {children}
    </button>
  )
}
