# Architecture

## High-level data flow

```txt
CSV File (browser)
    ↓
ActivityParserService.parseRows()          ← PapaParse in useCsvUpload hook
    ↓
ScanEvent[]
    ↓
ActivityAnalysisService.analyze(events, scheduleBlocks)
    ↓
ActivityAnalysisResult (raw, in ActivityContext.analysis)
    ↓
ActivityFilterService.applyFilters()       ← when filters active
    ↓
ActivityAnalysisService.analyze(filtered, scheduleBlocks)
    ↓
filteredAnalysis (in ActivityContext)        ← used by all hooks/UI
    ↓
Feature hooks (useFilteredAnalysis, useWorkforceDashboardData, useAssociateDetail)
    ↓
UI components (no business logic in components)
```

## Layer responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Route | `src/pages/index.tsx` | Thin wrapper → `<WorkforceActivity />` |
| Document | `src/pages/_document.tsx` | HTML shell, hydration warnings |
| App shell | `src/pages/_app.tsx` | Global styles, fonts, Head, providers |
| Providers | `src/providers/AppProviders.tsx` | `AppThemeProvider` + `ActivityProvider` |
| Shell | `src/layouts/AppShell/` | Header nav, file name meta |
| Module root | `src/modules/WorkforceActivity/WorkforceActivity.tsx` | View switching + global filters |
| Components | `.../components/` | Presentational UI only |
| Hooks | `.../hooks/` | Orchestration, context access |
| Context | `.../context/ActivityContext.tsx` | In-memory app state + filters + schedule blocks |
| Services | `.../services/` | Parse, analyze, filter, chart data, schedule storage |
| Utils | `.../utils/` | Datetime, duration, gaps, severity, timeline merge |
| Models | `.../models/` | TypeScript types |
| Shared UI | `src/components/` | EmptyState, LoadingState, ErrorState |
| Theme | `src/theme/` | MUI theme config |

## View state machine

```txt
upload ──(CSV parsed)──► dashboard
dashboard ──(row click)──► associate
associate ──(back)──► dashboard
upload ◄──(nav)── dashboard ◄──(nav)── associate
```

State in `ActivityContext`:

| Field | Type | Purpose |
|-------|------|---------|
| `view` | `upload` \| `dashboard` \| `associate` | Current screen |
| `selectedLoginId` | `string \| null` | Associate detail target |
| `analysis` | `ActivityAnalysisResult \| null` | Raw upload result |
| `filteredAnalysis` | `ActivityAnalysisResult \| null` | Re-analyzed with filters + schedule blocks |
| `filters` | `ActivityFilters` | Active dashboard filters |
| `filterOptions` | `ActivityFilterOptions \| null` | Dropdown/autocomplete options from raw data |
| `scheduleBlocks` | `ScheduleBlock[]` | Manual break/meeting config (`localStorage`) |
| `fileName` | `string \| null` | Uploaded CSV name |

**All feature hooks read `filteredAnalysis`**, not raw `analysis`. `hasData` checks `analysis !== null`.

## Timeline merge pipeline

```txt
ScanEvent[] (per associate)
    ↓
calculateGapsForAssociate()                → OffTaskGap[]
    ↓
buildBaseSegmentsFromGaps()              → TimelineSegment[] (ACTIVE / OFF_TASK)
    ↓
applyScheduleBlocksToTimeline()          → splits OFF_TASK overlaps into scheduled segments
    ↓
calculateSegmentTimeBreakdown()          → metrics per associate
    ↓
ShiftUtilization (stored in analysis.shiftUtilizations[loginId])
```

Key function: `utils/timelineMerge.ts` → `applyScheduleBlocksToTimeline(segments, scheduleBlocks)`

Schedule blocks resolved per unique calendar date in the timeline, then clipped to shift bounds.

## Separation of concerns (strict)

**Components must NOT:**

- Parse CSV
- Calculate gaps, metrics, or timeline merges
- Call services directly (use hooks)

**Services must NOT:**

- Import React
- Access context
- Render UI

**Hooks may:**

- Call services
- Read/write context
- Return derived data via `useMemo`

## Client vs server components

| File | Type | Reason |
|------|------|--------|
| `src/pages/_document.tsx` | Server | HTML document, hydration fix |
| `src/pages/_app.tsx` | Client | Global styles, fonts, providers |
| `src/pages/index.tsx` | Server | Thin wrapper |
| `WorkforceActivity.tsx` | Client | Context, view state |
| Most module components | Client | Interactivity, MUI hooks |

Mark `'use client'` on any file using hooks, context, or browser APIs.

## Import rules

- Use `src/` imports — **not** `@/`
- Feature code stays in `src/modules/WorkforceActivity/`
- Do not add `src/apis/` unless backend is introduced

## Styling stack

```txt
MUI Theme     → tokens, Button/Table defaults
Tailwind      → layout utilities in SCSS via @apply
SCSS modules  → *.module.scss per component
```

Design tokens in `tailwind.config.ts`: `canvas`, `surface`, `line`, `ink`, `muted`, `status-on`, `status-off`.

## Extension points

| Future feature | Where to add |
|----------------|--------------|
| Persist uploads | New service + optional API; extend ActivityContext |
| Per-associate schedule blocks | Extend `ScheduleBlock.appliesTo` + filter in `applyScheduleBlocksToTimeline` |
| Configurable off-task threshold | `activity.constants.ts` + UI setting in context |
| Export report | New hook + component; reuse `filteredAnalysis` |
| Multi-file compare | Extend context model; new dashboard section |
| URL deep-linking | Sync `view` + `loginId` + filters to query params |
