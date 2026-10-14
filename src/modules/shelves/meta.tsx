import type { ToolMeta } from '../../core/types';
import { IconShelf } from '../../ui/icons';

export const shelvesMeta: ToolMeta = {
  id: 'shelves',
  title: 'Rozteč políc',
  subtitle: 'Svetlý priestor a výšky políc',
  icon: <IconShelf />,
  route: '/police',
  status: 'ready',
  load: () => import('./View'),
};
