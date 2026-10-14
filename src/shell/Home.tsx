import { Link } from 'react-router';
import { readyTools, soonTools } from '../core/registry';
import { useSettings } from '../core/settings';
import { formatMm } from '../core/format';
import type { ToolMeta } from '../core/types';
import { IconChevron, IconGear } from '../ui/icons';
import { HomeTopBar } from './TopBar';

function Tile({ t }: { t: ToolMeta }) {
  const { settings } = useSettings();
  const last = t.summary?.(settings);
  return (
    <Link to={t.route} className="card tile" data-tool={t.id}>
      <span className="tile-arrow"><IconChevron /></span>
      <span className="tile-ic">{t.icon}</span>
      <div>
        <div className="tile-t">{t.title}</div>
        <div className="tile-d">{t.subtitle}</div>
      </div>
      {last ? <div className="tile-last">Naposledy <b className="num">{last}</b></div> : null}
    </Link>
  );
}

function SoonTile({ t, wide }: { t: ToolMeta; wide?: boolean }) {
  return (
    <div className={`card tile soon${wide ? ' wide' : ''}`} aria-disabled="true" data-tool={t.id}>
      <span className="tile-badge">Pripravujeme</span>
      <span className="tile-ic">{t.icon}</span>
      <div>
        <div className="tile-t">{t.title}</div>
        <div className="tile-d">{t.subtitle}</div>
      </div>
    </div>
  );
}

export function Home() {
  const { settings } = useSettings();
  const soon = soonTools();
  return (
    <div className="page">
      <HomeTopBar />
      <main className="home">
        <div className="hello">
          <h2>Dielenský pomocník</h2>
          <p>Vyber nástroj. Výpočty pre stolára na mobile aj na PC.</p>
        </div>
        <div className="tiles">{readyTools().map(t => <Tile key={t.id} t={t} />)}</div>
        {soon.length ? <>
          <h3 className="sec">Pripravujeme</h3>
          <div className="tiles">
            {soon.map((t, i) => <SoonTile key={t.id} t={t} wide={soon.length % 2 === 1 && i === soon.length - 1} />)}
          </div>
        </> : null}
        <Link to="/nastavenia" className="card defs">
          <IconGear />
          <span>Spoločné: hrúbka <b className="num">{formatMm(settings.thickness, 0.1)}</b> mm · zaokrúhlenie <b className="num">{formatMm(settings.rounding, 0.1)}</b></span>
        </Link>
        <footer className="ver">Dielňa v{__APP_VERSION__}</footer>
      </main>
    </div>
  );
}
