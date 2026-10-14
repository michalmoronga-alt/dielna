import { describe, expect, it } from 'vitest';
import { calcShelves } from './calc';
import { buildShelvesPdf, pdfFilename } from './pdf';

describe('PDF', () => {
  it('vytvorí jednostranové vektorové PDF s vloženým písmom', () => {
    const input = { height: 850, mode: 'outer' as const, thickness: 16, count: 5 };
    const doc = buildShelvesPdf({ input, R: calcShelves(input), step: 0.5, ref: 'inner', date: new Date(2026, 9, 14) });
    expect(doc.getNumberOfPages()).toBe(1);
    const raw = doc.output();
    expect(raw.startsWith('%PDF-')).toBe(true);
    expect(raw).toContain('/FontFile2');          // písmo je vložené (slovenská diakritika)
    expect(raw).not.toContain('/Subtype /Image'); // žiadna snímka obrazovky
    expect(pdfFilename(input)).toBe('roztec-polic-850-16-5.pdf');
    expect(pdfFilename({ ...input, thickness: 18.5 })).toBe('roztec-polic-850-18_5-5.pdf');
  });
});
