// TopPane Component - Filter container

import { useState, useMemo } from 'preact/hooks';
import { useGallery } from '../../../context/GalleryContext';
import { DOMAIN_VALUES } from '../../../config';
import { SearchInput } from './SearchInput';
import { CategorySelect } from './CategorySelect';
import { CsvMultiSelect } from './CsvMultiSelect';
import { FilterToggle } from './FilterToggle';
import styles from './TopPane.module.css';

export const TopPane = () => {
  const {
    filters,
    filterOptions,
    setDomain,
    setSource,
    setAsset,
    setReadWatchTime,
    setFeatures,
  } = useGallery();

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Count active filters (excluding search)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.domain) count++;
    if (filters.source) count++;
    if (filters.asset) count++;
    if (filters.readWatchTime) count++;
    count += filters.features.length;
    return count;
  }, [filters]);

  // Domain options (hardcoded per blueprint)
  const domainOptions = DOMAIN_VALUES.filter((d) => d !== 'All');

  return (
    <div className={styles.topPane}>
      <div className={styles.filterControls}>

        {/* Mobile toggle button */}
        <FilterToggle
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
          activeFilterCount={activeFilterCount}
        />

        {/* Filter panel (collapsible on mobile) */}
        <div
          id="filter-panel"
          className={`${styles.filterPanel} ${isFilterOpen ? styles.filterPanelOpen : ''}`}
        >

          <div className={styles.filterRow}>
            <SearchInput />

            <CategorySelect
              label="Domain"
              value={filters.domain}
              options={domainOptions}
              onChange={setDomain}
              placeholder="All Domains"
            />

            <CategorySelect
              label="Source"
              value={filters.source}
              options={filterOptions.sources}
              onChange={setSource}
              placeholder="All Sources"
            />

            <CategorySelect
              label="Asset"
              value={filters.asset}
              options={filterOptions.assets}
              onChange={setAsset}
              placeholder="All Assets"
            />

            <CategorySelect
              label="Duration"
              value={filters.readWatchTime}
              options={filterOptions.readWatchTimes}
              onChange={setReadWatchTime}
              placeholder="Any Duration"
            />

            {filterOptions.features.length > 0 && (
              <CsvMultiSelect
                label="Features"
                value={filters.features}
                options={filterOptions.features}
                onChange={setFeatures}
                placeholder="Features"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
