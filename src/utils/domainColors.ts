// Domain color mapping per blueprint

import type { DomainColors } from '../types/gallery.types';

export const DOMAIN_COLORS: Record<string, DomainColors> = {
  All: {
    primary: 'gold',
    secondary: 'orange',
  },
  Mental: {
    primary: 'slategray',
    secondary: 'darkslategray',
  },
  Nutritional: {
    primary: 'limegreen',
    secondary: 'green',
  },
  Physical: {
    primary: 'red',
    secondary: 'firebrick',
  },
  Sleep: {
    primary: 'deepskyblue',
    secondary: 'dodgerblue',
  },
  Spiritual: {
    primary: 'slateblue',
    secondary: 'indigo',
  },
};

// Get colors for a domain, fallback to 'All' if not found
export const getDomainColors = (domain: string): DomainColors => {
  return DOMAIN_COLORS[domain] || DOMAIN_COLORS.All;
};
