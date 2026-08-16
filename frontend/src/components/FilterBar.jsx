import { inputClass } from './FormField';

export default function FilterBar({ fields, values, onChange, onSubmit }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-ink-100 bg-surface p-4"
    >
      {fields.map((f) => (
        <div key={f.key} className="min-w-[160px] flex-1">
          <label className="mb-1 block text-xs font-medium text-ink-600">{f.label}</label>
          {f.type === 'select' ? (
            <select
              className={inputClass}
              value={values[f.key] || ''}
              onChange={(e) => onChange(f.key, e.target.value)}
            >
              <option value="">All</option>
              {f.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              className={inputClass}
              value={values[f.key] || ''}
              onChange={(e) => onChange(f.key, e.target.value)}
              placeholder={f.placeholder}
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="rounded-md bg-ink-950 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Apply filters
      </button>
    </form>
  );
}
