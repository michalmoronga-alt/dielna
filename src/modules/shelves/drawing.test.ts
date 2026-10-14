import { describe, expect, it } from 'vitest';
import { calcShelves } from './calc';
import { buildSection } from './drawing';

const texts = (d: ReturnType<typeof buildSection>) => d.shapes.flatMap(s => (s.k === 'text' ? [s.text] : []));

describe('nákres', () => {
  it('850/16/5: výšky políc vľavo, medzery vpravo, kóty výšky', () => {
    const R = calcShelves({ height: 850, mode: 'outer', thickness: 16, count: 5 });
    const d = buildSection(R, { step: 0.5, ref: 'inner', width: 368, height: 700 });
    const t = texts(d);
    for (const v of ['123', '262', '401', '540', '679', '818', 'P1', 'P5', '850 vonk.', '818 vnút.']) expect(t).toContain(v);
    expect(t.filter(x => x === '123,0')).toHaveLength(6);
    expect(d.shapes.every(s => Object.values(s).every(v => typeof v !== 'number' || Number.isFinite(v)))).toBe(true);
  });
  it('výšky od spodnej hrany sú posunuté o hrúbku', () => {
    const R = calcShelves({ height: 850, mode: 'outer', thickness: 16, count: 5 });
    const t = texts(buildSection(R, { step: 0.5, ref: 'outer', width: 368, height: 520 }));
    expect(t).toContain('139'); expect(t).toContain('od spodnej hrany');
  });
  it('chyba / prázdne zadanie nezhodí nákres', () => {
    expect(texts(buildSection(calcShelves({ height: NaN, mode: 'outer', thickness: 18, count: 2 }), { step: 0.5, ref: 'inner', width: 300, height: 400 }))).toContain('Zadaj rozmery');
    expect(texts(buildSection(calcShelves({ height: 300, mode: 'outer', thickness: 18, count: 15 }), { step: 0.5, ref: 'inner', width: 300, height: 400 }))).toContain('Police sa nezmestia');
  });
});
