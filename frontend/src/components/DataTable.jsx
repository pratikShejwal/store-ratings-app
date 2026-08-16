// columns: [{ key, label, sortable, render }]
export default function DataTable({ columns, rows, sortBy, sortOrder, onSort, emptyLabel = 'No records found' }) {
  function handleHeaderClick(col) {
    if (!col.sortable) return;
    if (sortBy === col.key) {
      onSort(col.key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(col.key, 'asc');
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100 bg-surface">
      <table className="w-full min-w-max text-left text-sm">
        <thead>
          <tr className="border-b border-ink-100 bg-ink-50">
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => handleHeaderClick(col)}
                className={`px-4 py-3 font-medium text-ink-600 ${
                  col.sortable ? 'cursor-pointer select-none hover:text-ink-900' : ''
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && sortBy === col.key && (
                    <span className="text-amber-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-ink-500">
                {emptyLabel}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={row.id ?? idx} className="border-b border-ink-100 last:border-0 hover:bg-ink-50/50">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-ink-800">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
