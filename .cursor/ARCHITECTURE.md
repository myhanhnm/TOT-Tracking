# Architecture

## High-level data flow

```txt
CSV File (browser)
    ↓
ActivityParserService.parseRows()     ← PapaParse in useCsvUpload hook
    ↓
ScanEvent[]
    ↓
ActivityAnalysisService.analyze()
    ↓
ActivityAnalysisResult (in ActivityContext)
    ↓
Feature hooks (useActivityAnalysis, useAssociateDetail)
    ↓
UI components (no business logic in components)
```

## Layer responsibilities

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Route | `src/app/page.tsx` | Thin wrapper → `<WorkforceActivity />` |
| Layout | `src/app/layout.tsx` | HTML shell, fonts, global styles, providers |
| Providers | `src/app/providers.tsx` | `AppThemeProvider` + `ActivityProvider` |
| Shell | `src/layouts/AppShell/` | Header nav, file name meta |
| Module root | `src/modules/WorkforceActivity/WorkforceActivity.tsx` | View switching |
| Components | `.../components/` | Presentational UI only |
| Hooks | `.../hooks/` | Orchestration, context access |
| Context | `.../context/ActivityContext.tsx` | In-memory app state |
| Services | `.../services/` | Parse + analyze (pure business) |
| Utils | `.../utils/` | Datetime, duration, gaps, severity, timeline |
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

- `view`: `upload` | `dashboard` | `associate`
- `selectedLoginId`: string | null
- `analysis`: `ActivityAnalysisResult | null`
- `fileName`: string | null

## Separation of concerns (strict)

**Components must NOT:**

- Parse CSV
- Calculate gaps or metrics
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
| `src/app/layout.tsx` | Server | Metadata, font loading |
| `src/app/page.tsx` | Server | Thin wrapper |
| `src/app/providers.tsx` | Client | Context providers |
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
| Break/lunch rules | `utils/gapCalculation.ts` or new service method |
| Configurable threshold | `activity.constants.ts` + UI setting in context |
| Export report | New hook + component; reuse analysis result |
| Multi-file compare | Extend context model; new dashboard section |
