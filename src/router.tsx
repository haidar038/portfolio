import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Lazy load page components
const Home = lazy(() => import('./pages/Home'));
const Guestbook = lazy(() => import('./pages/Guestbook'));
const Blogroll = lazy(() => import('./pages/Blogroll'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-retro-text">Loading...</div>
    </div>
  );
}

// Create browser router with all routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/guestbook',
    element: <Guestbook />,
  },
  {
    path: '/blogroll',
    element: <Blogroll />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

// Router component with Suspense wrapper
export function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
