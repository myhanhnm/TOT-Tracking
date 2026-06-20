# Feature Map

## Entry points

| File | Role |
|------|------|
| `src/app/page.tsx` | Renders `WorkforceActivity` |
| `src/modules/WorkforceActivity/WorkforceActivity.tsx` | View router inside SPA |
| `src/modules/WorkforceActivity/index.ts` | Exports `WorkforceActivity` only |

## Views (screens)

| View constant | Component | File |
|---------------|-----------|------|
| `upload` | `WorkforceActivityUpload` | `WorkforceActivityUpload.tsx` |
| `dashboard` | `WorkforceActivityDashboard` | `WorkforceActivityDashboard.tsx` |
| `associate` | `WorkforceActivityAssociateDetail` | `WorkforceActivityAssociateDetail.tsx` |

## Layout

| Component | File |
|-----------|------|
| `AppShell` | `src/layouts/AppShell/AppShell.tsx` |

## Context

| Export | File |
|--------|------|
| `ActivityProvider`, `useActivityContext` | `context/ActivityContext.tsx` |

## Hooks

| Hook | File | Returns |
|------|------|---------|
| `useCsvUpload` | `hooks/useCsvUpload.ts` | Drag/drop handlers, parsing |
| `useActivityAnalysis` | `hooks/useActivityAnalysis.ts` | `analysis`, `hasData`, loading |
| `useAssociateDetail` | `hooks/useAssociateDetail.ts` | `summary`, `offTaskGaps`, `offTaskStats`, `shiftUtilization` |

## Services

| Service | File | Methods |
|---------|------|---------|
| `ActivityParserService` | `services/ActivityParserService.ts` | `validateFileType`, `validateHeaders`, `parseRows` |
| `ActivityAnalysisService` | `services/ActivityAnalysisService.ts` | `analyze`, `getAssociateSummary`, `getAssociateEvents`, `getAssociateGaps`, `getAssociateOffTaskGaps` |

## Utils

| File | Functions |
|------|-----------|
| `utils/datetime.ts` | `parseEventTime`, `formatEventTime`, `formatEventDateTime` |
| `utils/duration.ts` | `formatDuration`, `durationToMinutes` |
| `utils/gapCalculation.ts` | `calculateGapsForAssociate`, `isOffTaskGap`, `createGapBetweenEvents` |
| `utils/gapSeverity.ts` | `getGapSeverity`, `filterOffTaskGaps`, `computeOffTaskGapStats` |
| `utils/timelineSegments.ts` | `buildShiftUtilization`, `formatUtilizationPercent` |

## Components (module)

| Component | Used in | Purpose |
|-----------|---------|---------|
| `CsvUploadZone` | Upload | Drag/drop CSV upload |
| `MetricsCards` | Dashboard | 4 global metric cards |
| `ActivityCharts` | Dashboard | Recharts bar charts (top 10, distribution) |
| `AssociateTable` | Dashboard | Sortable associate table |
| `AssociateDetailHeader` | Associate detail | Name, login, scan count |
| `ActivityTimeline` | Associate detail | Horizontal timeline + zoom + utilization |
| `OffTaskSummaryCards` | Associate detail | Total/longest/avg gap, gap count |
| `OffTaskEventsTable` | Associate detail | Off-task gaps table with severity |

## Shared components

| Component | Path |
|-----------|------|
| `EmptyState` | `src/components/EmptyState/` |
| `LoadingState` | `src/components/LoadingState/` |
| `ErrorState` | `src/components/ErrorState/` |

## Constants

| File | Contents |
|------|----------|
| `constants/activity.constants.ts` | Thresholds, CSV columns, chart limit |
| `constants/view.constants.ts` | `ACTIVITY_VIEWS`, `ActivityView` type |

## Providers chain

```txt
layout.tsx
  └── AppProviders (providers.tsx)
        └── AppThemeProvider
              └── ActivityProvider
                    └── page → WorkforceActivity
```
