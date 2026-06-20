# Business Rules

## Data source

- Users export a CSV from **AWS QuickSight**
- Each row = one warehouse **scan event**
- All calculations derived from uploaded CSV + **manual schedule blocks** (client config)
- CSV data stored **in memory** (React Context) — lost on page refresh
- Schedule blocks persisted in **`localStorage`** (`workforce-activity-schedule-blocks`)

## Required CSV columns

Exact header names (case-sensitive after trim):

```
LoginID, Associate Name, Function, Unit Class, Process, Event Time,
ASIN, Reference, Size, Unit Type, Pack Flow, Pick Process Path, Units
```

Defined in `src/modules/WorkforceActivity/constants/activity.constants.ts`.

## Core entities

| Concept | Definition |
|---------|------------|
| Scan event | One row; `Event Time` = timestamp of scan |
| Associate | Identified by `Associate Name` + `LoginID` |
| Gap | Time between two consecutive scans for same associate |
| Off-task gap | Gap duration **> 10 minutes** |
| Active period | Gap duration **≤ 10 minutes** (between scans) |
| Schedule block | Manual time block (paid break, lunch, meeting) overlaid on timeline |
| Timeline segment | Visual unit on associate timeline (ACTIVE, OFF_TASK, PAID_BREAK, UNPAID_BREAK, MEETING) |

Constants: `OFF_TASK_GAP_THRESHOLD_MS = 10 * 60 * 1000`

## Sorting

Events sorted by:

1. `Associate Name` (ascending)
2. `Event Time` (ascending)

Within each associate, gaps computed on consecutive sorted events.

## Gap calculation

For associate events `[E1, E2, ..., En]`:

```
gap(i) = E(i+1).eventTime - E(i).eventTime
isOffTask = gap.durationMs > OFF_TASK_GAP_THRESHOLD_MS
```

- `startTime` = previous scan time
- `endTime` = current scan time

## Schedule block overlay

Manual schedule blocks are configured on the dashboard and applied during analysis.

**Default blocks** (in `constants/schedule.constants.ts`):

| Label | Time | Type |
|-------|------|------|
| Fast Start / SOS | 07:30–07:40 | MEETING |
| Paid Break 1 | 10:15–10:30 | PAID_BREAK |
| Paid Break 2 | 15:15–15:30 | PAID_BREAK |
| Lunch | 12:30–13:00 | UNPAID_BREAK |

**Rules:**

- MVP: all blocks apply to `ALL_ASSOCIATES`
- Blocks use time-of-day (`HH:mm`); resolved to absolute `Date` on each calendar date present in the timeline
- When an **OFF_TASK** segment overlaps a schedule block, that portion is reclassified (e.g. OFF_TASK → PAID_BREAK)
- ACTIVE segments overlapping a block are **not** replaced
- Scheduled time is **excluded** from off-task totals and utilization denominator
- Off-task gaps in `ActivityAnalysisResult.offTaskGaps` reflect **post-overlay** OFF_TASK segments only

**Example:**

```
Gap: 09:38 → 10:09 (OFF_TASK)
Paid Break: 09:50 → 10:00

Result:
  09:38 → 09:50  OFF_TASK
  09:50 → 10:00  PAID_BREAK
  10:00 → 10:09  OFF_TASK
```

## Filtering

Filters in `ActivityFilters` (all optional):

- Date (`yyyy-MM-dd`)
- Associate Name
- Login ID
- Function
- Process
- Unit Class
- Search (associate name or login ID substring)

When any filter changes, `filteredAnalysis` is recomputed — all metrics, charts, tables, and timelines update.

## Dashboard metrics (global)

| Metric | Calculation |
|--------|-------------|
| Total Associates | Unique `LoginID` count (after filters) |
| Total Scan Events | Row count (after filters) |
| Total Off Task Gaps | Count of OFF_TASK segments after schedule overlay |
| Total Off Task Duration | Sum of OFF_TASK segment durations |
| Total Active Time | Sum of ACTIVE segment durations |
| Total Paid Break Time | Sum of PAID_BREAK segment durations |
| Total Unpaid Break Time | Sum of UNPAID_BREAK segment durations |
| Total Meeting Time | Sum of MEETING segment durations |
| Utilization % | `Active / (Active + Off Task) × 100` |
| Longest Gap | Max OFF_TASK segment duration |
| Average Gap | Mean OFF_TASK segment duration |
| Scan Rate | Total scans / total shift hours |

## Associate summary (table row)

| Column | Source |
|--------|--------|
| Associate Name | From events |
| Login ID | From events |
| Total Scans | Event count |
| First Scan | Earliest `eventTime` |
| Last Scan | Latest `eventTime` |
| Utilization % | From merged timeline segments |
| Active Time | Sum of ACTIVE segments |
| Off Task Gap Count | OFF_TASK segments after overlay |
| Total Off Task Duration | Sum of OFF_TASK segments |
| Paid / Unpaid / Meeting Time | From merged segments |
| Scan Rate | Scans per hour over shift span |
| Longest / Average Gap | From OFF_TASK segments |

Default table sort: **Off Task Duration descending**.

## Off-task gap severity (associate detail table)

Only **OFF_TASK** segments (after schedule overlay) appear in the Off Task Events table.

| Duration | Severity |
|----------|----------|
| > 10 min and ≤ 15 min | Low |
| > 15 min and ≤ 30 min | Medium |
| > 30 min | High |

Constants: `GAP_SEVERITY_THRESHOLDS_MS` in `activity.constants.ts`.

## Activity timeline (associate detail)

Horizontal bar from **first scan** to **last scan**:

| Segment color | Status | Meaning |
|---------------|--------|---------|
| Green | ACTIVE | Gap ≤ 10 min between scans |
| Red | OFF_TASK | Gap > 10 min (after schedule overlay) |
| Light green | PAID_BREAK | Manual schedule overlay |
| Gray | UNPAID_BREAK | Manual schedule overlay (lunch) |
| Purple | MEETING | Manual schedule overlay (SOS/Fast Start) |

**Utilization:**

```
Active Time           = sum of ACTIVE segment durations
Off Task Time         = sum of OFF_TASK segment durations (after schedule overlay)
Paid Break Time       = sum of PAID_BREAK segments
Unpaid Break Time     = sum of UNPAID_BREAK segments
Meeting Time          = sum of MEETING segments
Utilization %         = (Active Time / (Active Time + Off Task Time)) × 100
```

Paid break, unpaid break, and meeting time are **not** included in the utilization denominator.

Displayed with one decimal place (e.g. `87.3%`).

Tooltip on hover: status, label, start, end, duration, source (`Scan Events` or `Manual Schedule`).

Zoom presets: Full (1x), 2x, 4x, 8x with horizontal scroll.

## Associate detail tables

| Table | Contents |
|-------|----------|
| Off-task Events | OFF_TASK segments only — start, end, duration, severity |
| Schedule Events | PAID_BREAK, UNPAID_BREAK, MEETING segments — type, label, start, end, duration |

## Associate detail — what NOT to show

- Individual scan events
- On-task gaps in off-task events table
- Scheduled segments in off-task events table

## Sample data

`sample-data/Activity_Details_1781920653570.csv` — Abdisalam Jama (`abdisacj`) has a ~32 min off-task gap (09:38:13 → 10:09:46). Export includes extra columns (`Tool`, `destination_container`) beyond the required set; parser ignores them.
