# TOT-Tracking

**Workforce Activity Analytics** — a client-side dashboard for warehouse supervisors to analyze associate scan activity from AWS QuickSight CSV exports.

Upload a CSV, identify off-task time, configure breaks and meetings, and drill into per-associate shift timelines. No backend, no database, no login required.

---

## What it does

This MVP answers five daily supervisor questions:

1. **Who has the most off-task time?**
2. **Who is the most productive?**
3. **When did off-task events happen?**
4. **How much time was lost?**
5. **What happened during an associate's shift?**

### Core workflow

1. **Upload** — Drag and drop a QuickSight CSV export
2. **Dashboard** — Review workforce metrics, rankings, charts, and filters
3. **Associate detail** — Inspect a single associate's timeline, off-task events, and scheduled breaks

### Features

| Area | Capability |
|------|------------|
| **CSV analysis** | Parse scan events, detect gaps between consecutive scans per associate |
| **Off-task detection** | Flag gaps greater than 10 minutes as off-task |
| **Schedule blocks** | Configure paid breaks, lunch, and meetings; overlay on timeline (saved in `localStorage`) |
| **Filters** | Date, associate name, login ID, function, process, unit class, search |
| **Metrics** | Active time, off-task time, paid/unpaid break, meeting time, utilization %, scan rate |
| **Rankings** | Top off-task, top utilized, top scan volume associates |
| **Charts** | Top 10 off-task, top 10 scan volume, utilization distribution, gap duration distribution |
| **Timeline** | 5 segment types (active, off-task, paid break, unpaid break, meeting) with zoom presets |
| **Tables** | Sortable associate list, off-task events (with severity), schedule events |

### Data handling

