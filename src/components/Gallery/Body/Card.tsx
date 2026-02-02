// Card Component - Individual resource card

import type { ResourceItem } from '../../../types/gallery.types';
import { getDomainColors } from '../../../utils/domainColors';
import { Badge } from '../../common/Badge';
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
        <span className={styles.bannerText}>{item.domain}</span>
        <div
          className={styles.bannerTriangle}
          style={{ borderleftColor: colors.secondary, borderTopColor: colors.secondary}}
        />
      </div>

      {/* Card Content */}
      <div className={styles.content}>
        {/* Meta Info */}
        <div className={styles.meta}>
          <Badge text={item.asset} />
          <Badge text={item.source} />
        </div>

        {/* Title */}
        <h3 className={styles.title}>{item.title}</h3>

        {/* Read Watch Time Badge */}
        {item.readWatchTime && (
          <Badge icon="⏱" text={item.readWatchTime} className={styles.timeBadge} />
        )}
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
