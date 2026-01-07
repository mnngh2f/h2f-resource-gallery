// FilterToggle Component - Mobile collapse button

import styles from './TopPane.module.css';

interface FilterToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  activeFilterCount: number;
}

export const FilterToggle = ({ isOpen, onToggle, activeFilterCount }: FilterToggleProps) => {
  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="filter-panel"
    >
      <span>
        Filters
        {activeFilterCount > 0 && ` (${activeFilterCount})`}
      </span>
      <span className={`${styles.toggleIcon} ${isOpen ? styles.toggleIconOpen : ''}`}>
        ▼
      </span>
    </button>
  );
};
