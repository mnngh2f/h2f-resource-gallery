// Navigation Component - Dots and arrow buttons for carousel

import { useGallery } from '../../../context/GalleryContext';
import styles from './Navigation.module.css';

export const Navigation = () => {
  const { carousel, goToPage, nextPage, prevPage } = useGallery();
  const { currentPage, totalPages } = carousel;

  // Don't show navigation if only one page
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className={styles.navigation} aria-label="Gallery pagination">
      {/* Previous Arrow */}
      <button
        className={styles.arrowButton}
        onClick={prevPage}
        disabled={currentPage === 0}
        aria-label="Previous page"
      >
        ←
      </button>

      {/* Dots */}
      <div className={styles.dots} role="tablist" aria-label="Page indicators">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentPage ? styles.dotActive : ''}`}
            onClick={() => goToPage(index)}
            role="tab"
            aria-selected={index === currentPage}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>

      {/* Next Arrow */}
      <button
        className={styles.arrowButton}
        onClick={nextPage}
        disabled={currentPage === totalPages - 1}
        aria-label="Next page"
      >
        →
      </button>
    </nav>
  );
};
