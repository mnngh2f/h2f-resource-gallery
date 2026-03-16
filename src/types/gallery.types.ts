// H2F Resource Gallery Type Definitions

// Meta types for columns (from Row 1 of sheet)
export type MetaType = 'search' | 'category' | 'csv' | 'hyperlink' | '';

// Column definition (parsed from Row 1 + Row 2)
export interface ColumnDef {
  index: number;
  header: string;
  metaType: MetaType;
}

// Single resource item (parsed from Row 3+)
export interface ResourceItem {
  title: string;
  domain: string;
  source: string;
  asset: string;
  link: string;
  description: string;
  readWatchTime: string;
  features: string[]; // Parsed from CSV
}

// Domain color configuration
export interface DomainColors {
  primary: string;
  secondary: string;
}

// Filter state
export interface FilterState {
  search: string;
  domain: string | null;
  source: string | null;
  asset: string | null;
  readWatchTime: string | null;
  features: string[];
}

// URL parameters from embed
export interface EmbedParams extends FilterState {
  locked: boolean;
}

// Carousel state
export interface CarouselState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

// Modal state
export interface ModalState {
  isOpen: boolean;
  selectedItem: ResourceItem | null;
}

// Parsed sheet data
export interface SheetData {
  columns: ColumnDef[];
  items: ResourceItem[];
}

// Filter options (unique values from data)
export interface FilterOptions {
  sources: string[];
  assets: string[];
  readWatchTimes: string[];
  features: string[];
}

// Gallery context value
export interface GalleryContextValue {
  // Data
  items: ResourceItem[];
  filteredItems: ResourceItem[]; // All filtered items (for carousel)
  pageItems: ResourceItem[]; // Current page items
  filterOptions: FilterOptions;
  isLoading: boolean;
  error: string | null;

  // Filters
  filters: FilterState;
  setSearch: (search: string) => void;
  setDomain: (domain: string | null) => void;
  setSource: (source: string | null) => void;
  setAsset: (asset: string | null) => void;
  setReadWatchTime: (rwt: string | null) => void;
  setFeatures: (features: string[]) => void;
  clearFilters: () => void;

  // Carousel
  carousel: CarouselState;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setItemsPerPage: (n: number) => void;

  // Modal
  modal: ModalState;
  openModal: (item: ResourceItem) => void;
  closeModal: () => void;

  // Embed
  isLocked: boolean;
}
