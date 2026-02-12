export default function DataTable({ columns, rows }) {
  const getCellValue = (col, row) => (col.render ? col.render(row) : row[col.key])

  return (
    <div>
      <div className="space-y-3 md:hidden">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-400">No records found.</p>
        ) : (
          rows.map((row, index) => (
            <div
              key={row.id || index}
              className="rounded-xl border border-slate-800/70 bg-slate-900/30 p-3"
            >
              <dl className="space-y-2 text-sm">
                {columns.map((col) => (
                  <div key={col.key} className="flex items-start justify-between gap-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      {col.label}
                    </dt>
                    <dd className="text-right text-slate-200">{getCellValue(col, row)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))
        )}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase text-slate-500">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="pb-3 pr-6">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-200">
            {rows.map((row, index) => (
              <tr key={row.id || index} className="border-t border-slate-800/70">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 pr-6">
                    {getCellValue(col, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
