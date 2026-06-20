# Code Snippets & Patterns

Quick reference for agents extending the Workforce Activity module.

## Parse and analyze CSV (hook pattern)

```typescript
// hooks/useCsvUpload.ts — after PapaParse complete:
const { events } = ActivityParserService.parseRows(results.data);
const analysis = ActivityAnalysisService.analyze(events, scheduleBlocks);
setAnalysis(analysis, file.name); // also switches view to dashboard
```

## Read filtered analysis in a component

```typescript
const { analysis, hasData, isLoading } = useActivityAnalysis();
// analysis === filteredAnalysis (respects filters + schedule blocks)
```

## Filters

```typescript
const { filters, updateFilter, resetFilters, hasActiveFilters } = useFilteredAnalysis();

updateFilter('date', '2024-06-01');
updateFilter('search', 'john');
resetFilters();
```

## Dashboard data (metrics, charts, rankings)

```typescript
const {
  metrics,
  associates,
  topOffTaskChart,
  topUtilizedAssociates,
  hasResults,
} = useWorkforceDashboardData();
```

## Associate detail data

```typescript
const {
  summary,
  offTaskGaps,
  offTaskStats,
  scheduleSegments,
  shiftUtilization,
} = useAssociateDetail({ loginId });
```

## Get shift utilization from analysis

```typescript
const utilization = ActivityAnalysisService.getAssociateShiftUtilization(filteredAnalysis, loginId);
// utilization.segments — merged timeline with schedule overlay
```

## Apply schedule blocks to timeline (pure function)

```typescript
import { applyScheduleBlocksToTimeline, buildBaseSegmentsFromGaps } from 'src/modules/WorkforceActivity/utils';

const baseSegments = buildBaseSegmentsFromGaps(gaps, loginId);
const merged = applyScheduleBlocksToTimeline(baseSegments, scheduleBlocks);
```

## Gap severity

```typescript
import { getGapSeverity } from 'src/modules/WorkforceActivity/utils';

const severity = getGapSeverity(gap.durationMs); // 'Low' | 'Medium' | 'High'
```

## Navigate views (context)

```typescript
const { goToUpload, goToDashboard, openAssociate } = useActivityContext();

openAssociate('jdoe001'); // switches to associate view
```

## Schedule block CRUD (context)

```typescript
const { scheduleBlocks, addScheduleBlock, updateScheduleBlock, deleteScheduleBlock, resetScheduleBlocks } =
  useActivityContext();

addScheduleBlock({
  type: 'PAID_BREAK',
  label: 'Paid Break',
  startTime: '09:50',
  endTime: '10:00',
  appliesTo: 'ALL_ASSOCIATES',
});
```

## New presentational component template

```tsx
'use client'; // only if interactive

import * as React from 'react';
import classes from './MyComponent.module.scss';

type Props = {
  // typed props from models
};

export function MyComponent({ }: Props): React.ReactElement {
  return <div className={classes['wrapper']} />;
}
```

```scss
// MyComponent.module.scss
.wrapper {
  @apply rounded-lg border border-line bg-surface p-4;
}
```

## Duration / datetime formatting

```typescript
import {
  formatDuration,
  formatEventDateTime,
  formatUtilizationPercent,
} from 'src/modules/WorkforceActivity/utils';
```

## Off-task threshold constant

```typescript
import { OFF_TASK_GAP_THRESHOLD_MS } from 'src/modules/WorkforceActivity/constants';
// 10 * 60 * 1000
```

## Provider stack

```tsx
// src/providers/AppProviders.tsx
<AppThemeProvider>
  <ActivityProvider>{children}</ActivityProvider>
</AppThemeProvider>
```

## Component export barrel

Add to `components/index.ts`:

```typescript
export * from './MyComponent';
```
