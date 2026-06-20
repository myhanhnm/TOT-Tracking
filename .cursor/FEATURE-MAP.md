# Feature Map

## Entry points

| File | Role |
|------|------|
| `src/pages/index.tsx` | Renders `WorkforceActivity` |
| `src/modules/WorkforceActivity/WorkforceActivity.tsx` | View router + global filters |
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

Context exposes: `analysis`, `filteredAnalysis`, `filters`, `filterOptions`, `scheduleBlocks`, view navigation, schedule block CRUD.

## Hooks

| Hook | File | Returns |
|------|------|---------|
| `useCsvUpload` | `hooks/useCsvUpload.ts` | Drag/drop handlers, parsing |
| `useActivityAnalysis` | `hooks/useActivityAnalysis.ts` | `filteredAnalysis` as `analysis`, `hasData`, loading |
| `useFilteredAnalysis` | `hooks/useFilteredAnalysis.ts` | `filteredAnalysis`, filters, `updateFilter`, `resetFilters` |
| `useAssociateDetail` | `hooks/useAssociateDetail.ts` | `summary`, `offTaskGaps`, `offTaskStats`, `scheduleSegments`, `shiftUtilization` |
| `useWorkforceDashboardData` | `hooks/useWorkforceDashboardData.ts` | Metrics, charts, rankings data from `filteredAnalysis` |

## Services

| Service | File | Methods |
|---------|------|---------|
| `ActivityParserService` | `services/ActivityParserService.ts` | `validateFileType`, `validateHeaders`, `parseRows` |
| `ActivityAnalysisService` | `services/ActivityAnalysisService.ts` | `analyze(events, scheduleBlocks)`, `getAssociateSummary`, `getAssociateShiftUtilization`, `getAssociateEvents`, `getAssociateGaps`, `getAssociateOffTaskGaps` |
| `ActivityFilterService` | `services/ActivityFilterService.ts` | `applyFilters`, `extractFilterOptions`, `hasActiveFilters` |
| `ActivityChartService` | `services/ActivityChartService.ts` | `buildTopOffTaskChartData`, `buildTopScanVolumeChartData`, `buildUtilizationDistribution`, `buildGapDurationDistribution` |
| `ActivityRankingService` | `services/ActivityChartService.ts` | `getTopOffTaskAssociates`, `getTopUtilizedAssociates`, `getTopScanVolumeAssociates` |
| `ScheduleBlockStorageService` | `services/ScheduleBlockStorageService.ts` | `load`, `save`, `createId` |

## Utils

| File | Functions |
|------|-----------|
| `utils/datetime.ts` | `parseEventTime`, `formatEventTime`, `formatEventDateTime` |
| `utils/duration.ts` | `formatDuration`, `durationToMinutes` |
| `utils/gapCalculation.ts` | `calculateGapsForAssociate`, `isOffTaskGap`, `createGapBetweenEvents` |
| `utils/gapSeverity.ts` | `getGapSeverity`, `filterOffTaskGaps`, `computeOffTaskGapStats` |
| `utils/utilization.ts` | `calculateUtilizationPercent`, `formatUtilizationPercent`, `calculateScanRatePerHour` |
| `utils/timelineSegments.ts` | `buildShiftUtilization`, `getOffTaskSegments`, `getScheduledSegments` |
| `utils/timelineMerge.ts` | `applyScheduleBlocksToTimeline`, `buildBaseSegmentsFromGaps`, `calculateSegmentTimeBreakdown`, `mergeAdjacentSegments` |
| `utils/scheduleBlockTime.ts` | `parseTimeOnDate`, `resolveScheduleBlock`, `resolveScheduleBlocksForDates`, `resolveAndClipScheduleBlocksForTimeline` |
| `utils/segmentDisplay.ts` | `getSegmentCssClass`, `SEGMENT_STATUS_CSS_CLASS` |

## Components (module)

| Component | Used in | Purpose |
|-----------|---------|---------|
| `CsvUploadZone` | Upload | Drag/drop CSV upload |
| `DashboardFilters` | Dashboard + Associate | Date, associate, login, function, process, unit class, search |
| `WorkforceMetricsCards` | Dashboard | Active, off-task, breaks, meeting, utilization |
| `ScheduleBlocksManager` | Dashboard | CRUD for manual schedule blocks |
| `AssociateRankings` | Dashboard | Top off-task, utilization, scan volume tables |
| `WorkforceCharts` | Dashboard | 4 Recharts panels via `BarChartPanel` |
| `BarChartPanel` | Dashboard | Reusable responsive bar chart |
| `AssociateTable` | Dashboard | Full sortable associate table |
| `AssociateDetailHeader` | Associate detail | Name, login, utilization, time breakdown |
| `ActivityTimeline` | Associate detail | 5-color timeline + zoom presets + tooltips |
| `ScheduleEventsTable` | Associate detail | Paid break, lunch, meeting segments |
| `OffTaskSummaryCards` | Associate detail | Total/longest/avg gap, gap count |
| `OffTaskEventsTable` | Associate detail | OFF_TASK segments with severity |
| `MetricsCards` | *(legacy)* | Original 4-card metrics — superseded by `WorkforceMetricsCards` |
| `ActivityCharts` | *(legacy)* | Original 3-chart layout — superseded by `WorkforceCharts` |

## Shared components

| Component | Path |
|-----------|------|
| `EmptyState` | `src/components/EmptyState/` |
| `LoadingState` | `src/components/LoadingState/` |
| `ErrorState` | `src/components/ErrorState/` |

## Constants

| File | Contents |
|------|----------|
| `constants/activity.constants.ts` | Off-task threshold, severity thresholds, CSV columns, chart limit |
| `constants/view.constants.ts` | `ACTIVITY_VIEWS`, `ActivityView` type |
| `constants/filter.constants.ts` | `EMPTY_ACTIVITY_FILTERS`, `TIMELINE_ZOOM_PRESETS` |
| `constants/schedule.constants.ts` | `DEFAULT_SCHEDULE_BLOCKS`, `SCHEDULE_BLOCKS_STORAGE_KEY` |
| `constants/segment.constants.ts` | Segment labels, scheduled statuses, block type labels |

## Providers chain

```txt
pages/_app.tsx
  └── AppProviders (src/providers/AppProviders.tsx)
        └── AppThemeProvider
              └── ActivityProvider
                    └── pages/index.tsx → WorkforceActivity
                          └── AppShell
                                ├── DashboardFilters (when data loaded)
                                └── view content
```
