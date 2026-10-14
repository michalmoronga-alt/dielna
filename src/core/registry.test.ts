import { describe, expect, it } from 'vitest';
import { readyTools, soonTools, TOOLS } from './registry';

describe('register nástrojov', () => {
  it('id a cesty sú unikátne', () => {
    expect(new Set(TOOLS.map(t => t.id)).size).toBe(TOOLS.length);
    expect(new Set(TOOLS.map(t => t.route)).size).toBe(TOOLS.length);
  });
  it('každý hotový nástroj má lenivo načítanú obrazovku', () => {
    for (const t of readyTools()) expect(typeof t.load).toBe('function');
  });
  it('Rozteč políc a Šuplíky sú hotové, ostatné „Pripravujeme“', () => {
    expect(readyTools().map(t => t.id)).toEqual(['shelves', 'drawers']);
    expect(soonTools().map(t => t.id)).toEqual(['doors', 'gas-struts', 'raster32']);
  });
  it('cesty začínajú lomkou a nekolidujú so shellom', () => {
    for (const t of TOOLS) {
      expect(t.route).toMatch(/^\/[a-z0-9-]+$/);
      expect(['/', '/nastavenia']).not.toContain(t.route);
    }
  });
});
