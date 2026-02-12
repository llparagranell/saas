export default function SectionHeader({ title, description, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h3 className="font-display text-xl font-semibold sm:text-2xl">{title}</h3>
        {description && <p className="mt-2 text-sm text-slate-400">{description}</p>}
      </div>
      {actions ? <div className="w-full sm:w-auto">{actions}</div> : null}
    </div>
  )
}
