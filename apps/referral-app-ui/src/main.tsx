import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { ToastContainer } from 'react-toastify';
import { ErrorBoundary } from './components/ErrorBoundary/error-boundary';
import { Loader, Typography } from './components/index.ts';
import App from './pages/App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ErrorBoundary fallback={<Typography variant='h1'>Something went wrong. Please try again later.</Typography>}>
        <Suspense fallback={<Loader overlay />}>
          <App />
          <ToastContainer />
        </Suspense>
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
);
