// EmptyState Component - No results message

import { useGallery } from '../../../context/GalleryContext';
import styles from './EmptyState.module.css';

export const EmptyState = () => {
  const { clearFilters, isLocked } = useGallery();

  return (
    <div className={styles.emptyState}>
      <div className={styles.icon}>🔍</div>
      <h3 className={styles.title}>No resources found</h3>
      <p className={styles.message}>
        Try adjusting your search or filters to find what you're looking for.
      </p>
      {!isLocked && (
        <button className={styles.clearButton} onClick={clearFilters}>
          Clear all filters
        </button>
      )}
    </div>
  );
};
