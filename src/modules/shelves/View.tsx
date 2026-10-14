import { useEffect, useMemo, useState } from 'react';
import { useSettings } from '../../core/settings';
import { formatMm, parseNum, roundTo, type RoundingStep } from '../../core/format';
import { NumberField, Stepper } from '../../ui/NumberField';
import { Segmented } from '../../ui/Segmented';
import { FitDrawing } from '../../ui/FitDrawing';
import { IconDownload, IconSliders } from '../../ui/icons';
import { calcShelves, ERROR_TEXT, MAX_SHELVES, type HeightMode } from './calc';
import { buildSection, type HeightRef } from './drawing';
import { loadState, saveState, type ShelvesState } from './state';

const CHIPS = [16, 18, 19, 22, 25];

export default function ShelvesView() {
  const { settings, update } = useSettings();
  const [S, setS] = useState<ShelvesState>(() => loadState(settings.thickness));
  const [pdfBusy, setPdfBusy] = useState<string | null>(null);
  useEffect(() => saveState(S), [S]);
  const set = (patch: Partial<ShelvesState>) => setS(prev => ({ ...prev, ...patch }));

  const step = settings.rounding;
  const input = useMemo(() => ({ height: parseNum(S.h), mode: S.mode, thickness: parseNum(S.t), count: parseNum(S.n) }), [S]);
  const R = useMemo(() => calcShelves(input), [input]);
  const off = S.ref === 'outer' ? R.thickness : 0;
  const exact = R.ok && Math.abs(roundTo(R.gap, step) - R.gap) > 0.005;
  const refTxt = S.ref === 'outer' ? 'od spodnej hrany korpusu' : 'od vnútorného dna';

  async function downloadPdf() {
    if (!R.ok) return;
    setPdfBusy('Pripravujem PDF…');
    try {
      const m = await import('./pdf');
      const doc = m.buildShelvesPdf({ input, R, step, ref: S.ref });
      doc.save(m.pdfFilename(input));
      setPdfBusy(null);
    } catch (e) {
      console.error(e);
      setPdfBusy('PDF sa nepodarilo vytvoriť.');
    }
  }

  return (
    <div className="tool">
      <div className="tool-screen">
        <section className="card tool-inputs" aria-label="Zadanie">
          <div className="row">
            <Segmented<HeightMode> label="Rozmer skrinky" value={S.mode} onChange={v => set({ mode: v })}
              options={[{ value: 'inner', label: 'Vnút.' }, { value: 'outer', label: 'Vonk.' }]} />
            <NumberField className="grow" label={S.mode === 'outer' ? 'Vonkajšia výška' : 'Vnútorná (svetlá) výška'}
              value={S.h} onChange={v => set({ h: v })} bad={R.error === 'height'} id="sh-h" />
          </div>
          <div className="row">
            <NumberField className="w-t" label="Hrúbka" value={S.t} onChange={v => set({ t: v })} bad={R.error === 'thickness'} id="sh-t" />
            <Stepper label="Police" value={S.n} onChange={v => set({ n: v })} max={MAX_SHELVES} bad={R.error === 'count'} id="sh-n" />
            <button type="button" className={`more-btn${S.more ? ' on' : ''}`} aria-expanded={S.more} aria-controls="sh-more"
              onClick={() => set({ more: !S.more })} title="Viac nastavení"><IconSliders /></button>
          </div>
          {S.more ? (
            <div className="more" id="sh-more">
              <div className="opt"><span>Hrúbka</span>
                <div className="chips">{CHIPS.map(c => (
                  <button key={c} type="button" className={`chipbtn${parseNum(S.t) === c ? ' on' : ''}`} onClick={() => set({ t: String(c) })}>{c}</button>
                ))}</div>
              </div>
              <div className="opt"><span>Výšky od</span>
                <Segmented<HeightRef> label="Výšky merané od" value={S.ref} onChange={v => set({ ref: v })}
                  options={[{ value: 'inner', label: 'vnút. dna' }, { value: 'outer', label: 'spodnej hrany' }]} />
              </div>
              <div className="opt"><span>Zaokrúhlenie</span>
                <Segmented<RoundingStep> label="Zaokrúhlenie" value={step} onChange={v => update({ rounding: v })}
                  options={[{ value: 0.1, label: '0,1' }, { value: 0.5, label: '0,5' }, { value: 1, label: '1 mm' }]} />
              </div>
            </div>
          ) : null}
          {R.error ? <div className="err" role="alert">{ERROR_TEXT[R.error]}</div> : null}
        </section>

        <section className={`card strip${R.ok ? '' : ' bad'}`} aria-live="polite">
          <div className="strip-main">
            <div className="strip-k">Svetlý priestor {exact ? <span className="exact">· presne {R.gap.toLocaleString('sk-SK', { maximumFractionDigits: 2 })}</span> : null}</div>
            <div className="strip-v num" data-testid="gap">{R.ok ? formatMm(R.gap, step, true) : '—'}<small>mm</small></div>
          </div>
          <div className="strip-minis">
            <div><span>Vnútorná</span><b className="num" data-testid="inner">{R.inner > 0 ? formatMm(R.inner, step) : '—'}</b></div>
            <div><span>Rozteč osí</span><b className="num" data-testid="pitch">{R.ok && R.count > 0 ? formatMm(R.pitch, step) : '—'}</b></div>
          </div>
        </section>

        <section className="card tool-drawing">
          <FitDrawing build={(w, h) => buildSection(R, { step, ref: S.ref, width: w, height: h })} />
        </section>
      </div>

      <section className="card tablecard">
        <div className="card-h"><h2>Výšky políc</h2><span>{refTxt}</span></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Polica</th><th>Spodná</th><th>Horná</th><th>Os</th></tr></thead>
            <tbody>
              {R.inner > 0 ? <tr className="ref"><td>Strop (spodná plocha)</td><td colSpan={3}>{formatMm(R.inner + off, step)}</td></tr> : null}
              {R.ok ? <>
                <tr className="gaprow"><td>↕ svetlý priestor</td><td colSpan={3}>{formatMm(R.gap, step, true)}</td></tr>
                {[...R.shelves].reverse().map(s => [
                  <tr key={`s${s.index}`}><td><i className="dot" />Polica {s.index}</td><td>{formatMm(s.bottom + off, step)}</td><td>{formatMm(s.top + off, step)}</td><td className="os">{formatMm(s.axis + off, step)}</td></tr>,
                  <tr key={`g${s.index}`} className="gaprow"><td>↕ svetlý priestor</td><td colSpan={3}>{formatMm(R.gap, step, true)}</td></tr>,
                ])}
              </> : <tr className="msg"><td colSpan={4}>{R.error === 'noFit' ? 'Police sa nezmestia' : 'Doplň zadanie'}</td></tr>}
              {R.inner > 0 ? <tr className="ref"><td>Dno (horná plocha)</td><td colSpan={3}>{formatMm(off, step)}</td></tr> : null}
            </tbody>
          </table>
        </div>
        <div className="tablefoot">
          <button type="button" className="btn-primary" onClick={downloadPdf} disabled={!R.ok || pdfBusy === 'Pripravujem PDF…'}>
            <IconDownload /> Stiahnuť PDF
          </button>
          {pdfBusy ? <span className="muted-sm" role="status">{pdfBusy}</span> : null}
        </div>
      </section>
    </div>
  );
}
