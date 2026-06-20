# TOT-Tracking — Agent Handoff

This folder is the **source of truth** for AI agents working on this project.

## Read order

1. [PROJECT-OVERVIEW.md](./PROJECT-OVERVIEW.md) — what the app does, tech stack, how to run
2. [BUSINESS-RULES.md](./BUSINESS-RULES.md) — domain logic (gaps, severity, utilization)
3. [ARCHITECTURE.md](./ARCHITECTURE.md) — folder structure, data flow, patterns
4. [FEATURE-MAP.md](./FEATURE-MAP.md) — files, components, hooks, services
5. [DATA-MODELS.md](./DATA-MODELS.md) — TypeScript models and computed types
6. [IMPLEMENTATION-NOTES.md](./IMPLEMENTATION-NOTES.md) — decisions, gotchas, history
7. [CODE-SNIPPETS.md](./CODE-SNIPPETS.md) — copy-paste patterns

## Cursor rules

Active rules live in `.cursor/rules/`:

| Rule | Purpose |
|------|---------|
| `core-architecture.mdc` | Module-first architecture, separation of concerns |
| `project-structure.mdc` | Folder ownership |
| `nextjs-app.mdc` | App Router, single-page SPA |
| `workforce-activity.mdc` | Module-specific business + extension rules |
| `styling.mdc` | MUI + Tailwind + SCSS modules |
| `code-style.mdc` | TypeScript, imports, naming |

**Not applicable to this MVP** (boilerplate leftovers — do not implement unless requested):

- `auth-flow.mdc`
- `api-structure.mdc`
- `forms.mdc`
- `cursor-pagination.mdc`
- `nextjs-pages.mdc`

## Design skills

Visual direction follows `.cursor/.agents/skills/minimalist-ui/SKILL.md`:

- Warm monochrome palette (`#F7F6F3` canvas, `#2F3437` ink, `#111111` primary)
- Flat 1px borders (`#EAEAEA`), minimal shadows
- Geist Sans + Geist Mono
- Tabular nums for metrics/timestamps

## Quick commands

```bash
npm run dev    # http://localhost:3000
npm run build
```

Sample data: `sample-data/workforce-activity-sample.csv`
