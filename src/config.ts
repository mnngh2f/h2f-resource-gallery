// H2F Resource Gallery Configuration

export const CONFIG = {
  // Google Sheets Data Source
  SHEET_ID: '14Otgm3SIWXbwSB0KpgPLtO-L8hJ6BcyjcZyZBB9K-Fk',
  TAB_NAME: 'Gallery',

  // Responsive breakpoint
  BREAKPOINT_DESKTOP: 768,

  // Grid layout
  MOBILE_COLUMNS: 2,
  MOBILE_ROWS: 3,
  DESKTOP_COLUMNS: 4,
  DESKTOP_ROWS: 4,

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
