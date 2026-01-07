// Filter logic utilities

import type { FilterState, ResourceItem } from '../types/gallery.types';

// Check if item matches search query (searches title and description)
const matchesSearch = (item: ResourceItem, search: string): boolean => {
  if (!search) return true;
  const query = search.toLowerCase();
  return (
    item.title.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query)
  );
};

// Check if item matches category filter
const matchesCategory = (value: string, filter: string | null): boolean => {
  if (!filter || filter === 'All') return true;
  return value === filter;
};

// Check if item matches features filter (OR logic - match any)
const matchesFeatures = (itemFeatures: string[], filterFeatures: string[]): boolean => {
  if (filterFeatures.length === 0) return true;
  // OR logic: item must have at least one of the selected features
  return filterFeatures.some((feature) => itemFeatures.includes(feature));
};

// Filter items based on current filter state
export const filterItems = (items: ResourceItem[], filters: FilterState): ResourceItem[] => {
  return items.filter((item) => {
    // Search filter
    if (!matchesSearch(item, filters.search)) return false;

    // Domain filter
    if (!matchesCategory(item.domain, filters.domain)) return false;

    // Source filter
    if (!matchesCategory(item.source, filters.source)) return false;

    // Asset filter
    if (!matchesCategory(item.asset, filters.asset)) return false;

    // Read Watch Time filter
    if (!matchesCategory(item.readWatchTime, filters.readWatchTime)) return false;

    // Features filter (OR logic)
    if (!matchesFeatures(item.features, filters.features)) return false;

    return true;
  });
};

// Calculate pagination
export const calculatePagination = (
  totalItems: number,
  itemsPerPage: number
): { totalPages: number } => {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  return { totalPages };
};

// Get items for current page
export const getPageItems = <T>(
  items: T[],
  currentPage: number,
  itemsPerPage: number
): T[] => {
  const startIndex = currentPage * itemsPerPage;
  return items.slice(startIndex, startIndex + itemsPerPage);
};
