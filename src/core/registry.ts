import type { ToolMeta } from './types';
import { shelvesMeta } from '../modules/shelves/meta';
import { drawersMeta } from '../modules/drawers/meta';
import { doorsMeta } from '../modules/doors/meta';
import { gasStrutsMeta } from '../modules/gas-struts/meta';
import { raster32Meta } from '../modules/raster32/meta';

/** Poradie = poradie dlaždíc na domovskej obrazovke. Nový nástroj = nový riadok. */
export const TOOLS: ToolMeta[] = [shelvesMeta, drawersMeta, doorsMeta, gasStrutsMeta, raster32Meta];

export const readyTools = () => TOOLS.filter(t => t.status === 'ready');
export const soonTools = () => TOOLS.filter(t => t.status === 'soon');
export const findTool = (route: string) => TOOLS.find(t => t.route === route);
