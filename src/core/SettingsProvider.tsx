import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_SETTINGS, loadSettings, sanitizeSettings, saveSettings, SettingsContext, type SharedSettings } from './settings';
import { applyTheme, watchSystemTheme } from './theme';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SharedSettings>(loadSettings);

  const update = useCallback((patch: Partial<SharedSettings>) => {
    setSettings(prev => sanitizeSettings({ ...prev, ...patch }));
  }, []);
  const reset = useCallback(() => setSettings({ ...DEFAULT_SETTINGS }), []);

  useEffect(() => {
    saveSettings(settings);
    applyTheme(settings.theme, settings.accent);
    if (settings.theme !== 'system') return;
    return watchSystemTheme(() => applyTheme('system', settings.accent));
  }, [settings]);

  const value = useMemo(() => ({ settings, update, reset }), [settings, update, reset]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
