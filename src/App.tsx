import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ClippyProvider, AGENTS } from '@react95/clippy';
import { I18nProvider } from './i18n/context';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Router } from './router';

// Lazy-load Clippy (sprite maps ~1.8MB) so first paint stays lean.
// Agent chunks download async after mount, never block initial render.
const ClippyAssistant = lazy(() => import('./components/Clippy/ClippyAssistant'));

function App() {
  return (
    <HelmetProvider>
      <I18nProvider>
        <ErrorBoundary>
          <ClippyProvider agentName={AGENTS.CLIPPY}>
            <Router />
            <Suspense fallback={null}>
              <ClippyAssistant />
            </Suspense>
          </ClippyProvider>
        </ErrorBoundary>
      </I18nProvider>
    </HelmetProvider>
  );
}

export default App;
