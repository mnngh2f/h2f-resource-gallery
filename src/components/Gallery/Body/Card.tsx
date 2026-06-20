// Card Component - Individual resource card

import type { ResourceItem } from '../../../types/gallery.types';
import { getDomainColors } from '../../../utils/domainColors';
import { Badge } from '../../common/Badge';
import h2fIcon from '../../../assets/h2f-icon.svg';
import outsourceIcon from '../../../assets/outsourcing-icon.svg';
import allIcon from '../../../assets/all.svg';
import mentalIcon from '../../../assets/mental.svg';
import nutritionIcon from '../../../assets/nutrition.svg';
import physicalIcon from '../../../assets/physical.svg';
import sleepIcon from '../../../assets/sleep.svg';
import spiritualIcon from '../../../assets/spiritual.svg';
import styles from './Card.module.css';

const sourceIcons: Record<string, string> = {
  'H2F': h2fIcon,
  'Outsource': outsourceIcon,
};

const domainIcons: Record<string, string> = {
  'All': allIcon,
  'Mental': mentalIcon,
  'Nutritional': nutritionIcon,
  'Physical': physicalIcon,
  'Sleep': sleepIcon,
  'Spiritual': spiritualIcon,
};

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
        {domainIcons[item.domain] && (
          <img src={domainIcons[item.domain]} alt="" className={styles.bannerIcon} />
        )}
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
          <Badge text={item.source} icon={sourceIcons[item.source] && <img src={sourceIcons[item.source]} alt="" />} />
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
        {item.description && (
          <p className={styles.overlayDescription}>{item.description}</p>
        )}
      </div>
    </article>
  );
};
