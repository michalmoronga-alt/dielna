// PDF pre Rozteč políc — A4, vektorový nákres + tabuľka. Načítava sa lenivo.
import { createDoc, drawShapes, drawTable, FONT } from '../../core/pdf/pdf';
import { formatMm } from '../../core/format';
import type { ShelvesInput, ShelvesResult } from './calc';
import { buildSection, type HeightRef } from './drawing';

export interface ShelvesPdfInput { input: ShelvesInput; R: ShelvesResult; step: number; ref: HeightRef; date?: Date }

export function buildShelvesPdf({ input, R, step, ref, date = new Date() }: ShelvesPdfInput) {
  const doc = createDoc();
  const M = 14, PW = 210;
  const off = ref === 'outer' ? R.thickness : 0;
  const refTxt = ref === 'outer' ? 'od spodnej hrany korpusu' : 'od vnútorného dna';

  doc.setFont(FONT, 'bold'); doc.setFontSize(17); doc.setTextColor('#1b1b1f');
  doc.text('Rozteč políc', M, 20);
  doc.setFont(FONT, 'normal'); doc.setFontSize(9); doc.setTextColor('#6b6b76');
  doc.text(`Dielňa · ${date.toLocaleDateString('sk-SK')}`, PW - M, 20, { align: 'right' });

  // zadanie + výsledok
  doc.setDrawColor('#e5e7eb'); doc.setLineWidth(0.3); doc.roundedRect(M, 25, PW - 2 * M, 21, 2, 2, 'S');
  doc.setFontSize(9.5); doc.setTextColor('#1b1b1f');
  const n = R.count, word = n === 1 ? 'polica' : n >= 2 && n <= 4 ? 'police' : 'políc';
  doc.text(`Zadanie: ${input.mode === 'outer' ? 'vonkajšia' : 'vnútorná'} výška ${formatMm(input.height, 0.1)} mm · hrúbka ${formatMm(input.thickness, 0.1)} mm · ${n} ${word}`, M + 4, 31.5);
  doc.setTextColor('#6b6b76');
  doc.text(`Vnútorná výška ${formatMm(R.inner, step)} mm · rozteč osí ${n ? formatMm(R.pitch, step) + ' mm' : '—'} · výšky ${refTxt} · zaokrúhlenie ${formatMm(step, 0.1)} mm`, M + 4, 37);
  doc.setFont(FONT, 'bold'); doc.setFontSize(11); doc.setTextColor('#0b5f58');
  doc.text(`Svetlý priestor: ${formatMm(R.gap, step, true)} mm${n + 1 > 1 ? ` (${n + 1}×)` : ''}`, M + 4, 43);

  // nákres vľavo
  const d = buildSection(R, { step, ref, width: 380, height: 640 });
  drawShapes(doc, d, { x: M, y: 52, w: 92, h: 155 });

  // tabuľka vpravo (zhora nadol ako v skrinke)
  const rows: { cells: string[]; muted?: boolean; bold?: boolean }[] = [];
  rows.push({ cells: ['Strop (spodná plocha)', '', '', formatMm(R.inner + off, step)], muted: true });
  const gapRow = { cells: ['↕ svetlý priestor', '', '', formatMm(R.gap, step, true)], muted: true };
  rows.push(gapRow);
  for (const s of [...R.shelves].reverse()) {
    rows.push({ cells: [`Polica ${s.index}`, formatMm(s.bottom + off, step), formatMm(s.top + off, step), formatMm(s.axis + off, step)] });
    rows.push(gapRow);
  }
  rows.push({ cells: ['Dno (horná plocha)', '', '', formatMm(off, step)], muted: true });
  doc.setFont(FONT, 'normal'); doc.setFontSize(8); doc.setTextColor('#6b6b76');
  doc.text(`Výšky políc ${refTxt} (mm)`, 112, 55);
  drawTable(doc, 112, 58, [38, 15, 15, 16], ['Polica', 'Spodná', 'Horná', 'Os'], rows, 6.2);

  doc.setFontSize(7.5); doc.setTextColor('#98a2b3');
  doc.text('Rovnaké medzery · dno, strop a police rovnakej hrúbky · hodnoty v mm', M, 287);
  return doc;
}

export const pdfFilename = (i: ShelvesInput) =>
  `roztec-polic-${formatMm(i.height, 0.1)}-${formatMm(i.thickness, 0.1)}-${i.count}.pdf`.replace(/,/g, '_');
