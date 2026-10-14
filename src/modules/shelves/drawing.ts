// Nákres rezu skrinky ako zoznam tvarov (core/draw/shapes). Bez Reactu — použije ho obrazovka aj PDF.
import { formatMm } from '../../core/format';
import { tick, type Drawing, type Shape } from '../../core/draw/shapes';
import type { ShelvesResult } from './calc';

export type HeightRef = 'inner' | 'outer';

export function buildSection(R: ShelvesResult, opts: { step: number; ref: HeightRef; width: number; height: number }): Drawing {
  const Wv = Math.max(260, Math.round(opts.width)), Hv = Math.max(220, Math.round(opts.height));
  const FS = 12.5, L = 88, RZ = 112;
  const W = Math.max(70, Math.min(190, Wv - L - RZ - 6));
  const x0 = Math.round((Wv - (L + W + RZ)) / 2 + L);
  const y0 = 12, H = Hv - y0 - 26;
  const out: Shape[] = [];
  const label = 'Nákres rezu skrinky';

  if (!(R.outer > 0) || !(R.inner > 0)) {
    out.push({ k: 'rect', x: x0, y: y0, w: W, h: H, r: 4, stroke: 'line', dash: [4, 4] },
      { k: 'text', x: x0 + W / 2, y: y0 + H / 2, text: 'Zadaj rozmery', size: 13, fill: 'faint', anchor: 'middle' });
    return { width: Wv, height: Hv, shapes: out, label };
  }

  const t = R.thickness, n = R.count, step = opts.step;
  const s = H / R.outer, tp = Math.max(t * s, 3);
  const y = (mm: number) => y0 + H - mm * s;
  const off = opts.ref === 'outer' ? t : 0;
  const ext = (x1: number, x2: number, yy: number): Shape => ({ k: 'line', x1, y1: yy, x2, y2: yy, stroke: 'faint', sw: 0.6 });
  const panel = (x: number, yy: number, w: number, h: number): Shape => ({ k: 'rect', x, y: yy, w, h, fill: 'wood', stroke: 'woodLine', sw: 1 });

  out.push(panel(x0, y0, tp, H), panel(x0 + W - tp, y0, tp, H), panel(x0 + tp, y0, W - 2 * tp, tp), panel(x0 + tp, y0 + H - tp, W - 2 * tp, tp));
  out.push({ k: 'rect', x: x0 + tp, y: y0 + tp, w: W - 2 * tp, h: H - 2 * tp, fill: 'paper' });

  if (!R.ok) {
    out.push({ k: 'rect', x: x0 + W / 2 - 66, y: y0 + H / 2 - 17, w: 132, h: 30, r: 6, fill: 'dangerSoft', stroke: 'danger' },
      { k: 'text', x: x0 + W / 2, y: y0 + H / 2 + 3, text: 'Police sa nezmestia', size: 12.5, fill: 'danger', anchor: 'middle', bold: true });
    return { width: Wv, height: Hv, shapes: out, label };
  }

  const gap = R.gap, gapTxt = formatMm(gap, step, true);
  for (let k = 0; k <= n; k++) {
    const lo = t + k * (gap + t);
    out.push({ k: 'rect', x: x0 + tp, y: y(lo + gap), w: W - 2 * tp, h: gap * s, fill: 'gapFill' });
  }
  for (const sh of R.shelves) {
    const yb = y(sh.bottom + t), yt = y(sh.top + t), h = Math.max(yb - yt, 2.5);
    out.push({ k: 'rect', x: x0 + tp, y: yt, w: W - 2 * tp, h, fill: 'accSoft', stroke: 'acc', sw: 1.2 });
    if (h >= 10) out.push({ k: 'text', x: x0 + W / 2, y: (yt + yb) / 2 + 3.5, text: `P${sh.index}`, size: 10, fill: 'accInk', anchor: 'middle', bold: true });
    if (h >= 6) { const ya = y(sh.axis + t); out.push({ k: 'line', x1: x0 - 6, y1: ya, x2: x0 + W + 6, y2: ya, stroke: 'acc', sw: 0.6, dash: [6, 3, 1, 3] }); }
  }

  // vpravo: reťazová kóta svetlých priestorov
  const xr = x0 + W + 24;
  for (let k = 0; k <= n; k++) {
    const lo = t + k * (gap + t), ya = y(lo), yb = y(lo + gap);
    out.push(ext(x0 + W + 2, xr + 6, ya), ext(x0 + W + 2, xr + 6, yb),
      { k: 'line', x1: xr, y1: ya, x2: xr, y2: yb, stroke: 'gap', sw: 1.1 }, tick(xr, ya, 'gap'), tick(xr, yb, 'gap'));
    if (ya - yb >= 38) out.push({ k: 'text', x: xr - 6, y: (ya + yb) / 2, text: gapTxt, size: FS, fill: 'gap', anchor: 'middle', bold: true, rotate: -90 });
  }
  // vpravo: vonkajšia a vnútorná výška
  const xo = xr + 40, xi = xo + 38;
  out.push(ext(x0 + W + 2, xo + 6, y(0)), ext(x0 + W + 2, xo + 6, y(R.outer)),
    { k: 'line', x1: xo, y1: y(0), x2: xo, y2: y(R.outer), stroke: 'ink' }, tick(xo, y(0), 'ink'), tick(xo, y(R.outer), 'ink'),
    { k: 'text', x: xo - 6, y: y(R.outer / 2), text: `${formatMm(R.outer, step)} vonk.`, size: FS, fill: 'ink', anchor: 'middle', rotate: -90 });
  out.push(ext(xr + 6, xi + 6, y(t)), ext(xr + 6, xi + 6, y(R.outer - t)),
    { k: 'line', x1: xi, y1: y(t), x2: xi, y2: y(R.outer - t), stroke: 'faint' }, tick(xi, y(t), 'faint'), tick(xi, y(R.outer - t), 'faint'),
    { k: 'text', x: xi - 6, y: y(R.outer / 2), text: `${formatMm(R.inner, step)} vnút.`, size: FS, fill: 'faint', anchor: 'middle', rotate: -90 });

  // vľavo: súradnicové kóty spodných hrán políc
  const xb = x0 - 34, base = off ? 0 : t, top = R.outer - t;
  out.push({ k: 'line', x1: xb, y1: y(base), x2: xb, y2: y(top), stroke: 'ink' });
  const pts = [{ mm: base, label: '0', bold: false },
    ...R.shelves.map(sh => ({ mm: sh.bottom + t, label: formatMm(sh.bottom + off, step), bold: true })),
    { mm: top, label: formatMm(R.inner + off, step), bold: false }];
  let lastY = Infinity; const topY = y(top);
  pts.forEach((p, idx) => {
    const yy = y(p.mm), isEnd = idx === 0 || idx === pts.length - 1;
    out.push({ k: 'line', x1: xb - 4, y1: yy, x2: x0 - 2, y2: yy, stroke: 'ink', sw: 0.6 }, { k: 'circle', cx: xb, cy: yy, r: 2.3, fill: 'ink' });
    if (isEnd || (lastY - yy >= 15 && yy - topY >= 15)) {
      out.push({ k: 'text', x: xb - 6, y: yy + 4.5, text: p.label, size: FS, fill: 'ink', anchor: 'end', bold: p.bold });
      lastY = yy;
    }
  });
  out.push({ k: 'text', x: Math.max(4, xb - 50), y: y(base) + 20, text: off ? 'od spodnej hrany' : 'od vnút. dna', size: 10.5, fill: 'faint' });
  return { width: Wv, height: Hv, shapes: out, label };
}
