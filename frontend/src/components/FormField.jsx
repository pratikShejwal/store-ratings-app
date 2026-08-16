export default function FormField({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-ink-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export const inputClass =
  'w-full rounded-md border border-ink-100 bg-surface px-3 py-2 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-500/60 focus:border-amber-500';
