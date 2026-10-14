// Rozteč políc — čistý výpočet (bez Reactu, DOM, localStorage). Všetko v mm.
// Rovnomerné rozmiestnenie políc v korpuse: dno, strop aj police majú hrúbku t.
//   vnútorná = vonkajšia − 2t
//   svetlý priestor = (vnútorná − n·t) / (n + 1)
//   spodná hrana i-tej police = i·medzera + (i−1)·t   (od vnútorného dna)

export type HeightMode = 'outer' | 'inner';
export type ShelvesError = 'height' | 'thickness' | 'count' | 'inner' | 'noFit';

export interface ShelvesInput { height: number; mode: HeightMode; thickness: number; count: number }
export interface Shelf { index: number; bottom: number; top: number; axis: number }
export interface ShelvesResult {
  ok: boolean; error: ShelvesError | null;
  outer: number; inner: number; thickness: number; count: number;
  gap: number; pitch: number; shelves: Shelf[];
}

export const MAX_SHELVES = 50;

export function calcShelves({ height, mode, thickness, count }: ShelvesInput): ShelvesResult {
  const t = Number(thickness), h = Number(height), n = Number(count);
  const base: ShelvesResult = { ok: false, error: null, outer: NaN, inner: NaN, thickness: t, count: n, gap: NaN, pitch: NaN, shelves: [] };

  if (!Number.isFinite(h) || h <= 0) return { ...base, error: 'height' };
  if (!Number.isFinite(t) || t <= 0) return { ...base, error: 'thickness' };
  if (!Number.isInteger(n) || n < 0 || n > MAX_SHELVES) return { ...base, error: 'count' };

  const outer = mode === 'inner' ? h + 2 * t : h;
  const inner = mode === 'inner' ? h : h - 2 * t;
  const res = { ...base, outer, inner };
  if (inner <= 0) return { ...res, error: 'inner' };

  const gap = (inner - n * t) / (n + 1);
  if (!(gap > 0)) return { ...res, gap, error: 'noFit' };

  const shelves: Shelf[] = [];
  for (let i = 1; i <= n; i++) {
    const bottom = i * gap + (i - 1) * t;
    shelves.push({ index: i, bottom, top: bottom + t, axis: bottom + t / 2 });
  }
  return { ...res, ok: true, gap, pitch: gap + t, shelves };
}

export const ERROR_TEXT: Record<ShelvesError, string> = {
  height: 'Zadaj výšku korpusu (väčšiu ako 0).',
  thickness: 'Zadaj hrúbku materiálu (väčšiu ako 0).',
  count: `Počet políc musí byť celé číslo 0 až ${MAX_SHELVES}.`,
  inner: 'Vnútorná výška vychádza 0 alebo menej. Skontroluj výšku a hrúbku.',
  noFit: 'Police sa nezmestia — svetlý priestor vychádza 0 alebo menej. Zníž počet políc alebo hrúbku.',
};
