# Project Overview

## Name

**TOT-Tracking** (Workforce Activity Analytics)

## Purpose

MVP dashboard that analyzes warehouse associate scan activity from **AWS QuickSight CSV exports**. Identifies **off-task periods** (gaps between consecutive scans exceeding a threshold). All processing is **client-side only** — no backend, no database, no auth.

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 App Router |
| Language | TypeScript (strict) |
| UI | MUI v7 + Tailwind CSS + SCSS modules |
| Charts | Recharts |
| CSV parsing | PapaParse |
| Dates | date-fns |
| Fonts | Geist Sans, Geist Mono (next/font) |

## Single-page application

- **One route:** `/` (`src/app/page.tsx`)
- **Three client views** (no URL routing): Upload → Dashboard → Associate Detail
- View state in `ActivityContext` (`upload` | `dashboard` | `associate`)

## User flow

1. Land on **Upload** — drag/drop or browse CSV
2. File parsed → analyzed → auto-switch to **Dashboard**
3. Dashboard shows global metrics, charts, associate table
4. Click associate row → **Associate Detail** (timeline, off-task table, summary cards)
5. Header nav: Upload / Dashboard (Dashboard disabled until data loaded)
6. Refresh clears all data (in-memory only)

## What was removed from boilerplate

This project was stripped down from a Next.js MUI boilerplate:

- No Pages Router routes (`/home`, `/intro`)
- No auth (Cognito, tokens, cookies)
- No API layer (`src/apis/`, axios, react-query)
- No Users/Home/Introduction modules
- No `src/configs/request.ts`, `src/context/UserContext`

Legacy files may still exist on disk in some branches — **ignore them**. Active code is under `src/app/` and `src/modules/WorkforceActivity/`.

## Dependencies (runtime)

```json
@mui/material, @mui/icons-material, @emotion/react, @emotion/styled,
next, react, react-dom, date-fns, papaparse, recharts
```
