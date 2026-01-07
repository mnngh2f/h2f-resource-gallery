// Domain color mapping per blueprint

import type { DomainColors } from '../types/gallery.types';

export const DOMAIN_COLORS: Record<string, DomainColors> = {
  All: {
    primary: '#F4AC32',
    secondary: '#F5B447',
  },
  Mental: {
    primary: '#00CFCF',
    secondary: '#00D8D8',
  },
  Nutritional: {
    primary: '#6AA84F',
    secondary: '#93C47D',
  },
  Physical: {
    primary: '#FF2153',
    secondary: '#FF597E',
  },
  Sleep: {
    primary: '#0DA0FF',
    secondary: '#26AAFF',
  },
  Spiritual: {
    primary: '#674EA7',
    secondary: '#8E7CC3',
  },
};

// Get colors for a domain, fallback to 'All' if not found
export const getDomainColors = (domain: string): DomainColors => {
  return DOMAIN_COLORS[domain] || DOMAIN_COLORS.All;
};
