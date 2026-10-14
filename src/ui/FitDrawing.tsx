import { useEffect, useRef, useState } from 'react';
import type { Drawing } from '../core/draw/shapes';
import { ShapeSvg } from './ShapeSvg';

/** Nákres vždy v skutočnej veľkosti plochy (ostré čísla, nič sa neorezáva). */
export function FitDrawing({ build, className = '' }: { build: (w: number, h: number) => Drawing; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 368, h: 460 });
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = Math.round(el.clientWidth), h = Math.round(el.clientHeight);
        if (w > 0 && h > 0) setSize(s => (s.w === w && s.h === h ? s : { w, h }));
      });
    });
    ro.observe(el);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);
  let drawing: Drawing | null = null;
  try { drawing = build(size.w, size.h); } catch (e) { console.error(e); }
  return (
    <div ref={ref} className={`fit-drawing ${className}`}>
      {drawing ? <ShapeSvg drawing={drawing} /> : <p className="draw-err">Nákres sa nepodarilo vykresliť. Výsledky platia.</p>}
    </div>
  );
}
