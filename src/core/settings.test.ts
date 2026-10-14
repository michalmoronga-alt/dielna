import { beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS, loadSettings, sanitizeSettings, saveSettings, SHARED_KEY } from './settings';

describe('spoločné nastavenia', () => {
  beforeEach(() => localStorage.clear());

  it('predvolené: hrúbka 18, zaokrúhlenie 0,5, téma podľa telefónu', () => {
    expect(DEFAULT_SETTINGS).toEqual({ thickness: 18, rounding: 0.5, theme: 'system', accent: 'teal' });
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('uloží a načíta', () => {
    saveSettings({ thickness: 16, rounding: 1, theme: 'dark', accent: 'cyan' });
    expect(SHARED_KEY).toBe('dielna:shared:v1');
    expect(loadSettings()).toEqual({ thickness: 16, rounding: 1, theme: 'dark', accent: 'cyan' });
  });

  it('opraví poškodené dáta', () => {
    localStorage.setItem(SHARED_KEY, '{nie json');
    expect(loadSettings()).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings({ thickness: -5, rounding: 0.3, theme: 'ruzova', accent: 1 })).toEqual(DEFAULT_SETTINGS);
    expect(sanitizeSettings({ thickness: '19' })).toMatchObject({ thickness: 19 });
  });
});