- **CSV data** — Processed entirely in the browser; held in memory until page refresh
- **Schedule blocks** — Persisted in `localStorage` across sessions
- **No server** — Nothing is uploaded to a backend; suitable for sensitive workforce data kept on-device

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (Pages Router) |
| Language | TypeScript (strict) |
| UI | [MUI v7](https://mui.com/) + [Tailwind CSS](https://tailwindcss.com/) + SCSS modules |
| Charts | [Recharts](https://recharts.org/) |
| CSV parsing | [PapaParse](https://www.papaparse.com/) |
| Dates | [date-fns](https://date-fns.org/) |
| Fonts | Geist Sans, Geist Mono (`next/font`) |

### Architecture (summary)

```txt
CSV → ActivityParserService → ActivityAnalysisService (+ schedule blocks)
    → ActivityContext (filteredAnalysis)
    → hooks → presentational components
```

- Single route: `/`
- Three client views (no URL routing): `upload` | `dashboard` | `associate`
- Business logic in `src/modules/WorkforceActivity/services/` and `utils/`
- UI components do not parse CSV or calculate metrics

See [`.cursor/ARCHITECTURE.md`](.cursor/ARCHITECTURE.md) for full agent/developer documentation.

---

## Prerequisites

- **Node.js** 18.x or 20.x (LTS recommended)
- **npm** 9+

---

## Local development

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Try sample data

Upload the included sample file:

```txt
sample-data/workforce-activity-sample.csv
```

### 4. Build for production

```bash
npm run build
npm run start
```

### Available scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## CSV format

Export from **AWS QuickSight** with these columns (header names are case-sensitive after trim):

```txt
LoginID, Associate Name, Function, Unit Class, Process, Event Time,
ASIN, Reference, Size, Unit Type, Pack Flow, Pick Process Path, Units
```

Each row is one scan event. The app groups events by associate (`LoginID`), sorts by time, and calculates gaps between consecutive scans.

Supported `Event Time` formats include `yyyy-MM-dd HH:mm:ss` and common US date formats. See `src/modules/WorkforceActivity/utils/datetime.ts`.

---

## Business rules (summary)

| Rule | Value |
|------|-------|
| Off-task threshold | Gap **> 10 minutes** between consecutive scans |
| Severity (off-task only) | Low ≤15m · Medium ≤30m · High >30m |
| Utilization | `Active Time / (Active Time + Off Task Time) × 100` |
| Schedule overlay | Paid break, lunch, and meeting blocks split off-task gaps on the timeline |

Breaks and meetings are **excluded** from the utilization denominator.

Full rules: [`.cursor/BUSINESS-RULES.md`](.cursor/BUSINESS-RULES.md)

---

## Deploy on Vercel

This app is a standard Next.js project with **no required environment variables** for the MVP.

### Option A — Vercel Dashboard (recommended)

1. Push the repository to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Vercel auto-detects **Next.js** — leave defaults:
   - **Build Command:** `npm run build`
   - **Output Directory:** (default — Next.js)
   - **Install Command:** `npm install`
4. Click **Deploy**

No environment variables are needed unless you add features later.

### Option B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow the prompts. For production:

```bash
vercel --prod
```

### Deployment notes

- **Static + SSR:** The app uses the Pages Router; Vercel handles Next.js builds natively
- **No API routes** — Entire MVP runs client-side after the initial page load
- **No secrets** — Do not add API keys unless you introduce a backend
- **Node version:** Vercel uses Node 20.x by default; compatible with Next.js 16
- **Custom domain:** Configure under Project → Settings → Domains in the Vercel dashboard

### Optional environment variables

`.env.example` only documents `NODE_ENV`. Vercel sets this automatically. No `NEXT_PUBLIC_` variables are required today.

---

## Project structure

```txt
src/
├── pages/                        # Pages Router (_app, _document, index)
├── providers/                    # AppProviders (theme + activity context)
├── components/                   # Shared UI (EmptyState, LoadingState, ErrorState)
├── layouts/AppShell/             # App header and navigation
├── modules/WorkforceActivity/    # Entire MVP feature module
│   ├── components/               # Dashboard, timeline, filters, charts, tables
│   ├── hooks/                    # useCsvUpload, useFilteredAnalysis, etc.
│   ├── services/                 # Parser, analysis, filters, charts, schedule storage
│   ├── utils/                    # Gaps, timeline merge, utilization, datetime
│   ├── models/                   # TypeScript domain types
│   ├── constants/                # Thresholds, CSV columns, schedule defaults
│   └── context/                  # ActivityContext (state + filters + schedule blocks)
├── styles/                       # Global SCSS + Tailwind entry
└── theme/                        # MUI theme (Geist fonts)

sample-data/
└── workforce-activity-sample.csv # Demo CSV

.cursor/                          # Agent/developer documentation (architecture, rules)
```

---

## Screens

### Upload

Drag-and-drop zone for QuickSight CSV files. Validates headers and parses rows client-side.

### Dashboard

- Global filters (date, associate, login ID, function, process, unit class, search)
- Workforce metric cards
- Schedule block manager (add/edit/delete breaks and meetings)
- Top associate ranking tables
- Four Recharts visualizations
- Full sortable associate table

### Associate detail

- Summary header with utilization and time breakdown
- Activity timeline (5 segment colors, zoom presets, hover tooltips)
- Schedule events table (paid break, lunch, meeting)
- Off-task summary cards and events table with severity chips

---

## Limitations (MVP)

- No authentication or multi-user access control
- No database — CSV data is lost on refresh
- No URL deep-linking to a specific associate or filter state
- Schedule blocks apply to **all associates** (`ALL_ASSOCIATES` only)
- No export/report download
- Legacy boilerplate files may exist on disk but are not used by the active app

---

## Documentation

| Document | Description |
|----------|-------------|
| [`.cursor/README.md`](.cursor/README.md) | Agent handoff index |
| [`.cursor/PROJECT-OVERVIEW.md`](.cursor/PROJECT-OVERVIEW.md) | Detailed project overview |
| [`.cursor/BUSINESS-RULES.md`](.cursor/BUSINESS-RULES.md) | Domain logic and calculations |
| [`.cursor/ARCHITECTURE.md`](.cursor/ARCHITECTURE.md) | Data flow and layer responsibilities |
| [`.cursor/FEATURE-MAP.md`](.cursor/FEATURE-MAP.md) | File and component reference |

---

## License

Private project. All rights reserved unless otherwise specified by the repository owner.
