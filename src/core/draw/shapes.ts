// Nákres ako zoznam jednoduchých tvarov. Ten istý zoznam sa vykreslí do SVG (obrazovka)
// aj priamo do PDF (vektorovo, jsPDF). Súradnice sú v jednotkách nákresu (y rastie nadol).

/** Farby sú sémantické — obrazovka ich mapuje na CSS premenné témy, PDF na tlačové farby. */
export type Ink =
  | 'ink' | 'faint' | 'line' | 'gap' | 'gapFill' | 'acc' | 'accSoft' | 'accInk'
  | 'wood' | 'woodLine' | 'paper' | 'danger' | 'dangerSoft';

export type Shape =
  | { k: 'rect'; x: number; y: number; w: number; h: number; fill?: Ink; stroke?: Ink; sw?: number; dash?: number[]; r?: number }
  | { k: 'line'; x1: number; y1: number; x2: number; y2: number; stroke: Ink; sw?: number; dash?: number[] }
  | { k: 'circle'; cx: number; cy: number; r: number; fill: Ink }
  | {
      k: 'text'; x: number; y: number; text: string; size: number; fill: Ink;
      anchor?: 'start' | 'middle' | 'end'; bold?: boolean; /** -90 = zvislý text zdola nahor */ rotate?: -90;
    };

export interface Drawing { width: number; height: number; shapes: Shape[]; label: string }

/** Šikmá značka konca kóty (architektonická). */
export const tick = (x: number, y: number, stroke: Ink, size = 4.5): Shape =>
  ({ k: 'line', x1: x - size, y1: y + size, x2: x + size, y2: y - size, stroke, sw: 1.5 });

/** CSS premenné pre SVG na obrazovke (téma). */
export const SCREEN_INK: Record<Ink, string> = {
  ink: 'var(--text)', faint: 'var(--muted)', line: 'var(--line2)', gap: 'var(--warn)', gapFill: 'var(--gap-fill)',
  acc: 'var(--acc)', accSoft: 'var(--acc-soft)', accInk: 'var(--acc-ink)', wood: 'var(--wood)', woodLine: 'var(--wood-line)',
  paper: 'var(--paper)', danger: 'var(--danger)', dangerSoft: 'var(--danger-soft)',
};

/** Tlačové farby pre PDF (vždy svetlé pozadie, bez ohľadu na tému). */
export const PRINT_INK: Record<Ink, string> = {
  ink: '#1b1b1f', faint: '#6b6b76', line: '#c9ccd2', gap: '#c2410c', gapFill: '#fff4ec',
  acc: '#0d9488', accSoft: '#e3f4f1', accInk: '#0b5f58', wood: '#efe8dc', woodLine: '#8a7f6e',
  paper: '#ffffff', danger: '#d24b4b', dangerSoft: '#fdeeee',
};
