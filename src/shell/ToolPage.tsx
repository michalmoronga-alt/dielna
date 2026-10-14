import { lazy, Suspense, useMemo } from 'react';
import { Navigate } from 'react-router';
import type { ToolMeta } from '../core/types';
import { ErrorBoundary } from './ErrorBoundary';
import { ThemeToggle, TopBar } from './TopBar';

export function ToolPage({ tool }: { tool: ToolMeta }) {
  const View = useMemo(() => (tool.load ? lazy(tool.load) : null), [tool]);
  if (!View) return <Navigate to="/" replace />;
  return (
    <div className="page">
      <TopBar title={tool.title} icon={tool.icon} back right={<ThemeToggle />} />
      <main className="stack">
        <ErrorBoundary name={tool.title}>
          <Suspense fallback={<div className="card p-5 text-sm text-muted">Načítavam…</div>}>
            <View />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
