// Gallery Context - Central state management

import { createContext } from 'preact';
import { useContext, useState, useEffect, useRef, useMemo, useCallback } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { fetchSheetData, extractFilterOptions } from '../services/sheets';
import { filterItems, calculatePagination, getPageItems } from '../utils/filterUtils';
import { parseUrlParams, getDefaultFilterState } from '../utils/urlParams';
import type {
  ResourceItem,
  FilterState,
  FilterOptions,
  ModalState,
  GalleryContextValue,
} from '../types/gallery.types';

// Default context value (will be overridden by provider)
const defaultContextValue: GalleryContextValue = {
  items: [],
  filteredItems: [],
  pageItems: [],
  filterOptions: { sources: [], assets: [], readWatchTimes: [], features: [] },
  isLoading: true,
  error: null,
  filters: getDefaultFilterState(),
  setSearch: () => {},
  setDomain: () => {},
  setSource: () => {},
  setAsset: () => {},
  setReadWatchTime: () => {},
  setFeatures: () => {},
  clearFilters: () => {},
  carousel: { currentPage: 0, totalPages: 1, itemsPerPage: 6 },
  goToPage: () => {},
  nextPage: () => {},
  prevPage: () => {},
  setItemsPerPage: () => {},
  modal: { isOpen: false, selectedItem: null },
  openModal: () => {},
  closeModal: () => {},
  isLocked: false,
};

const GalleryContext = createContext<GalleryContextValue>(defaultContextValue);

// Hook to use gallery context
export const useGallery = (): GalleryContextValue => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

interface GalleryProviderProps {
  children: ComponentChildren;
}

export const GalleryProvider = ({ children }: GalleryProviderProps) => {
  // Parse URL params once on mount
  const [embedParams] = useState(() => parseUrlParams());
  const isLocked = embedParams.locked;

  // Data state
  const [items, setItems] = useState<ResourceItem[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    sources: [],
    assets: [],
    readWatchTimes: [],
    features: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state (initialized from URL params)
  const [filters, setFilters] = useState<FilterState>({
    search: embedParams.search,
    domain: embedParams.domain,
    source: embedParams.source,
    asset: embedParams.asset,
    readWatchTime: embedParams.readWatchTime,
    features: embedParams.features,
  });

  // Carousel state (itemsPerPage is set by CardCarousel via useContainerGrid)
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modal state
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    selectedItem: null,
  });

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchSheetData();
        setItems(data.items);
        setFilterOptions(extractFilterOptions(data.items));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter items (memoized)
  const filteredItems = useMemo(() => {
    return filterItems(items, filters);
  }, [items, filters]);

  // Calculate pagination
  const { totalPages } = useMemo(() => {
    return calculatePagination(filteredItems.length, itemsPerPage);
  }, [filteredItems.length, itemsPerPage]);

  // Reset to page 0 when filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [filters]);

  // Preserve approximate scroll position when itemsPerPage changes (e.g. container resize)
  const prevItemsPerPage = useRef(itemsPerPage);
  useEffect(() => {
    if (prevItemsPerPage.current !== itemsPerPage) {
      const firstVisibleIndex = currentPage * prevItemsPerPage.current;
      const newPage = Math.floor(firstVisibleIndex / itemsPerPage);
      const maxPage = Math.max(0, Math.ceil(filteredItems.length / itemsPerPage) - 1);
      setCurrentPage(Math.max(0, Math.min(newPage, maxPage)));
      prevItemsPerPage.current = itemsPerPage;
    } else if (currentPage >= totalPages) {
      setCurrentPage(Math.max(0, totalPages - 1));
    }
  }, [currentPage, totalPages, itemsPerPage, filteredItems.length]);

  // Get items for current page
  const pageItems = useMemo(() => {
    return getPageItems(filteredItems, currentPage, itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Filter setters
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setDomain = useCallback((domain: string | null) => {
    setFilters((prev) => ({ ...prev, domain }));
  }, []);

  const setSource = useCallback((source: string | null) => {
    setFilters((prev) => ({ ...prev, source }));
  }, []);

  const setAsset = useCallback((asset: string | null) => {
    setFilters((prev) => ({ ...prev, asset }));
  }, []);

  const setReadWatchTime = useCallback((readWatchTime: string | null) => {
    setFilters((prev) => ({ ...prev, readWatchTime }));
  }, []);

  const setFeatures = useCallback((features: string[]) => {
    setFilters((prev) => ({ ...prev, features }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(getDefaultFilterState());
  }, []);

  // Carousel navigation
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  }, []);

  // Modal controls
  const openModal = useCallback((item: ResourceItem) => {
    setModal({ isOpen: true, selectedItem: item });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, selectedItem: null });
  }, []);

  // Context value
  const value: GalleryContextValue = {
    items,
    filteredItems,
    pageItems,
    filterOptions,
    isLoading,
    error,
    filters,
    setSearch,
    setDomain,
    setSource,
    setAsset,
    setReadWatchTime,
    setFeatures,
    clearFilters,
    carousel: {
      currentPage,
      totalPages,
      itemsPerPage,
    },
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
    modal,
    openModal,
    closeModal,
    isLocked,
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};
