// Formátovanie mm po slovensky. Počíta sa presne, zaokrúhľuje sa iba pri zobrazení.
export type RoundingStep = 0.1 | 0.5 | 1;
export const ROUNDING_STEPS: RoundingStep[] = [0.1, 0.5, 1];

export function roundTo(value: number, step: number): number {
  if (!Number.isFinite(value)) return NaN;
  const r = Math.round(value / step) * step;
  return Math.round(r * 1000) / 1000; // odstráni 0.30000000000000004
}

/** Desatinné miesta pre daný krok (0,1 → 1; 0,5 → 1; 1 → 0). */
const decimalsFor = (step: number) => (step >= 1 ? 0 : 1);

/**
 * @param fixed true = vždy zobraz desatinné miesto (123,0); false = vynechaj ,0 (123)
 */
export function formatMm(value: number, step: number, fixed = false): string {
  if (!Number.isFinite(value)) return '—';
  const r = roundTo(value, step);
  const d = decimalsFor(step);
  return r.toLocaleString('sk-SK', {
    minimumFractionDigits: fixed ? d : 0,
    maximumFractionDigits: d,
    useGrouping: false,
  });
}

/** Prijme „18“, „18,5“, „18.5“, „ 18 “. Prázdne/nezmysel → NaN. */
export function parseNum(input: string | number): number {
  if (typeof input === 'number') return input;
  const s = input.trim().replace(/\s+/g, '').replace(',', '.');
  if (s === '' || !/^-?\d*\.?\d+$|^-?\d+\.$/.test(s)) return NaN;
  return Number(s);
}
