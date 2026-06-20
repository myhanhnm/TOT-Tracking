# Business Rules

## Data source

- Users export a CSV from **AWS QuickSight**
- Each row = one warehouse **scan event**
- All calculations derived **only** from uploaded CSV
- Data stored **in memory** (React Context) — lost on page refresh

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
- Break/lunch logic: **not implemented** (MVP scope)

## Dashboard metrics (global)

| Metric | Calculation |
|--------|-------------|
| Total Associates | Unique `LoginID` count |
| Total Scan Events | Row count |
| Total Off Task Gaps | Count of gaps where `isOffTask === true` |
| Total Off Task Duration | Sum of off-task gap durations |

## Associate summary (table row)

| Column | Source |
|--------|--------|
| Associate Name | From events |
| Login ID | From events |
| Total Scans | Event count |
| First Scan | Earliest `eventTime` |
| Last Scan | Latest `eventTime` |
| Off Task Gap Count | Off-task gaps only |
| Total Off Task Duration | Sum of off-task gap durations |

Default table sort: **Off Task Duration descending**.

## Off-task gap severity (associate detail table)

Only gaps **> 10 min** appear in the Off Task Events table.

| Duration | Severity |
|----------|----------|
| > 10 min and ≤ 15 min | Low |
| > 15 min and ≤ 30 min | Medium |
| > 30 min | High |

Constants: `GAP_SEVERITY_THRESHOLDS_MS` in `activity.constants.ts`.

## Activity timeline (associate detail)

Horizontal bar from **first scan** to **last scan**:

| Segment color | Meaning |
|---------------|---------|
| Green | Active work (gap ≤ 10 min) |
| Red | Off-task (gap > 10 min) |
| Light green | Paid break (manual schedule overlay) |
| Gray | Unpaid break / lunch (manual schedule overlay) |
| Purple | Meeting / SOS / Fast Start (manual schedule overlay) |

**Manual schedule blocks:**

- Configured in dashboard UI; persisted in `localStorage`
- Default blocks: Fast Start (07:30–07:40), Paid Break 1 (10:15–10:30), Lunch (12:30–13:00), Paid Break 2 (15:15–15:30)
- Applied to all associates (`ALL_ASSOCIATES` for MVP)
- When an off-task gap overlaps a schedule block, that portion is reclassified (e.g. OFF_TASK → PAID_BREAK)
- Scheduled time is excluded from off-task totals and utilization denominator

**Shift utilization:**

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

Tooltip on hover: status, label, start, end, duration, source (Scan Events or Manual Schedule).

Zoom presets: Full (1x), 2x, 4x, 8x with horizontal scroll.

## Associate detail — what NOT to show

- Individual scan events (removed)
- On-task gaps in off-task events table (only off-task > 10 min)
- All scan-to-scan gaps in a mixed timeline (replaced by Activity Timeline + Off Task Events table)

## Sample data

`sample-data/workforce-activity-sample.csv` — John Doe has ~30m off-task gap (07:44:56 → 08:15:00).
