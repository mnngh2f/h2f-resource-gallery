// CsvMultiSelect Component - Multi-select with tags

import { useState, useRef, useEffect } from 'preact/hooks';
import styles from './CsvMultiSelect.module.css';

interface CsvMultiSelectProps {
  label: string;
  value: string[];
  options: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export const CsvMultiSelect = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Select...',
}: CsvMultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      onChange([...value, option]);
    }
  };

  const removeTag = (option: string, e: Event) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== option));
  };

  const hasSelection = value.length > 0;

  return (
    <div className={styles.container} ref={containerRef}>
      <span className={styles.label}>{label}</span>

      <div className={styles.dropdownWrapper}>
        <button
          type="button"
          className={`${styles.dropdownTrigger} ${hasSelection ? styles.dropdownTriggerActive : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{hasSelection ? `${value.length} selected` : placeholder}</span>
          <span className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ''}`}>
            ▼
          </span>
        </button>

        <div
          className={`${styles.dropdownMenu} ${!isOpen ? styles.dropdownHidden : ''}`}
          role="listbox"
          aria-multiselectable="true"
        >
          {options.map((option) => {
            const isSelected = value.includes(option);
            return (
              <div
                key={option}
                className={styles.option}
                onClick={() => toggleOption(option)}
                role="option"
                aria-selected={isSelected}
              >
                <div className={`${styles.checkbox} ${isSelected ? styles.checkboxChecked : ''}`}>
                  {isSelected && <span className={styles.checkmark}>✓</span>}
                </div>
                <span className={styles.optionLabel}>{option}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected tags */}
      {hasSelection && (
        <div className={styles.selectedTags}>
          {value.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
              <button
                type="button"
                className={styles.tagRemove}
                onClick={(e) => removeTag(tag, e)}
                aria-label={`Remove ${tag}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
