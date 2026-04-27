import { HelmetProvider } from 'react-helmet-async';
import { I18nProvider } from './i18n/context';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Router } from './router';

function App() {
  return (
    <HelmetProvider>
      <I18nProvider>
        <ErrorBoundary>
          <Router />
        </ErrorBoundary>
      </I18nProvider>
    </HelmetProvider>
  );
}

export default App;
