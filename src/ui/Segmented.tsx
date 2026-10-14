export interface SegOption<T extends string | number> { value: T; label: string }

export function Segmented<T extends string | number>({ value, options, onChange, label }: {
  value: T; options: SegOption<T>[]; onChange: (v: T) => void; label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="seg">
      {options.map(o => (
        <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value}
          className={o.value === value ? 'on' : ''} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
