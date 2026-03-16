// Gallery Component - Main container

import { useGallery } from '../../context/GalleryContext';
import { Spinner } from '../common/Spinner';
import { TopPane } from './TopPane/TopPane';
import { CardCarousel } from './Body/CardCarousel';
import { Navigation } from './BottomPane/Navigation';
import { CardModal } from './Modal/CardModal';
import styles from './Gallery.module.css';

export const Gallery = () => {
  const { isLoading, error, isLocked } = useGallery();

  if (isLoading) {
    return (
      <div className={styles.gallery} data-gallery>
        <div className={styles.loading}>
          <Spinner message="Loading resources..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.gallery} data-gallery>
        <div className={styles.error}>
          <div className={styles.errorTitle}>Error loading data</div>
          <div className={styles.errorMessage}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.gallery} data-gallery>
      {/* Top Pane - Filters (hidden in lock mode) */}
      {!isLocked && (
        <div className={styles.topPane}>
          <TopPane />
        </div>
      )}

      {/* Body - Card Carousel */}
      <div className={styles.body}>
        <CardCarousel />
      </div>

      {/* Bottom Pane - Navigation */}
      <div className={styles.bottomPane}>
        <Navigation />
      </div>

      {/* Modal */}
      <CardModal />
    </div>
  );
};
