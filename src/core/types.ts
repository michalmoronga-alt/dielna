import type { ComponentType, ReactNode } from 'react';
import type { SharedSettings } from './settings';

/**
 * Kontrakt nástroja (modulu). Každý nástroj je priečinok v src/modules/<id>/:
 *   meta.tsx    – tento popis (registruje sa v core/registry.ts)
 *   calc.ts     – čistý výpočet (bez Reactu, DOM a localStorage) + calc.test.ts
 *   Drawing.tsx – nákres z výsledku (nič nepočíta)
 *   View.tsx    – obrazovka nástroja (default export), načíta sa lenivo
 */
export interface ToolMeta {
  /** stabilné id — používa sa v úložisku (`dielna:<id>:v1`), nemeniť */
  id: string;
  title: string;
  subtitle: string;
  icon: ReactNode;
  /** cesta v appke, napr. '/police' */
  route: string;
  /** ready = funkčný nástroj; soon = dlaždica „Pripravujeme“ */
  status: 'ready' | 'soon';
  /** krátky súhrn posledného zadania na dlaždicu („850 · 5 políc“) */
  summary?: (settings: SharedSettings) => string | null;
  /** lenivé načítanie obrazovky */
  load?: () => Promise<{ default: ComponentType }>;
}
