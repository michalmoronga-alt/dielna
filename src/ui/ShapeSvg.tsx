import type { Drawing, Shape } from '../core/draw/shapes';
import { SCREEN_INK } from '../core/draw/shapes';

function el(s: Shape, i: number) {
  const c = SCREEN_INK;
  switch (s.k) {
    case 'rect':
      return <rect key={i} x={s.x} y={s.y} width={Math.max(0, s.w)} height={Math.max(0, s.h)} rx={s.r}
        fill={s.fill ? c[s.fill] : 'none'} stroke={s.stroke ? c[s.stroke] : undefined} strokeWidth={s.sw ?? 1}
        strokeDasharray={s.dash?.join(' ')} />;
    case 'line':
      return <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke={c[s.stroke]} strokeWidth={s.sw ?? 1}
        strokeDasharray={s.dash?.join(' ')} />;
    case 'circle':
      return <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={c[s.fill]} />;
    case 'text':
      return <text key={i} x={s.rotate ? 0 : s.x} y={s.rotate ? 0 : s.y}
        transform={s.rotate ? `translate(${s.x} ${s.y}) rotate(${s.rotate})` : undefined}
        fontSize={s.size} fill={c[s.fill]} textAnchor={s.anchor ?? 'start'} fontWeight={s.bold ? 600 : 400}>{s.text}</text>;
  }
}

export function ShapeSvg({ drawing }: { drawing: Drawing }) {
  return (
    <svg viewBox={`0 0 ${drawing.width} ${drawing.height}`} role="img" aria-label={drawing.label}
      className="shape-svg" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {drawing.shapes.map(el)}
    </svg>
  );
}
