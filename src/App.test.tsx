import { describe, expect, it } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { App } from './App';

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

describe('shell', () => {
  it('domovská obrazovka ukáže dlaždice', async () => {
    const el = document.createElement('div');
    document.body.appendChild(el);
    await act(async () => createRoot(el).render(<App />));
    const text = el.textContent ?? '';
    expect(text).toContain('Rozteč políc');
    expect(text).toContain('Šuplíky');
    expect(text).toContain('Pripravujeme');
    expect(el.querySelectorAll('a.tile')).toHaveLength(2);
    expect(el.querySelectorAll('.tile.soon')).toHaveLength(3);
  });
});
