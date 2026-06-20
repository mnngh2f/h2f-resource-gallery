// CardModal Component - Detail modal with animations

import { useEffect, useState, useCallback } from 'preact/hooks';
import { useGallery } from '../../../context/GalleryContext';
import { getDomainColors } from '../../../utils/domainColors';
import styles from './CardModal.module.css';

export const CardModal = () => {
  const { modal, closeModal } = useGallery();
  const { isOpen, selectedItem } = modal;
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Wait for animation to complete
    setTimeout(() => {
      setIsClosing(false);
      closeModal();
    }, 250); // Match transition duration
  }, [closeModal]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !selectedItem) {
    return null;
  }

  const colors = getDomainColors(selectedItem.domain);

  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleOpenLink = () => {
    if (selectedItem.link) {
      window.open(selectedItem.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`${styles.modal} ${isClosing ? styles.modalClosing : ''}`}>
        {/* Header */}
        <div className={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
          {/* Domain Badge */}
          <span
            className={styles.domainBanner}
            style={{ backgroundColor: colors.primary }}
          >
            {selectedItem.domain}
          </span>
          </div>
          {selectedItem.link && (
            <button className={styles.linkButton} onClick={handleOpenLink}>
              Open Resource →
            </button>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          

          {/* Title */}
          <h2 id="modal-title" className={styles.title} style={{ color: colors.secondary }}>
            {selectedItem.title}
          </h2>

          {/* Meta Info */}
          <div className={styles.meta}>
            {selectedItem.source && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Source</span>
                <span className={styles.metaValue}>{selectedItem.source}</span>
              </div>
            )}
            {selectedItem.asset && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Type</span>
                <span className={styles.metaValue}>{selectedItem.asset}</span>
              </div>
            )}
            {selectedItem.readWatchTime && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Duration</span>
                <span className={styles.metaValue}>{selectedItem.readWatchTime}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {selectedItem.description && (
            <p className={styles.description}>{selectedItem.description}</p>
          )}

          {/* Features */}
          {selectedItem.features.length > 0 && (
            <div className={styles.features}>
              {selectedItem.features.map((feature) => (
                <span key={feature} className={styles.featureTag}>
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
