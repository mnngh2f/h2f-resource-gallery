// H2F Resource Gallery Configuration

export const CONFIG = {
  // Google Sheets Data Source
  SHEET_ID: '14Otgm3SIWXbwSB0KpgPLtO-L8hJ6BcyjcZyZBB9K-Fk',
  TAB_NAME: 'Gallery',

  // Dynamic grid configuration (container-responsive)
  GRID: {
    MIN_CARD_WIDTH: 140,   // px - minimum card width before reducing columns
    MIN_CARD_HEIGHT: 120,  // px - minimum card height before reducing rows
    MAX_COLUMNS: 6,
    MAX_ROWS: 5,
    MIN_COLUMNS: 1,
    MIN_ROWS: 1,
    GAP: 8,                // base gap in px
    GAP_LARGE: 16,         // gap when container >= 600px wide
    CONTAINER_GAP_BREAKPOINT: 600,
  },

  // Search debounce
  SEARCH_DEBOUNCE_MS: 300,
} as const;

// Google Sheets Visualization API URL
export const getSheetUrl = (): string => {
  return `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(CONFIG.TAB_NAME)}`;
};

// Static domain values (hardcoded order per blueprint)
export const DOMAIN_VALUES = [
  'All',
  'Mental',
  'Nutritional',
  'Physical',
  'Sleep',
  'Spiritual',
] as const;

export type DomainValue = typeof DOMAIN_VALUES[number];
