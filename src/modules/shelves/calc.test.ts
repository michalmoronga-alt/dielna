import { describe, expect, it } from 'vitest';
import { calcShelves } from './calc';
import { formatMm } from '../../core/format';

describe('calcShelves', () => {
  it('720 vonkajšia / 18 / 2', () => {
    const r = calcShelves({ height: 720, mode: 'outer', thickness: 18, count: 2 });
    expect(r.ok).toBe(true);
    expect(r.inner).toBeCloseTo(684); expect(r.gap).toBeCloseTo(216); expect(r.pitch).toBeCloseTo(234);
    expect(r.shelves[0].bottom).toBeCloseTo(216); expect(r.shelves[1].bottom).toBeCloseTo(450);
    expect(r.shelves[1].top).toBeCloseTo(468); expect(r.shelves[0].axis).toBeCloseTo(225);
  });
  it('684 vnútorná / 18 / 2 dá to isté', () => {
    const r = calcShelves({ height: 684, mode: 'inner', thickness: 18, count: 2 });
    expect(r.outer).toBeCloseTo(720); expect(r.gap).toBeCloseTo(216);
  });
  it('850 / 16 / 5 (Michalov prípad z mobilu)', () => {
    const r = calcShelves({ height: 850, mode: 'outer', thickness: 16, count: 5 });
    expect(r.ok).toBe(true);
    expect(r.inner).toBeCloseTo(818); expect(r.gap).toBeCloseTo(123); expect(r.pitch).toBeCloseTo(139);
    expect(r.shelves.map(s => s.bottom)).toEqual([123, 262, 401, 540, 679]);
  });
  it('2000 / 18 / 5 — zaokrúhlenie iba pri zobrazení', () => {
    const r = calcShelves({ height: 2000, mode: 'outer', thickness: 18, count: 5 });
    expect(r.gap).toBeCloseTo(1874 / 6);
    expect(formatMm(r.gap, 0.5, true)).toBe('312,5');
    expect(formatMm(r.gap, 0.1, true)).toBe('312,3');
    expect(r.shelves[4].top + r.gap).toBeCloseTo(r.inner);
  });
  it('0 políc = jeden priestor', () => {
    const r = calcShelves({ height: 720, mode: 'outer', thickness: 18, count: 0 });
    expect(r.ok).toBe(true); expect(r.gap).toBeCloseTo(684); expect(r.shelves).toHaveLength(0);
  });
  it('chyby', () => {
    expect(calcShelves({ height: 300, mode: 'outer', thickness: 18, count: 15 }).error).toBe('noFit');
    expect(calcShelves({ height: 30, mode: 'outer', thickness: 18, count: 0 }).error).toBe('inner');
    expect(calcShelves({ height: NaN, mode: 'outer', thickness: 18, count: 2 }).error).toBe('height');
    expect(calcShelves({ height: 720, mode: 'outer', thickness: 0, count: 2 }).error).toBe('thickness');
    expect(calcShelves({ height: 720, mode: 'outer', thickness: 18, count: 1.5 }).error).toBe('count');
    expect(calcShelves({ height: 720, mode: 'outer', thickness: 18, count: 51 }).error).toBe('count');
  });
});
