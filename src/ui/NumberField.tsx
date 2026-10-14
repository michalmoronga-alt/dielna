import { useId } from 'react';

export function NumberField({ label, value, onChange, unit = 'mm', bad, className = '', inputMode = 'decimal', enterKeyHint = 'next', id }: {
  label: string; value: string; onChange: (v: string) => void; unit?: string; bad?: boolean; className?: string;
  inputMode?: 'decimal' | 'numeric'; enterKeyHint?: 'next' | 'done'; id?: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  return (
    <label className={`field${bad ? ' bad' : ''} ${className}`} htmlFor={fid}>
      <span className="field-l">{label}</span>
      <input id={fid} type="text" inputMode={inputMode} enterKeyHint={enterKeyHint} autoComplete="off" spellCheck={false}
        value={value} onChange={e => onChange(e.target.value)} onFocus={e => { const el = e.currentTarget; setTimeout(() => el.select(), 0); }} />
      {unit ? <span className="field-u">{unit}</span> : null}
    </label>
  );
}

export function Stepper({ label, value, onChange, min = 0, max = 50, bad, id }: {
  label: string; value: string; onChange: (v: string) => void; min?: number; max?: number; bad?: boolean; id?: string;
}) {
  const auto = useId();
  const fid = id ?? auto;
  const cur = parseInt(value, 10);
  const set = (v: number) => onChange(String(Math.max(min, Math.min(max, v))));
  return (
    <div className={`stepper${bad ? ' bad' : ''}`}>
      <button type="button" aria-label={`Menej — ${label}`} onClick={() => set((Number.isFinite(cur) ? cur : min) - 1)}>−</button>
      <label className="stepper-mid" htmlFor={fid}>
        <span className="field-l">{label}</span>
        <input id={fid} type="text" inputMode="numeric" enterKeyHint="done" autoComplete="off" value={value}
          onChange={e => onChange(e.target.value)} onFocus={e => { const el = e.currentTarget; setTimeout(() => el.select(), 0); }} />
      </label>
      <button type="button" aria-label={`Viac — ${label}`} onClick={() => set((Number.isFinite(cur) ? cur : min) + 1)}>+</button>
    </div>
  );
}
