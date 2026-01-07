// Card Component - Individual resource card

import type { ResourceItem } from '../../../types/gallery.types';
import { getDomainColors } from '../../../utils/domainColors';
import styles from './Card.module.css';

interface CardProps {
  item: ResourceItem;
  onClick: () => void;
}

export const Card = ({ item, onClick }: CardProps) => {
  const colors = getDomainColors(item.domain);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className={styles.card}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${item.title}`}
    >
      {/* Domain Banner */}
      <div
        className={styles.banner}
        style={{ backgroundColor: colors.primary }}
      >
        {item.domain}
        <div
          className={styles.bannerTriangle}
          style={{ borderRightColor: colors.secondary }}
        />
      </div>

      {/* Read Watch Time Badge */}
      {item.readWatchTime && (
        <div className={styles.badge}>
          <span className={styles.badgeIcon}>⏱</span>
          {item.readWatchTime}
        </div>
      )}

      {/* Card Content */}
      <div className={styles.content}>
        {/* Meta Info */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>{item.asset}</span>
          <span className={styles.metaItem}>{item.source}</span>
        </div>

        {/* Title */}
        <h3 className={styles.title}>{item.title}</h3>
      </div>

      {/* Hover Overlay (Desktop only via CSS) */}
      <div className={styles.overlay}>
        <div className={styles.overlayTitle}>{item.title}</div>
        {item.description && (
          <p className={styles.overlayDescription}>{item.description}</p>
        )}
      </div>
    </article>
  );
};
