# Data Models

All domain models live in `src/modules/WorkforceActivity/models/`.

## ScanEvent

```typescript
type ScanEvent = {
  loginId: string;
  associateName: string;
  function: string;
  unitClass: string;
  process: string;
  eventTime: Date;
  asin: string;
  reference: string;
  size: string;
  unitType: string;
  packFlow: string;
  pickProcessPath: string;
  units: number;
};
```

## OffTaskGap

```typescript
type OffTaskGap = {
  associateName: string;
  loginId: string;
  startTime: Date;
  endTime: Date;
  durationMs: number;
  isOffTask: boolean;  // durationMs > OFF_TASK_GAP_THRESHOLD_MS
};
```

## AssociateSummary

```typescript
type AssociateSummary = {
  associateName: string;
  loginId: string;
  totalScans: number;
  firstScan: Date;
  lastScan: Date;
  offTaskGapCount: number;
  totalOffTaskDurationMs: number;
};
```

## DashboardMetrics

```typescript
type DashboardMetrics = {
  totalAssociates: number;
  totalScanEvents: number;
  totalOffTaskGaps: number;
  totalOffTaskDurationMs: number;
};
```

## ActivityAnalysisResult

Root analysis output stored in context:

```typescript
type ActivityAnalysisResult = {
  scanEvents: ScanEvent[];
  associateSummaries: AssociateSummary[];
  offTaskGaps: OffTaskGap[];        // ALL gaps (on-task + off-task)
  metrics: DashboardMetrics;
};
```

## OffTaskGapStats

Associate-level off-task aggregates:

```typescript
type OffTaskGapStats = {
  totalDurationMs: number;
  longestGapMs: number;
  averageGapMs: number;
  gapCount: number;
};
```

## GapSeverity

```typescript
type GapSeverity = 'Low' | 'Medium' | 'High';
```

## TimelineSegment

```typescript
type TimelineSegment = {
  startTime: Date;
  endTime: Date;
  durationMs: number;
  status: 'Active' | 'Off task';
  isOffTask: boolean;
};
```

## ShiftUtilization

Timeline + utilization bundle:

```typescript
type ShiftUtilization = {
  firstScan: Date;
  lastScan: Date;
  totalShiftTimeMs: number;
  activeTimeMs: number;
  offTaskTimeMs: number;
  utilizationPercent: number;
  segments: TimelineSegment[];
};
```

## ActivityView

```typescript
type ActivityView = 'upload' | 'dashboard' | 'associate';
```

## CsvRow

```typescript
type CsvRow = Record<string, string>;
```
