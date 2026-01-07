// Google Sheets data fetching and parsing service

import { getSheetUrl } from '../config';
import type { ColumnDef, MetaType, ResourceItem, SheetData } from '../types/gallery.types';

// Parse the Google Visualization API response
// Response format: google.visualization.Query.setResponse({...json...})
const parseGvizResponse = (text: string): unknown => {
  // Remove the callback wrapper
  const jsonStart = text.indexOf('{');
  const jsonEnd = text.lastIndexOf('}');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('Invalid response format');
  }
  const jsonString = text.substring(jsonStart, jsonEnd + 1);
  return JSON.parse(jsonString);
};

// Extract cell value from Google Sheets response
const getCellValue = (cell: { v?: unknown; f?: string } | null | undefined): string => {
  if (!cell) return '';
  // Prefer formatted value (f) for display, fallback to raw value (v)
  if (cell.f !== undefined) return String(cell.f);
  if (cell.v !== undefined) return String(cell.v);
  return '';
};

// Parse meta type from Row 1
const parseMetaType = (value: string): MetaType => {
  const normalized = value.toLowerCase().trim();
  if (normalized === 'search') return 'search';
  if (normalized === 'category') return 'category';
  if (normalized === 'csv') return 'csv';
  if (normalized === 'hyperlink') return 'hyperlink';
  return '';
};

// Parse CSV string into array of trimmed values
const parseCsvValue = (value: string): string[] => {
  if (!value) return [];
  return value.split(',').map((v) => v.trim()).filter(Boolean);
};

// Fetch and parse sheet data
export const fetchSheetData = async (): Promise<SheetData> => {
  const url = getSheetUrl();
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch sheet data: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  const data = parseGvizResponse(text) as {
    table?: {
      cols?: Array<{ label?: string }>;
      rows?: Array<{ c?: Array<{ v?: unknown; f?: string } | null> }>;
    };
  };

  const table = data.table;
  if (!table || !table.rows || table.rows.length < 2) {
    throw new Error('Invalid sheet structure: expected at least 2 rows (meta + headers)');
  }

  const rows = table.rows;

  // Row 1: Meta types
  const metaRow = rows[0]?.c || [];
  // Row 2: Headers
  const headerRow = rows[1]?.c || [];

  // Build column definitions
  const columns: ColumnDef[] = [];
  const maxCols = Math.max(metaRow.length, headerRow.length);

  for (let i = 0; i < maxCols; i++) {
    columns.push({
      index: i,
      header: getCellValue(headerRow[i]),
      metaType: parseMetaType(getCellValue(metaRow[i])),
    });
  }

  // Row 3+: Data
  const items: ResourceItem[] = [];

  for (let rowIndex = 2; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]?.c || [];

    // Map columns by index (based on blueprint schema)
    // A=0: Title, B=1: Domain, C=2: Source, D=3: Asset, E=4: Link, F=5: Description, G=6: RWT, H=7: Features
    const title = getCellValue(row[0]);
    const domain = getCellValue(row[1]);
    const source = getCellValue(row[2]);
    const asset = getCellValue(row[3]);
    const link = getCellValue(row[4]);
    const description = getCellValue(row[5]);
    const readWatchTime = getCellValue(row[6]);
    const featuresRaw = getCellValue(row[7]);

    // Skip rows without a title
    if (!title) continue;

    items.push({
      title,
      domain,
      source,
      asset,
      link,
      description,
      readWatchTime,
      features: parseCsvValue(featuresRaw),
    });
  }

  return { columns, items };
};

// Extract unique filter options from items
export const extractFilterOptions = (items: ResourceItem[]) => {
  const sources = new Set<string>();
  const assets = new Set<string>();
  const readWatchTimes = new Set<string>();
  const features = new Set<string>();

  for (const item of items) {
    if (item.source) sources.add(item.source);
    if (item.asset) assets.add(item.asset);
    if (item.readWatchTime) readWatchTimes.add(item.readWatchTime);
    for (const feature of item.features) {
      features.add(feature);
    }
  }

  return {
    sources: Array.from(sources).sort(),
    assets: Array.from(assets).sort(),
    readWatchTimes: Array.from(readWatchTimes).sort(),
    features: Array.from(features).sort(),
  };
};
