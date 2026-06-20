# Code Snippets & Patterns

Quick reference for agents extending the Workforce Activity module.

## Parse and analyze CSV (hook pattern)

```typescript
// hooks/useCsvUpload.ts — after PapaParse complete:
const { events } = ActivityParserService.parseRows(results.data);
const analysis = ActivityAnalysisService.analyze(events);
setAnalysis(analysis, file.name); // also switches view to dashboard
```

## Read analysis in a component

```typescript
const { analysis, hasData, isLoading } = useActivityAnalysis();
```

## Associate detail data

```typescript
const { summary, offTaskGaps, offTaskStats, shiftUtilization } = useAssociateDetail({ loginId });
```

## Filter off-task gaps only

```typescript
import { filterOffTaskGaps } from 'src/modules/WorkforceActivity/utils';
// or
ActivityAnalysisService.getAssociateOffTaskGaps(analysis, loginId);
```

## Build timeline / utilization

```typescript
import { buildShiftUtilization } from 'src/modules/WorkforceActivity/utils';

const events = ActivityAnalysisService.getAssociateEvents(analysis, loginId);
const shiftUtilization = buildShiftUtilization(events);
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
import { formatDuration, formatEventDateTime, formatEventTime } from '../utils';
```

## Off-task threshold constant

```typescript
import { OFF_TASK_GAP_THRESHOLD_MS } from '../constants';
// 10 * 60 * 1000
```

## Provider stack

```tsx
// src/app/providers.tsx
<AppThemeProvider>
  <ActivityProvider>{children}</ActivityProvider>
</AppThemeProvider>
```

## Component export barrel

Add to `components/index.ts`:

```typescript
export * from './MyComponent';
```
