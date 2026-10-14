import { readJSON, storageKey, writeJSON } from '../../core/storage';
import type { HeightMode } from './calc';
import type { HeightRef } from './drawing';

/** Zadanie tak, ako ho používateľ napísal (texty — aby „18,“ počas písania nezmizlo). */
export interface ShelvesState { mode: HeightMode; h: string; t: string; n: string; ref: HeightRef; more: boolean }

export const SHELVES_KEY = storageKey('shelves', 1);

export function defaultState(thickness: number): ShelvesState {
  return { mode: 'outer', h: '720', t: String(thickness).replace('.', ','), n: '2', ref: 'inner', more: false };
}

export function loadState(thickness: number): ShelvesState {
  const d = defaultState(thickness);
  const raw = readJSON<Partial<ShelvesState>>(SHELVES_KEY);
  if (!raw || typeof raw !== 'object') return d;
  const str = (v: unknown, f: string) => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : f);
  return {
    mode: raw.mode === 'inner' ? 'inner' : 'outer',
    h: str(raw.h, d.h), t: str(raw.t, d.t), n: str(raw.n, d.n),
    ref: raw.ref === 'outer' ? 'outer' : 'inner',
    more: raw.more === true,
  };
}

export const saveState = (s: ShelvesState) => writeJSON(SHELVES_KEY, s);
