import { Suspense, lazy, useSyncExternalStore } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ClippyProvider, AGENTS } from '@react95/clippy';
import { I18nProvider } from './i18n/context';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppRoutes } from './router';

// Lazy-load Clippy (sprite maps ~1.8MB) so first paint stays lean.
// Agent chunks download async after mount, never block initial render.
const ClippyAssistant = lazy(() => import('./components/Clippy/ClippyAssistant'));

const subscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function App() {
  // Prerendering uses renderToString, which cannot wait for lazy components.
  // Mount Clippy only after hydration so server markup stays error-free.
  const showClippy = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  return (
    <HelmetProvider>
      <I18nProvider>
        <ErrorBoundary>
          <ClippyProvider agentName={AGENTS.CLIPPY}>
            <AppRoutes />
            {showClippy && (
              <Suspense fallback={null}>
                <ClippyAssistant />
              </Suspense>
            )}
          </ClippyProvider>
        </ErrorBoundary>
      </I18nProvider>
    </HelmetProvider>
  );
}

export default App;
