# Implementation Notes

## Build history (chronological)

1. **MVP scaffold** — Domain models, `ActivityParserService`, `ActivityAnalysisService`, utils
2. **CSV upload** — PapaParse client-side, `ActivityContext`, upload zone
3. **Dashboard** — Metrics cards, Recharts, associate table
4. **Associate detail** — Timeline with scans + all gaps
5. **SPA consolidation** — Single route `/`, removed Pages Router, auth, API layer
6. **UI redesign** — Minimalist warm monochrome per `.cursor/.agents/skills/minimalist-ui/`
7. **Associate detail refactor** — Off-task events table + severity; removed scan list
8. **Activity timeline** — Horizontal bar, zoom presets, utilization summary
9. **Supervisor dashboard** — Filters, rankings, 4 charts, expanded metrics, associate search
10. **Schedule blocks** — Manual break/lunch/meeting config, `localStorage` persistence, timeline overlay via `applyScheduleBlocksToTimeline`

## Key technical decisions

### No backend

Entire MVP runs in the browser. `ActivityProvider` holds `ActivityAnalysisResult` in React state. Schedule blocks persist in `localStorage` only.

### Single-page views vs routes

Associate detail uses `loginId` in context, not URL params. Deep-linking to an associate is **not supported**. To add: sync `view` + `loginId` + filters to query params.

### Business logic in shared services, not components

| Layer | Responsibility |
|-------|----------------|
| `ActivityParserService` | CSV validation + row mapping |
| `ActivityAnalysisService` | Sort, group, timeline merge, metrics, `shiftUtilizations` |
| `ActivityFilterService` | Filter scan events, extract filter options |
| `ActivityChartService` / `ActivityRankingService` | Chart and ranking data shaping |
| `ScheduleBlockStorageService` | `localStorage` read/write for schedule blocks |
| `src/shared/utils/timelineMerge.ts` | `applyScheduleBlocksToTimeline` — core overlay logic |
| `src/shared/utils/scheduleBlockTime.ts` | Resolve `HH:mm` blocks to absolute dates per calendar day |
| Other shared utils | Duration format, severity, utilization |

### filteredAnalysis vs raw analysis

- `analysis` — raw result from CSV upload
- `filteredAnalysis` — `ActivityFilterService.applyFilters` → `ActivityAnalysisService.analyze(events, scheduleBlocks)`
- **All hooks and UI use `filteredAnalysis`**
- `filterOptions` derived from raw `analysis.scanEvents` (unfiltered dropdown values)

### Off-task gaps naming

`ActivityAnalysisResult.offTaskGaps` now contains **only OFF_TASK segments** after schedule overlay (post-refactor). Use `getAssociateOffTaskGaps()` for associate-scoped access.

### Schedule block overlay

`applyScheduleBlocksToTimeline(segments, scheduleBlocks)`:

1. Resolves blocks on each unique calendar date in the timeline
2. Clips to shift bounds (earliest segment start → latest segment end)
3. Splits overlapping OFF_TASK segments; replaces overlap with scheduled segment type
4. Merges adjacent segments with same status/label/source

### Recharts

`WorkforceCharts` / `BarChartPanel` use `ResponsiveContainer`. Only renders after client navigation to dashboard with data.

### Hydration warning fix

Browser extensions inject attributes on `<body>`. Fixed with `suppressHydrationWarning` on `<html>` and `<body>` in `src/pages/_document.tsx`.

### SCSS + Tailwind class naming

Avoid SCSS class names that match Tailwind utilities (e.g. `.grid` causes circular `@apply grid` error). Use prefixed names like `.summary-grid`, `.metrics-grid`.

### Schedule blocks hydration

`scheduleBlocks` initializes synchronously from `localStorage` on the client via `loadInitialScheduleBlocks()` to avoid analyzing with empty blocks before hydration.

## Files that may exist but are INACTIVE

Boilerplate remnants (safe to delete in cleanup):

- `src/pages/`, `src/configs/`, `src/context/UserContext.tsx`
- `src/modules/Users/`, `Home/`, `Introduction/`
- `src/layouts/PublicLayout/` only (no auth — no `PrivateLayout`)
- `MetricsCards`, `ActivityCharts` — superseded but may still be exported

Active app uses paths listed in `FEATURE-MAP.md`.

## Testing manually

1. `npm run dev`
2. Upload `sample-data/workforce-activity-sample.csv`
3. Dashboard: 3 associates, John Doe highest off-task
4. Configure a paid break overlapping an off-task gap (e.g. 09:50–10:00)
5. Click associate: timeline shows split segments (off-task → paid break → off-task)
6. Schedule Events table shows paid break row; Off-task Events shows remaining off-task portions
7. Metrics: paid break time increases, off-task time decreases
8. Apply filters — all sections update
9. Refresh: CSV data cleared; schedule blocks persist from `localStorage`

## TypeScript

- Strict mode enabled
- No `any` in WorkforceActivity module
- `noUncheckedIndexedAccess` — handle optional array access

## When extending

1. Read `BUSINESS-RULES.md` first
2. Add models → `src/shared/utils/` + `src/shared/services/` → hooks → components (in that order)
3. Keep components presentational
4. Wire new calculations through `ActivityAnalysisService.analyze` so filters and schedule blocks stay consistent
5. Match existing minimalist UI patterns
6. Do not reintroduce auth/API unless explicitly requested
