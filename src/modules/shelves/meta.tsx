import type { ToolMeta } from '../../core/types';
import { IconShelf } from '../../ui/icons';
import { readJSON } from '../../core/storage';
import { SHELVES_KEY, type ShelvesState } from './state';

export const shelvesMeta: ToolMeta = {
  id: 'shelves',
  title: 'Rozteč políc',
  subtitle: 'Svetlý priestor a výšky políc',
  icon: <IconShelf />,
  route: '/police',
  status: 'ready',
  summary: () => {
    const s = readJSON<Partial<ShelvesState>>(SHELVES_KEY);
    if (!s?.h || !s.n) return null;
    const n = parseInt(String(s.n), 10);
    return `${s.h} · ${n} ${n === 1 ? 'polica' : n >= 2 && n <= 4 ? 'police' : 'políc'}`;
  },
  load: () => import('./View'),
};
