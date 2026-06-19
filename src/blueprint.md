# H2F Resource Gallery — Blueprint

## Overview

A Preact + TypeScript web component that displays H2F (Holistic Health & Fitness) resources in a filterable, carousel-based card gallery. Data is sourced from Google Sheets and the component is embedded via iframe in Google Sites.

---

## Project Information

| Item | Value |
|------|-------|
| **Repository** | https://github.com/mnngh2f/h2f-resource-gallery |
| **Hosting** | GitHub Pages |
| **Framework** | Preact + TypeScript + Vite |
| **Data Source** | Google Sheets (Visualization API) |
| **Embed Method** | Iframe with URL parameters |

---

## Data Structure

### Google Sheet Schema

| Row | Purpose |
|-----|---------|
| Row 1 | Metadata (column types) |
| Row 2 | Headers (column names) |
| Row 3+ | Data |

### Column Configuration

| Column | Header | Meta Type | Filter UI | Display |
|--------|--------|-----------|-----------|---------|
| A | Title | `search` | Global search | Card title |
| B | Domain | `category` | Dropdown | Domain banner |
| C | Source | `category` | Dropdown | Card sub-info |
| D | Asset | `category` | Dropdown | Card sub-info |
| E | Link | `hyperlink` | None | Modal link button |
| F | Description | `search` | Global search | Modal content |
| G | Read Watch Time | `category` | Dropdown | Card badge |
| H | Features | `csv` | Multi-select | Filter only (not displayed) |

### Meta Type Definitions

| Meta Value | Meaning | Filter UI |
|------------|---------|-----------|
| `search` | Text searchable | Included in global search |
| `category` | Single-select | Dropdown filter |
| `csv` | Multi-value (comma-separated) | Multi-select filter |
| `hyperlink` | URL | No filter, card link |
| *(empty)* | Display only | No filter |

### Static Category Values

| Column | Values |
|--------|--------|
| **Domain** | All, Mental, Nutritional, Physical, Sleep, Spiritual |
| **Source** | Outsource, H2F |
| **Asset** | *(dynamic from data)* |
| **Read Watch Time** | *(dynamic from data)* |

---

## Domain Color Mapping

| Domain | Primary | Secondary |
|--------|---------|-----------|
| All | `#F4AC32` | `#F5B447` |
| Mental | `#00CFCF` | `#00D8D8` |
| Nutritional | `#6AA84F` | `#93C47D` |
| Physical | `#FF2153` | `#FF597E` |
| Sleep | `#0DA0FF` | `#26AAFF` |
| Spiritual | `#674EA7` | `#8E7CC3` |

---

## Layout Structure

```
┌─────────────────────────────────────────────────────┐
│                    TOP PANE                         │
│  ┌───────────────────────────────────────────────┐  │
│  │ 🔍 Search...                                  │  │
│  ├───────────────────────────────────────────────┤  │
│  │ [Domain ▼] [Source ▼] [Asset ▼] [RWT ▼]       │  │
│  │ [Features: tag, tag, tag ×]                   │  │
│  └───────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────┤
│                      BODY                           │
│  ┌───────────┬───────────┬───────────┬───────────┐  │
│  │  Card 1   │  Card 2   │  Card 3   │  Card 4   │  │
│  ├───────────┼───────────┼───────────┼───────────┤  │
│  │  Card 5   │  Card 6   │  Card 7   │  Card 8   │  │
│  ├───────────┼───────────┼───────────┼───────────┤  │
│  │  Card 9   │  Card 10  │  Card 11  │  Card 12  │  │
│  ├───────────┼───────────┼───────────┼───────────┤  │
│  │  Card 13  │  Card 14  │  Card 15  │  Card 16  │  │
│  └───────────┴───────────┴───────────┴───────────┘  │
├─────────────────────────────────────────────────────┤
│                   BOTTOM PANE                       │
│           [←]    ● ○ ○ ○ ○    [→]                   │
└─────────────────────────────────────────────────────┘
```

### Responsive Behavior

| Aspect | Mobile | Desktop |
|--------|--------|---------|
| Columns | 2 | 4 |
| Rows | 2 | 4 |
| Cards per view | 4 | 16 |
| Filter layout | Collapsible panel | Horizontal row |
| Navigation | Swipe + dots + arrows | Click + dots + arrows |

