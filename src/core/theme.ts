import type { Accent, ThemeMode } from './settings';

const mq = () => (typeof matchMedia === 'function' ? matchMedia('(prefers-color-scheme: dark)') : null);

export function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return mq()?.matches ? 'dark' : 'light';
  return mode;
}

export function applyTheme(mode: ThemeMode, accent: Accent): void {
  const root = document.documentElement;
  root.dataset.theme = resolveTheme(mode);
  root.dataset.accent = accent;
}

export function watchSystemTheme(cb: () => void): () => void {
  const m = mq();
  if (!m) return () => {};
  m.addEventListener('change', cb);
  return () => m.removeEventListener('change', cb);
}
