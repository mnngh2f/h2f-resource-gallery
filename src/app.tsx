// H2F Resource Gallery - Main App Component

import { ErrorBoundary } from './components/common/ErrorBoundary';
import { GalleryProvider } from './context/GalleryContext';
import { Gallery } from './components/Gallery/Gallery';

export function App() {
  return (
    <ErrorBoundary>
      <GalleryProvider>
        <Gallery />
      </GalleryProvider>
    </ErrorBoundary>
  );
}
