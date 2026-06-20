# Implementation Notes

## Build history (chronological)

1. **MVP scaffold** — Domain models, `ActivityParserService`, `ActivityAnalysisService`, utils
2. **CSV upload** — PapaParse client-side, `ActivityContext`, upload zone
3. **Dashboard** — Metrics cards, Recharts, associate table
4. **Associate detail** — Initially timeline with scans + all gaps
5. **SPA consolidation** — Single route `/`, removed Pages Router, auth, API layer
6. **UI redesign** — Minimalist warm monochrome per `.cursor/.agents/skills/minimalist-ui/`
7. **Associate detail refactor** — Off-task events table + severity; removed scan list
8. **Activity timeline** — Horizontal bar, zoom, utilization summary

## Key technical decisions

### No backend

Entire MVP runs in the browser. `ActivityProvider` holds `ActivityAnalysisResult` in React state. Acceptable trade-off for MVP; document if adding persistence.

### Single-page views vs routes

Associate detail uses `loginId` in context, not URL params. Deep-linking to an associate is **not supported**. To add: sync `view` + `loginId` to query params (`?view=associate&id=...`).

### Business logic in services, not components

- `ActivityParserService` — CSV validation + row mapping
- `ActivityAnalysisService` — sort, group, gap aggregation, metrics
- Utils — pure helpers (duration format, severity, timeline segments)

### Off-task vs all gaps

`ActivityAnalysisResult.offTaskGaps` contains **all** consecutive scan gaps (misleading name — includes on-task gaps). Filter with `gap.isOffTask` or use `getAssociateOffTaskGaps()`.

### Recharts

`ActivityCharts` uses `ResponsiveContainer`. Only renders after client navigation to dashboard with data — not SSR'd with chart data. If hydration issues appear, dynamic import with `ssr: false`.

### Hydration warning fix

Browser extensions inject attributes on `<body>` (e.g. `bis_register`). Fixed with `suppressHydrationWarning` on `<html>` and `<body>` in `src/app/layout.tsx`. Not an app bug.

### SCSS + Tailwind class naming

Avoid SCSS class names that match Tailwind utilities (e.g. `.grid` causes circular `@apply grid` error). Use prefixed names like `.summary-grid`, `.metrics-grid`.

### MUI Chip severity colors

Off-task severity chips use Tailwind classes in SCSS module (`severity-low`, `severity-medium`, `severity-high`).

## Files that may exist but are INACTIVE

Boilerplate remnants (safe to delete in cleanup):

- `src/pages/`, `src/configs/`, `src/context/UserContext.tsx`
- `src/modules/Users/`, `Home/`, `Introduction/`
- `src/layouts/DashboardLayout/`, `PrivateLayout/`, `PublicLayout/`
- `src/app/activity/` (old multi-route structure)

Active app uses only paths listed in `FEATURE-MAP.md`.

## Testing manually

1. `npm run dev`
2. Upload `sample-data/workforce-activity-sample.csv`
3. Dashboard: 3 associates, John Doe highest off-task
4. Click John Doe: timeline shows red ~30m segment, utilization drops
5. Off-task events table: 1 row, severity High
6. Refresh: returns to empty upload state

## TypeScript

- Strict mode enabled
- No `any` in WorkforceActivity module
- `noUncheckedIndexedAccess` — handle optional array access

## When extending

1. Read `BUSINESS-RULES.md` first
2. Add models → utils/services → hooks → components (in that order)
3. Keep components presentational
4. Match existing minimalist UI patterns
5. Do not reintroduce auth/API unless explicitly requested
