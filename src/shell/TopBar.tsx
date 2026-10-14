import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSettings } from '../core/settings';
import { resolveTheme } from '../core/theme';
import { IconBack, IconGear, IconLogo, IconMoon, IconSun } from '../ui/icons';

export function ThemeToggle() {
  const { settings, update } = useSettings();
  const dark = resolveTheme(settings.theme) === 'dark';
  return (
    <button type="button" className="ib" onClick={() => update({ theme: dark ? 'light' : 'dark' })}
      aria-label={dark ? 'Prepnúť na svetlú tému' : 'Prepnúť na tmavú tému'} title="Svetlá / tmavá">
      {dark ? <IconSun /> : <IconMoon />}
    </button>
  );
}

export function TopBar({ title, icon, back, right }: { title: string; icon?: ReactNode; back?: boolean; right?: ReactNode }) {
  const nav = useNavigate();
  return (
    <header className="topbar">
      {back ? (
        <button type="button" className="back" onClick={() => (history.length > 1 ? nav(-1) : nav('/'))} aria-label="Späť">
          <IconBack />
        </button>
      ) : null}
      <span className={back ? 'logo logo-sm' : 'logo'}>{icon ?? <IconLogo />}</span>
      <h1>{title}</h1>
      <span className="flex-1" />
      {right}
    </header>
  );
}

export function HomeTopBar() {
  return (
    <TopBar title="Dielňa" right={<>
      <ThemeToggle />
      <Link to="/nastavenia" className="ib" aria-label="Nastavenia" title="Nastavenia"><IconGear /></Link>
    </>} />
  );
}
