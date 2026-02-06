// Badge Component - Reusable badge for displaying labels and tags

import type { ComponentChild } from 'preact';
import styles from './Badge.module.css';

interface BadgeProps {
  text: string;
  icon?: ComponentChild;
  className?: string;
}

export const Badge = ({ text, icon, className }: BadgeProps) => {
  const badgeClasses = [styles.badge, className].filter(Boolean).join(' ');

  return (
    <div className={badgeClasses}>
      {icon && <span className={styles.icon}>{icon}</span>}
      {text}
    </div>
  );
};
