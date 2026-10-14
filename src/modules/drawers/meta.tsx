import type { ToolMeta } from '../../core/types';
import { IconDrawer } from '../../ui/icons';

export const drawersMeta: ToolMeta = {
  id: 'drawers',
  title: 'Šuplíky',
  subtitle: 'Koľajnice a vŕtanie čiel · Hettich Atira',
  icon: <IconDrawer />,
  route: '/supliky',
  status: 'ready',
  load: () => import('./View'),
};
