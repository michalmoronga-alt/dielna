import { Component, type ReactNode } from 'react';

/** Chyba v jednom nástroji nezhodí celú appku. */
export class ErrorBoundary extends Component<{ name: string; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) { console.error(error); }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="card p-5 flex flex-col gap-3 items-start error-card" role="alert">
        <b>{this.props.name}: niečo sa pokazilo.</b>
        <span className="text-sm">{this.state.error.message}</span>
        <button type="button" className="btn-ghost" onClick={() => location.reload()}>Načítať znova</button>
      </div>
    );
  }
}
