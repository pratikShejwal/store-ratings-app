import { useState } from 'react';

// Read-only star display, supports fractional (rounds to nearest half visually via title)
export function StarDisplay({ value, size = 'text-base' }) {
  const rounded = Math.round(value || 0);
  return (
    <span className={`inline-flex items-center gap-0.5 ${size}`} title={`${(value || 0).toFixed(1)} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= rounded ? 'text-amber-500' : 'text-ink-100'}>
          ★
        </span>
      ))}
      <span className="ml-1 font-mono text-xs text-ink-500">{(value || 0).toFixed(1)}</span>
    </span>
  );
}

// Interactive 1-5 star picker
export function StarInput({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);
  const display = hover || value || 0;

  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={disabled}
          onClick={() => onChange(i)}
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover(0)}
          className={`text-2xl leading-none transition-colors disabled:cursor-not-allowed ${
            i <= display ? 'text-amber-500' : 'text-ink-100 hover:text-amber-400'
          }`}
          aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