---

## Card Design

### Default State
```
┌─────────────────────────────────┐
│ ┌─────────────────────────┬───┐ │
│ │        Domain           │ ▶ │ │  ← Domain banner (primary color)
│ └─────────────────────────┴───┘ │     + triangle (secondary color)
│ ⏱ 5 min                         │  ← Read Watch Time badge
├─────────────────────────────────┤
│ VIDEO            OUTSOURCE      │  ← Asset Type | Source
│                                 │
│ Title Goes Here                 │  ← Title
│                                 │
└─────────────────────────────────┘
```

### Modal State (90% viewport)
```
┌─────────────────────────────────────────┐
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  [X]                       [→]  │   │  ← Close | Open Link
│   │                                 │   │
│   │  Title (secondary color)        │   │
│   │                                 │   │
│   │  Description text here          │   │
│   │  that can scroll if needed...   │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Interaction

| Device | Card Action | Result |
|--------|-------------|--------|
| Desktop | Hover | Show overlay (original CSS behavior) |
| Mobile | Tap | Open 90% modal |
| Both | X button | Close modal |
| Both | Arrow button | Open link in new tab |

---

## Filter System

### Global Search
- Single input field
- Searches all columns marked with `search` metadata
- Real-time filtering as user types

### Category Dropdowns
- One dropdown per `category` column
- Shows unique values from data
- Single-select

### CSV Multi-Select
- For `csv` columns (Features)
- Shows all unique tags (flattened from comma-separated values)
- Multi-select with tag chips
- X to remove individual selections

### Mobile Behavior
- "Filters" button toggles collapsible panel
- Panel slides down/up with animation

---

## URL Parameters (Embed)

**Base URL:** `https://mnngh2f.github.io/h2f-resource-gallery/`

| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `domain` | single | `?domain=Mental` | Pre-filter by Domain |
| `source` | single | `?source=H2F` | Pre-filter by Source |
| `asset` | single | `?asset=Video` | Pre-filter by Asset |
| `rwt` | single | `?rwt=5%20min` | Pre-filter by Read Watch Time |
| `features` | multi | `?features=sleep&features=recovery` | Pre-filter by Features |
| `search` | string | `?search=yoga` | Pre-fill search input |
| `lock` | boolean | `?lock=true` | Hide filter UI entirely |

### Lock Mode Behavior
- Top Pane hidden entirely
- Body expands to fill available space
- Bottom Pane (navigation) remains visible

### Example Embeds

```html
<!-- Full interactive gallery -->
<iframe 
  src="https://mnngh2f.github.io/h2f-resource-gallery/"
  width="100%"
  height="600"
  frameborder="0">
</iframe>

<!-- Pre-filtered, locked -->
<iframe 
  src="https://mnngh2f.github.io/h2f-resource-gallery/?domain=Mental&source=H2F&lock=true"
  width="100%"
  height="600"
  frameborder="0">
</iframe>
```

---

## Application States

### Loading
- Suspense boundary with spinner
- Centered in viewport
- Smooth transition to content

### Empty (No Results)
- Message: "No resources found"
- Centered in Body area
- Shown when filters return zero matches

### Error
- Error message with details
- Retry option if applicable

---

## Component Architecture

