// CardCarousel Component - Snap-scroll grid carousel

import { useRef, useEffect, useMemo } from 'preact/hooks';
import { useGallery } from '../../../context/GalleryContext';
import { useContainerGrid } from '../../../hooks/useContainerGrid';
import { CONFIG } from '../../../config';
import { Card } from './Card';
import { EmptyState } from './EmptyState';
import styles from './CardCarousel.module.css';

export const CardCarousel = () => {
  const { filteredItems, carousel, goToPage, openModal, setItemsPerPage } = useGallery();
  const { currentPage, totalPages, itemsPerPage } = carousel;
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrolling = useRef(false);

  // Dynamic grid dimensions from container measurement
  const { itemsPerPage: gridItemsPerPage } = useContainerGrid(
    containerRef,
    CONFIG.GRID
  );

  // Sync grid dimensions to context
  useEffect(() => {
    setItemsPerPage(gridItemsPerPage);
  }, [gridItemsPerPage, setItemsPerPage]);

  // Group filtered items into pages
  const pages = useMemo(() => {
    const result: (typeof filteredItems)[] = [];
    for (let i = 0; i < totalPages; i++) {
      const startIndex = i * itemsPerPage;
      const pageItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);
      result.push(pageItems);
    }
    return result;
  }, [filteredItems, totalPages, itemsPerPage]);

  // Sync scroll position with currentPage (only for programmatic navigation)
  useEffect(() => {
    if (isScrolling.current) {
      isScrolling.current = false;
      return;
    }
    const container = containerRef.current;
    if (!container) return;

    const pageWidth = container.offsetWidth;
    container.scrollTo({
      left: currentPage * pageWidth,
      behavior: 'smooth',
    });
  }, [currentPage]);

  // Handle scroll snap to update currentPage
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const pageWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;
        const newPage = Math.round(scrollLeft / pageWidth);
        if (newPage !== currentPage && newPage >= 0 && newPage < totalPages) {
          isScrolling.current = true;
          goToPage(newPage);
        }
      }, 100);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [currentPage, totalPages, goToPage]);

  // Show empty state if no items
  if (filteredItems.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={styles.carousel} ref={containerRef}>
      <div className={styles.carouselInner}>
        {pages.map((pageItems, pageIndex) => (
          <div key={pageIndex} className={styles.page}>
            <div className={styles.grid}>
              {pageItems.map((item, itemIndex) => (
                <Card
                  key={`${pageIndex}-${itemIndex}-${item.title}`}
                  item={item}
                  onClick={() => openModal(item)}
                />
              ))}
              {/* Fill empty cells for consistent grid layout */}
              {Array.from({ length: itemsPerPage - pageItems.length }).map((_, i) => (
                <div key={`empty-${i}`} className={styles.emptyCell} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
