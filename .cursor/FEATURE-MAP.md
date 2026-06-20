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
| `PublicLayout` | `src/layouts/PublicLayout/PublicLayout.tsx` |

## Context

| Export | File |
|--------|------|
| `ActivityProvider`, `useActivityContext` | `src/context/ActivityContext.tsx` |

Context exposes: `analysis`, `filteredAnalysis`, `filters`, `filterOptions`, `scheduleBlocks`, view navigation, schedule block CRUD.

## Hooks

| Hook | File | Returns |
|------|------|---------|
| `useCsvUpload` | `hooks/useCsvUpload.ts` | Drag/drop handlers, parsing |
| `useActivityAnalysis` | `hooks/useActivityAnalysis.ts` | `filteredAnalysis` as `analysis`, `hasData`, loading |
| `useFilteredAnalysis` | `hooks/useFilteredAnalysis.ts` | `filteredAnalysis`, filters, `updateFilter`, `resetFilters` |
| `useAssociateDetail` | `hooks/useAssociateDetail.ts` | `summary`, `offTaskGaps`, `offTaskStats`, `scheduleSegments`, `shiftUtilization` |
| `useWorkforceDashboardData` | `hooks/useWorkforceDashboardData.ts` | Metrics, charts, rankings data from `filteredAnalysis` |

## Shared services (`src/shared/services/`)

| Service | File | Methods |
|---------|------|---------|
| `ActivityParserService` | `ActivityParserService.ts` | `validateFileType`, `validateHeaders`, `parseRows` |
| `ActivityAnalysisService` | `ActivityAnalysisService.ts` | `analyze(events, scheduleBlocks)`, `getAssociateSummary`, `getAssociateShiftUtilization`, `getAssociateEvents`, `getAssociateGaps`, `getAssociateOffTaskGaps` |
| `ActivityFilterService` | `ActivityFilterService.ts` | `applyFilters`, `extractFilterOptions`, `hasActiveFilters` |
| `ActivityChartService` | `ActivityChartService.ts` | `buildTopOffTaskChartData`, `buildTopScanVolumeChartData`, `buildUtilizationDistribution`, `buildGapDurationDistribution` |
| `ActivityRankingService` | `ActivityChartService.ts` | `getTopOffTaskAssociates`, `getTopUtilizedAssociates`, `getTopScanVolumeAssociates` |
| `ScheduleBlockStorageService` | `ScheduleBlockStorageService.ts` | `load`, `save`, `createId` |

## Shared utils (`src/shared/utils/`)

| File | Functions |
|------|-----------|
| `datetime.ts` | `parseEventTime`, `formatEventTime`, `formatEventDateTime` |
| `duration.ts` | `formatDuration`, `durationToMinutes` |
| `gapCalculation.ts` | `calculateGapsForAssociate`, `isOffTaskGap`, `createGapBetweenEvents` |
| `gapSeverity.ts` | `getGapSeverity`, `filterOffTaskGaps`, `computeOffTaskGapStats` |
| `utilization.ts` | `calculateUtilizationPercent`, `formatUtilizationPercent`, `calculateScanRatePerHour` |
| `timelineSegments.ts` | `buildShiftUtilization`, `getOffTaskSegments`, `getScheduledSegments` |
| `timelineMerge.ts` | `applyScheduleBlocksToTimeline`, `buildBaseSegmentsFromGaps`, `calculateSegmentTimeBreakdown`, `mergeAdjacentSegments` |
| `scheduleBlockTime.ts` | `parseTimeOnDate`, `resolveScheduleBlock`, `resolveScheduleBlocksForDates`, `resolveAndClipScheduleBlocksForTimeline` |
| `segmentDisplay.ts` | `getSegmentCssClass`, `SEGMENT_STATUS_CSS_CLASS` |

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
                          └── PublicLayout → WorkforceActivityNav
                                ├── DashboardFilters (when data loaded)
                                └── view content
```
