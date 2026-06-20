Read all files inside `.agent/templates/`.

Generate a new page route in `src/pages/` (Pages Router only).

Requirements:

- thin page architecture
- page only composes module
- use getLayout if needed
- use APP_ROUTES constants
- responsive mobile-first layout
- SEO-ready structure

Pages should:

- define route entry
- optionally define SEO
- optionally define getLayout
- render feature module root

Pages should NOT:

- contain business logic
- call APIs directly
- contain large JSX composition

Use:

- src/ imports
- named exports where possible
- existing layouts
- existing reusable components

Do NOT:

- introduce App Router patterns
- create `src/app/` or use `layout.tsx`/`page.tsx` as route files
- create giant pages
