// H2F Resource Gallery Configuration

export const CONFIG = {
  // Google Sheets Data Source
  SHEET_ID: '14Otgm3SIWXbwSB0KpgPLtO-L8hJ6BcyjcZyZBB9K-Fk',
  TAB_NAME: 'Gallery',

  // Dynamic grid configuration (container-responsive)
  GRID: {
    // Card dimensions scale with container: clamp(min, containerSize * scale, max)
    CARD_WIDTH: { scale: 0.15, min: 60, max: 140 },
    CARD_HEIGHT: { scale: 0.12, min: 50, max: 120 },
    MAX_COLUMNS: 6,
    MAX_ROWS: 5,
    MIN_COLUMNS: 2,
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
