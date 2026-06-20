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
  isOffTask: boolean;  // always true in post-overlay analysis results
};
```

After schedule overlay, `offTaskGaps` in `ActivityAnalysisResult` contains only **OFF_TASK** segments (converted from timeline).

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
  activeTimeMs: number;
  paidBreakTimeMs: number;
  unpaidBreakTimeMs: number;
  meetingTimeMs: number;
  totalScheduledTimeMs: number;
  utilizationPercent: number;
  scanRatePerHour: number;
  longestGapMs: number;
  averageGapMs: number;
};
```

## WorkforceMetrics (alias: DashboardMetrics)

```typescript
type WorkforceMetrics = {
  totalAssociates: number;
  totalScanEvents: number;
  totalOffTaskGaps: number;
  totalOffTaskDurationMs: number;
  totalActiveTimeMs: number;
  totalPaidBreakTimeMs: number;
  totalUnpaidBreakTimeMs: number;
  totalMeetingTimeMs: number;
  totalScheduledTimeMs: number;
  utilizationPercent: number;
  longestGapMs: number;
  averageGapMs: number;
  scanRatePerHour: number;
};
```

## ActivityAnalysisResult

Root analysis output; `filteredAnalysis` in context is the filtered + schedule-overlay version:

```typescript
type ActivityAnalysisResult = {
  scanEvents: ScanEvent[];
  associateSummaries: AssociateSummary[];
  offTaskGaps: OffTaskGap[];                        // OFF_TASK only (post-overlay)
  shiftUtilizations: Record<string, ShiftUtilization>;
  metrics: DashboardMetrics;
};
```

## ActivityFilters / ActivityFilterOptions

```typescript
type ActivityFilters = {
  date: string | null;       // yyyy-MM-dd
  associateName: string;
  loginId: string;
  function: string;
  process: string;
  unitClass: string;
  search: string;
};

type ActivityFilterOptions = {
  dates: string[];
  associateNames: string[];
  loginIds: string[];
  functions: string[];
  processes: string[];
  unitClasses: string[];
};
```

## ScheduleBlock

```typescript
type ScheduleBlockType = 'PAID_BREAK' | 'UNPAID_BREAK' | 'MEETING';
type ScheduleAppliesTo = 'ALL_ASSOCIATES' | 'SELECTED_ASSOCIATES';

type ScheduleBlock = {
  id: string;
  type: ScheduleBlockType;
  label: string;
  startTime: string;   // HH:mm
  endTime: string;     // HH:mm
  appliesTo: ScheduleAppliesTo;
};

type ResolvedScheduleBlock = ScheduleBlock & {
  startDateTime: Date;
  endDateTime: Date;
};
```

## ActivitySegmentStatus / TimelineSegment

Defined in `models/activity-segment.model.ts`:

```typescript
type ActivitySegmentStatus =
  | 'ACTIVE'
  | 'OFF_TASK'
  | 'PAID_BREAK'
  | 'UNPAID_BREAK'
  | 'MEETING';

type ActivitySegmentSource = 'SCAN_EVENTS' | 'MANUAL_SCHEDULE';

type TimelineSegment = {
  id: string;
  loginId: string;
  startTime: Date;
  endTime: Date;
  durationMs: number;
  durationSeconds: number;
  status: ActivitySegmentStatus;
  label: string;
  source: ActivitySegmentSource;
};
```

## ShiftUtilization

Per-associate timeline bundle (keyed by `loginId` in `shiftUtilizations`):

```typescript
type ShiftUtilization = {
  loginId: string;
  firstScan: Date;
  lastScan: Date;
  totalShiftTimeMs: number;
  activeTimeMs: number;
  offTaskTimeMs: number;
  paidBreakTimeMs: number;
  unpaidBreakTimeMs: number;
  meetingTimeMs: number;
  totalScheduledTimeMs: number;
  utilizationPercent: number;
  segments: TimelineSegment[];
};
```

## SegmentTimeBreakdown

```typescript
type SegmentTimeBreakdown = {
  activeTimeMs: number;
  offTaskTimeMs: number;
  paidBreakTimeMs: number;
  unpaidBreakTimeMs: number;
  meetingTimeMs: number;
  totalScheduledTimeMs: number;
  utilizationPercent: number;
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

## ChartDatum

```typescript
type ChartDatum = {
  name: string;
  value: number;
  displayValue: string;
};
```

## GapSeverity

```typescript
type GapSeverity = 'Low' | 'Medium' | 'High';
```

## ActivityView

```typescript
type ActivityView = 'upload' | 'dashboard' | 'associate';
```

## CsvRow

```typescript
type CsvRow = Record<string, string>;
```