```
src/
├── components/
│   ├── Gallery/
│   │   ├── Gallery.tsx              // Main container (viewport)
│   │   ├── TopPane/
│   │   │   ├── TopPane.tsx          // Filter container
│   │   │   ├── SearchInput.tsx      // Global search
│   │   │   ├── CategorySelect.tsx   // Single-select dropdown
│   │   │   ├── CsvMultiSelect.tsx   // Multi-select tags
│   │   │   └── FilterToggle.tsx     // Mobile collapse button
│   │   ├── Body/
│   │   │   ├── CardCarousel.tsx     // Snap-scroll grid carousel
│   │   │   ├── Card.tsx             // Individual card
│   │   │   └── EmptyState.tsx       // No results message
│   │   ├── BottomPane/
│   │   │   └── Navigation.tsx       // Dots + arrows
│   │   └── Modal/
│   │       └── CardModal.tsx        // 90% viewport modal
│   └── common/
│       ├── Spinner.tsx              // Loading spinner
│       └── ErrorBoundary.tsx        // Error handling
├── hooks/
│   ├── useSheetData.ts              // Fetch + parse sheet
│   ├── useFilters.ts                // Filter state management
│   ├── useCarousel.ts               // Pagination/carousel state
│   ├── useModal.ts                  // Modal state
│   └── useUrlParams.ts              // Parse embed parameters
├── services/
│   └── sheets.ts                    // Google Sheets API calls
├── types/
│   └── gallery.types.ts             // TypeScript interfaces
├── utils/
│   ├── filterUtils.ts               // Filter logic helpers
│   ├── urlParams.ts                 // URL param utilities
│   └── domainColors.ts              // Color mapping
├── config.ts                        // Sheet ID, Tab name (hardcoded)
├── App.tsx                          // Root component with Suspense
├── main.tsx                         // Entry point
└── styles/
    ├── index.css                    // Global/reset styles
    ├── variables.css                // CSS custom properties
    ├── Gallery.css
    ├── TopPane.css
    ├── Card.css
    ├── Navigation.css
    └── Modal.css
```

---

## TypeScript Interfaces

```typescript
// Meta types for columns
type MetaType = 'search' | 'category' | 'csv' | 'hyperlink' | '';

// Column definition (parsed from Row 1 + Row 2)
interface ColumnDef {
  index: number;
  header: string;
  metaType: MetaType;
}

// Single resource item (parsed from Row 3+)
interface ResourceItem {
  title: string;
  domain: string;
  source: string;
  asset: string;
  link: string;
  description: string;
  readWatchTime: string;
  features: string[];  // Parsed from CSV
}

// Domain color configuration
interface DomainColors {
  primary: string;
  secondary: string;
}

// Filter state
interface FilterState {
  search: string;
  domain: string | null;
  source: string | null;
  asset: string | null;
  readWatchTime: string | null;
  features: string[];
}

// URL parameters from embed
interface EmbedParams extends FilterState {
  lock: boolean;
}

// Carousel state
interface CarouselState {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}
```

---

## CSS Approach

- **Methodology:** Component-scoped CSS files
- **Naming:** BEM-lite (`.component__element--modifier`)
- **Variables:** CSS custom properties in `variables.css`
- **Responsive:** Mobile-first with `min-width` breakpoints
- **Breakpoint:** 768px (mobile/desktop threshold)

---

## Development Workflow

### Commands
```bash
npm run dev      # Development server (localhost:5173)
npm run build    # Production build to /dist
npm run preview  # Preview production build (localhost:4173)
```

### Testing Embed Params (Development)
```
http://localhost:5173/?domain=Mental&lock=true
```

### Debug Banner (Dev Only)
Shows current mode and active filters — hidden in production.

---

## Deployment

1. `npm run build` — generates `/dist` folder
2. Push to `main` branch
3. GitHub Pages serves from `/dist` (or root with build output)
4. Embed via iframe in Google Sites

---

## Current Plan: Initial Implementation

### Phase 1: Foundation
- [ ] Project setup (Vite + Preact + TypeScript)
- [ ] Config file with hardcoded Sheet ID/Tab
- [ ] Google Sheets service (fetch + parse)
- [ ] TypeScript types

### Phase 2: Core Components
- [ ] Gallery container
- [ ] Card component (with CSS from provided code)
- [ ] Card carousel (snap-scroll grid)
- [ ] Navigation (dots + arrows)

### Phase 3: Filters
- [ ] Filter state management
- [ ] Search input
- [ ] Category dropdowns
- [ ] CSV multi-select
- [ ] Mobile collapsible panel

### Phase 4: Modal
- [ ] Modal component (90% viewport)
- [ ] Mobile tap behavior
- [ ] Desktop hover behavior

### Phase 5: Embed Features
- [ ] URL parameter parsing
- [ ] Lock mode
- [ ] Pre-filtering

### Phase 6: Polish
- [ ] Loading spinner (Suspense)
- [ ] Empty state
- [ ] Error handling
- [ ] Responsive fine-tuning

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-01-07 | Initial blueprint |