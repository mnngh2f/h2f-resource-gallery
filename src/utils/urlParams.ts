// URL parameter parsing for embed functionality

import type { EmbedParams, FilterState } from '../types/gallery.types';

const DEFAULT_FILTER_STATE: FilterState = {
  search: '',
  domain: null,
  source: null,
  asset: null,
  readWatchTime: null,
  features: [],
};

// Parse URL parameters into embed params
export const parseUrlParams = (): EmbedParams => {
  const params = new URLSearchParams(window.location.search);

  const filters: FilterState = {
    search: params.get('search') || '',
    domain: params.get('domain'),
    source: params.get('source'),
    asset: params.get('asset'),
    readWatchTime: params.get('rwt'),
    features: params.getAll('features'),
  };

  // Check if any filter param is set (auto-lock mode)
  const hasFilterParams =
    filters.search !== '' ||
    filters.domain !== null ||
    filters.source !== null ||
    filters.asset !== null ||
    filters.readWatchTime !== null ||
    filters.features.length > 0;

  // Auto-lock if any filter params are present
  // Also check for explicit lock param (for backwards compatibility)
  const locked = hasFilterParams || params.get('lock') === 'true';

  return {
    ...filters,
    locked,
  };
};

// Get default filter state
export const getDefaultFilterState = (): FilterState => {
  return { ...DEFAULT_FILTER_STATE };
};
