# Project Overview

## Name

**TOT-Tracking** (Workforce Activity Analytics)

## Purpose

Supervisor-focused dashboard that analyzes warehouse associate scan activity from **AWS QuickSight CSV exports**. Identifies **off-task periods** (gaps between consecutive scans exceeding a threshold), supports **manual schedule blocks** (paid break, lunch, meeting), and provides filtering, rankings, and timelines. All processing is **client-side only** — no backend, no database, no auth.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 Pages Router |
| Language | TypeScript (strict) |
| UI | MUI v7 + Tailwind CSS + SCSS modules |
| Charts | Recharts |
| CSV parsing | PapaParse |
| Dates | date-fns |
| Fonts | Geist Sans, Geist Mono (next/font) |
| Persistence | `localStorage` for schedule blocks only |

## Single-page application

- **One route:** `/` (`src/pages/index.tsx`)
- **Three client views** (no URL routing): Upload → Dashboard → Associate Detail
- View state in `ActivityContext` (`upload` | `dashboard` | `associate`)

## User flow

1. Land on **Upload** — drag/drop or browse CSV
2. File parsed → analyzed → auto-switch to **Dashboard**
3. **Dashboard** shows:
   - Filters (date, associate, login ID, function, process, unit class, search)
   - Workforce metrics (active, off-task, breaks, meeting, utilization)
   - Schedule block configuration (persisted in `localStorage`)
   - Top associate rankings (off-task, utilization, scan volume)
   - Charts (top 10 off-task, top 10 scans, utilization distribution, gap distribution)
   - Full sortable associate table
4. Click associate row → **Associate Detail** (timeline with 5 segment types, schedule events table, off-task table, summary cards)
5. Header nav: Upload / Dashboard (Dashboard disabled until data loaded)
6. Filters appear on dashboard and associate views; all metrics/charts/tables/timelines respect filters
7. Refresh clears uploaded CSV data (in-memory); schedule blocks persist in `localStorage`

## What was removed from boilerplate

This project was stripped down from a Next.js MUI boilerplate:

- No Pages Router routes (`/home`, `/intro`)
- No auth (Cognito, tokens, cookies)
- No API layer (`src/apis/`, axios, react-query)
- No Users/Home/Introduction modules
- No `src/configs/request.ts`, `src/context/UserContext`

Active code is under `src/pages/` and `src/modules/WorkforceActivity/`.

## Dependencies (runtime)

```json
@mui/material, @mui/icons-material, @emotion/react, @emotion/styled,
next, react, react-dom, date-fns, papaparse, recharts
```
