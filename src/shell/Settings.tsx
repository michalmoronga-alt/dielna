import { useEffect, useState } from 'react';
import { useSettings, type Accent, type ThemeMode } from '../core/settings';
import { formatMm, parseNum, type RoundingStep } from '../core/format';
import { Segmented } from '../ui/Segmented';
import { TopBar } from './TopBar';
import { IconGear } from '../ui/icons';

const ACCENTS: { v: Accent; label: string; color: string }[] = [
  { v: 'teal', label: 'Teal', color: '#0d9488' },
  { v: 'cyan', label: 'Cyan', color: '#0891b2' },
  { v: 'indigo', label: 'Indigo', color: '#5e6ad2' },
];

export function Settings() {
  const { settings, update, reset } = useSettings();
  const [t, setT] = useState(formatMm(settings.thickness, 0.1));
  useEffect(() => setT(formatMm(settings.thickness, 0.1)), [settings.thickness]);
  const tNum = parseNum(t);
  const tBad = !(tNum > 0 && tNum <= 100);

  return (
    <div className="page">
      <TopBar title="Nastavenia" icon={<IconGear />} back />
      <main className="stack">
        <h3 className="sec">Vzhľad</h3>
        <div className="card group">
          <div className="gi">
            <div className="gl"><b>Téma</b><span>Systém = podľa telefónu</span></div>
            <Segmented<ThemeMode> label="Téma" value={settings.theme} onChange={v => update({ theme: v })}
              options={[{ value: 'light', label: 'Svetlá' }, { value: 'dark', label: 'Tmavá' }, { value: 'system', label: 'Systém' }]} />
          </div>
          <div className="gi">
            <div className="gl"><b>Akcent</b><span>{ACCENTS.find(a => a.v === settings.accent)?.label}</span></div>
            <div className="swatches" role="radiogroup" aria-label="Akcent">
              {ACCENTS.map(a => (
                <button key={a.v} type="button" role="radio" aria-checked={a.v === settings.accent} aria-label={a.label}
                  className={a.v === settings.accent ? 'on' : ''} style={{ background: a.color }} onClick={() => update({ accent: a.v })} />
              ))}
            </div>
          </div>
        </div>

        <h3 className="sec">Spoločné hodnoty</h3>
        <div className="card group">
          <div className="gi">
            <div className="gl"><b>Hrúbka materiálu</b><span>Korpus, police aj boky šuplíkov</span></div>
            <label className={`inp-sm${tBad ? ' bad' : ''}`}>
              <input inputMode="decimal" value={t} aria-label="Hrúbka materiálu v mm"
                onChange={e => { setT(e.target.value); const n = parseNum(e.target.value); if (n > 0 && n <= 100) update({ thickness: n }); }}
                onBlur={() => setT(formatMm(settings.thickness, 0.1))} />
              <span>mm</span>
            </label>
          </div>
          <div className="gi">
            <div className="gl"><b>Zaokrúhlenie</b><span>Iba zobrazenie, počíta sa presne</span></div>
            <Segmented<RoundingStep> label="Zaokrúhlenie" value={settings.rounding} onChange={v => update({ rounding: v })}
              options={[{ value: 0.1, label: '0,1' }, { value: 0.5, label: '0,5' }, { value: 1, label: '1 mm' }]} />
          </div>
        </div>

        <button type="button" className="btn-ghost" onClick={reset}>Obnoviť predvolené (18 mm, 0,5, podľa telefónu)</button>
        <footer className="ver">Dielňa v{__APP_VERSION__}</footer>
      </main>
    </div>
  );
}
