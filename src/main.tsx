
  import { createRoot } from 'react-dom/client';
  import App from './App';
  import './index.css';
  import setupGlobalErrorHandlers from './setupGlobalErrorHandlers';
  import ErrorBoundary from './components/ErrorBoundary';

  // Setup global handlers early to capture runtime errors
  setupGlobalErrorHandlers();

  // Wrap render in try/catch to capture missing module / 404-like errors in dev
  try {
    const rootEl = document.getElementById('root');
    if (!rootEl) {
      // eslint-disable-next-line no-console
      console.error('Root element #root not found in document.');
    } else {
      createRoot(rootEl).render(
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      );
    }
  } catch (err) {
    // Helpful diagnostic when import/render fails (often due to wrong base/build)
    // eslint-disable-next-line no-console
    console.error('Error mounting React app:', err);
    // If the error looks like a module load or 404, provide actionable hint
    try {
      const message = (err as Error).message || String(err);
      if (/failed to fetch|404|Module not found|Failed to fetch/i.test(message)) {
        // eslint-disable-next-line no-console
        console.error('Asset 404 or module load failed. Check `vite.config.ts` base (VITE_BASE) and ensure you built with the correct base.');
      }
    } catch (_) {
      // swallow
    }
    throw err;
  }
  