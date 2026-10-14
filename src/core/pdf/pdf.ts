// Vektorové PDF (jsPDF): nákres sa kreslí čiarami a textom, nie snímkou obrazovky.
// Načítava sa lenivo (až pri kliknutí na „Stiahnuť PDF“).
import { jsPDF } from 'jspdf';
import { PRINT_INK, type Drawing } from '../draw/shapes';
import { interRegular } from './font-inter-400';
import { interSemiBold } from './font-inter-600';

export const FONT = 'Inter';

export function createDoc(): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });
  doc.addFileToVFS('Inter-Regular.ttf', interRegular);
  doc.addFont('Inter-Regular.ttf', FONT, 'normal');
  doc.addFileToVFS('Inter-SemiBold.ttf', interSemiBold);
  doc.addFont('Inter-SemiBold.ttf', FONT, 'bold');
  doc.setFont(FONT, 'normal');
  doc.setLineCap('butt');
  return doc;
}

const PT_PER_MM = 72 / 25.4;

/** Vykreslí nákres do obdĺžnika (x, y, w, h) v mm, so zachovaním pomeru strán. */
export function drawShapes(doc: jsPDF, d: Drawing, box: { x: number; y: number; w: number; h: number }): void {
  const s = Math.min(box.w / d.width, box.h / d.height);
  const ox = box.x + (box.w - d.width * s) / 2, oy = box.y;
  const X = (v: number) => ox + v * s, Y = (v: number) => oy + v * s;

  for (const sh of d.shapes) {
    switch (sh.k) {
      case 'rect': {
        const style = sh.fill && sh.stroke ? 'FD' : sh.fill ? 'F' : 'S';
        if (sh.fill) doc.setFillColor(PRINT_INK[sh.fill]);
        if (sh.stroke) { doc.setDrawColor(PRINT_INK[sh.stroke]); doc.setLineWidth((sh.sw ?? 1) * s); }
        doc.setLineDashPattern(sh.dash ? sh.dash.map(v => v * s) : [], 0);
        if (sh.r) doc.roundedRect(X(sh.x), Y(sh.y), sh.w * s, sh.h * s, sh.r * s, sh.r * s, style);
        else doc.rect(X(sh.x), Y(sh.y), Math.max(0, sh.w * s), Math.max(0, sh.h * s), style);
        break;
      }
      case 'line':
        doc.setDrawColor(PRINT_INK[sh.stroke]); doc.setLineWidth((sh.sw ?? 1) * s);
        doc.setLineDashPattern(sh.dash ? sh.dash.map(v => v * s) : [], 0);
        doc.line(X(sh.x1), Y(sh.y1), X(sh.x2), Y(sh.y2));
        break;
      case 'circle':
        doc.setFillColor(PRINT_INK[sh.fill]); doc.circle(X(sh.cx), Y(sh.cy), sh.r * s, 'F');
        break;
      case 'text': {
        doc.setFont(FONT, sh.bold ? 'bold' : 'normal');
        doc.setFontSize(sh.size * s * PT_PER_MM);
        doc.setTextColor(PRINT_INK[sh.fill]);
        const w = doc.getTextWidth(sh.text);
        const shift = sh.anchor === 'middle' ? w / 2 : sh.anchor === 'end' ? w : 0;
        if (sh.rotate === -90) doc.text(sh.text, X(sh.x), Y(sh.y) + shift, { angle: 90 });
        else doc.text(sh.text, X(sh.x) - shift, Y(sh.y));
        break;
      }
    }
  }
  doc.setLineDashPattern([], 0);
}

/** Jednoduchá tabuľka: hlavička + riadky, prvý stĺpec vľavo, ostatné vpravo. */
export function drawTable(doc: jsPDF, x: number, y: number, widths: number[], head: string[],
  rows: { cells: string[]; muted?: boolean; bold?: boolean }[], rowH = 6.4): number {
  const total = widths.reduce((a, b) => a + b, 0);
  doc.setFillColor('#f3f4f6'); doc.rect(x, y, total, rowH, 'F');
  const cellText = (cells: string[], yy: number, size: number, color: string, bold = false) => {
    doc.setFont(FONT, bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(color);
    let cx = x;
    cells.forEach((c, i) => {
      if (i === 0) doc.text(c, cx + 2, yy);
      else doc.text(c, cx + widths[i] - 2, yy, { align: 'right' });
      cx += widths[i];
    });
  };
  cellText(head, y + rowH - 2, 8, '#6b6b76', true);
  let yy = y + rowH;
  doc.setDrawColor('#e5e7eb'); doc.setLineWidth(0.2);
  for (const r of rows) {
    cellText(r.cells, yy + rowH - 2, r.muted ? 8.5 : 10, r.muted ? '#6b6b76' : '#1b1b1f', r.bold);
    yy += rowH;
    doc.line(x, yy, x + total, yy);
  }
  return yy;
}

export function downloadPdf(doc: jsPDF, filename: string): void {
  doc.save(filename);
}
