import { createContext, useContext } from 'react';
import { readJSON, storageKey, writeJSON } from './storage';
import { ROUNDING_STEPS, type RoundingStep } from './format';

export type ThemeMode = 'system' | 'light' | 'dark';
export type Accent = 'teal' | 'cyan' | 'indigo';

/** Spoločné nastavenia pre všetky nástroje. */
export interface SharedSettings {
  /** hrúbka materiálu (korpus, police, boky šuplíkov) v mm */
  thickness: number;
  rounding: RoundingStep;
  theme: ThemeMode;
  accent: Accent;
}

export const SHARED_KEY = storageKey('shared', 1);

export const DEFAULT_SETTINGS: SharedSettings = {
  thickness: 18,
  rounding: 0.5,
  theme: 'system',
  accent: 'teal',
};

const ACCENTS: Accent[] = ['teal', 'cyan', 'indigo'];
const THEMES: ThemeMode[] = ['system', 'light', 'dark'];

/** Z ľubovoľných (aj starých/poškodených) dát spraví platné nastavenia. */
export function sanitizeSettings(raw: unknown): SharedSettings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Partial<Record<keyof SharedSettings, unknown>>;
  const t = Number(r.thickness);
  return {
    thickness: Number.isFinite(t) && t > 0 && t <= 100 ? t : DEFAULT_SETTINGS.thickness,
    rounding: ROUNDING_STEPS.includes(Number(r.rounding) as RoundingStep)
      ? (Number(r.rounding) as RoundingStep)
      : DEFAULT_SETTINGS.rounding,
    theme: THEMES.includes(r.theme as ThemeMode) ? (r.theme as ThemeMode) : DEFAULT_SETTINGS.theme,
    accent: ACCENTS.includes(r.accent as Accent) ? (r.accent as Accent) : DEFAULT_SETTINGS.accent,
  };
}

export const loadSettings = () => sanitizeSettings(readJSON(SHARED_KEY));
export const saveSettings = (s: SharedSettings) => writeJSON(SHARED_KEY, s);

export interface SettingsCtx {
  settings: SharedSettings;
  update: (patch: Partial<SharedSettings>) => void;
  reset: () => void;
}
export const SettingsContext = createContext<SettingsCtx | null>(null);

export function useSettings(): SettingsCtx {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings mimo SettingsProvider');
  return ctx;
}
