// useContainerGrid - Measures container and computes dynamic grid dimensions

import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import type { RefObject } from 'preact';

export interface GridConfig {
  MIN_CARD_WIDTH: number;
  MIN_CARD_HEIGHT: number;
  MAX_COLUMNS: number;
  MAX_ROWS: number;
  MIN_COLUMNS: number;
  MIN_ROWS: number;
  GAP: number;
  GAP_LARGE: number;
  CONTAINER_GAP_BREAKPOINT: number;
}

export interface GridDimensions {
  columns: number;
  rows: number;
  itemsPerPage: number;
}

function calculateGrid(
  containerWidth: number,
  containerHeight: number,
  config: GridConfig
): { dimensions: GridDimensions; gap: number } {
  const gap = containerWidth >= config.CONTAINER_GAP_BREAKPOINT
    ? config.GAP_LARGE
    : config.GAP;

  // Account for page padding (spacing-md + 1rem ≈ 20px each side)
  const padding = 20;
  const availableWidth = containerWidth - 2 * padding;
  const availableHeight = containerHeight - 2 * padding;

  // Calculate how many columns fit:
  // N columns need N * minCardWidth + (N-1) * gap <= availableWidth
  // Solving: N <= (availableWidth + gap) / (minCardWidth + gap)
  let columns = Math.floor(
    (availableWidth + gap) / (config.MIN_CARD_WIDTH + gap)
  );
  columns = Math.max(config.MIN_COLUMNS, Math.min(columns, config.MAX_COLUMNS));

  // Same for rows
  let rows = Math.floor(
    (availableHeight + gap) / (config.MIN_CARD_HEIGHT + gap)
  );
  rows = Math.max(config.MIN_ROWS, Math.min(rows, config.MAX_ROWS));

  return {
    dimensions: { columns, rows, itemsPerPage: columns * rows },
    gap,
  };
}

export function useContainerGrid(
  containerRef: RefObject<HTMLElement>,
  config: GridConfig
): GridDimensions {
  const [dimensions, setDimensions] = useState<GridDimensions>({
    columns: 2,
    rows: 3,
    itemsPerPage: 6,
  });

  const configRef = useRef(config);
  configRef.current = config;

  const updateGrid = useCallback((width: number, height: number) => {
    if (width === 0 || height === 0) return;

    const { dimensions: newDims, gap } = calculateGrid(width, height, configRef.current);

    setDimensions(prev => {
      if (prev.columns === newDims.columns && prev.rows === newDims.rows) {
        return prev; // avoid unnecessary re-renders
      }
      return newDims;
    });

    // Set CSS custom properties on the container for the grid to consume
    const el = containerRef.current;
    if (el) {
      el.style.setProperty('--grid-cols', String(newDims.columns));
      el.style.setProperty('--grid-rows', String(newDims.rows));
      el.style.setProperty('--grid-gap', `${gap}px`);
    }
  }, [containerRef]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      requestAnimationFrame(() => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          updateGrid(width, height);
        }
      });
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [containerRef, updateGrid]);

  return dimensions;
}
