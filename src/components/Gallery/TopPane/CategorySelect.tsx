// CategorySelect Component - Single-select dropdown

import styles from './CategorySelect.module.css';

interface CategorySelectProps {
  label: string;
  value: string | null;
  options: string[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  includeAll?: boolean;
}

export const CategorySelect = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'All',
  includeAll = true,
}: CategorySelectProps) => {
  const handleChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const newValue = target.value;
    onChange(newValue === '' || newValue === 'All' ? null : newValue);
  };

  const isActive = value !== null && value !== 'All';

  return (
    <div className={styles.selectContainer}>
      <label className={styles.label}>{label}</label>
      <select
        className={`${styles.select} ${isActive ? styles.selectActive : ''}`}
        value={value || ''}
        onChange={handleChange}
        aria-label={label}
      >
        {includeAll && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className={styles.selectIcon}>▼</span>
    </div>
  );
};
