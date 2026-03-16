// useContainerGrid - Measures container and computes dynamic grid dimensions

import { useState, useEffect, useCallback, useRef } from 'preact/hooks';
import type { RefObject } from 'preact';

export interface ScaledDimension {
  scale: number;  // fraction of container size (e.g. 0.15 = 15%)
  min: number;    // px floor
  max: number;    // px ceiling
}

export interface GridConfig {
  CARD_WIDTH: ScaledDimension;
  CARD_HEIGHT: ScaledDimension;
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

/** JS equivalent of CSS clamp(min, value, max) */
function clamp(min: number, value: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

function calculateGrid(
  containerWidth: number,
  containerHeight: number,
  config: GridConfig
): { dimensions: GridDimensions; gap: number } {
  const gap = containerWidth >= config.CONTAINER_GAP_BREAKPOINT
    ? config.GAP_LARGE
    : config.GAP;

  // Dynamic padding — scales with container, matches CSS clamp(4px, 2cqi, 20px)
  const padding = clamp(4, containerWidth * 0.02, 20);
  const availableWidth = containerWidth - 2 * padding;
  const availableHeight = containerHeight - 2 * padding;

  // Min card dimensions scale with container size
  const minCardWidth = clamp(
    config.CARD_WIDTH.min,
    containerWidth * config.CARD_WIDTH.scale,
    config.CARD_WIDTH.max
  );
  const minCardHeight = clamp(
    config.CARD_HEIGHT.min,
    containerHeight * config.CARD_HEIGHT.scale,
    config.CARD_HEIGHT.max
  );

  // Calculate how many columns fit:
  // N columns need N * minCardWidth + (N-1) * gap <= availableWidth
  // Solving: N <= (availableWidth + gap) / (minCardWidth + gap)
  let columns = Math.floor(
    (availableWidth + gap) / (minCardWidth + gap)
  );
  columns = clamp(config.MIN_COLUMNS, columns, config.MAX_COLUMNS);

  // Same for rows
  let rows = Math.floor(
    (availableHeight + gap) / (minCardHeight + gap)
  );
  rows = clamp(config.MIN_ROWS, rows, config.MAX_ROWS);

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
