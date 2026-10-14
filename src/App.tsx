import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { SettingsProvider } from './core/SettingsProvider';
import { readyTools } from './core/registry';
import { Home } from './shell/Home';
import { Settings } from './shell/Settings';
import { ToolPage } from './shell/ToolPage';

export function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nastavenia" element={<Settings />} />
          {readyTools().map(t => <Route key={t.id} path={t.route} element={<ToolPage tool={t} />} />)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </SettingsProvider>
  );
}
