// SearchInput Component - Global search with debounce

import { useState, useEffect, useRef } from 'preact/hooks';
import { useGallery } from '../../../context/GalleryContext';
import { CONFIG } from '../../../config';
import styles from './SearchInput.module.css';

export const SearchInput = () => {
  const { filters, setSearch } = useGallery();
  const [localValue, setLocalValue] = useState(filters.search);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Sync local value with context (for external changes)
  useEffect(() => {
    setLocalValue(filters.search);
  }, [filters.search]);

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
    setLocalValue(value);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setSearch(value);
    }, CONFIG.SEARCH_DEBOUNCE_MS);
  };

  const handleClear = () => {
    setLocalValue('');
    setSearch('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.searchContainer}>
      <span className={styles.searchIcon}>🔍</span>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search resources..."
        value={localValue}
        onInput={handleChange}
        aria-label="Search resources"
      />
      <button
        className={`${styles.clearButton} ${!localValue ? styles.clearButtonHidden : ''}`}
        onClick={handleClear}
        aria-label="Clear search"
        type="button"
      >
        ×
      </button>
    </div>
  );
};
