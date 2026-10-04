# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Artifacts

### `artifacts/lx-clouds` (`@workspace/lx-clouds`)

Personal portfolio of Leonit Xhini (lxclouds.com). React + Vite + Tailwind v4, client-side routing with wouter.

- **Deploy:** Cloudflare Pages project `lxclouds`, connected to this repo. A push to `main` builds (`pnpm --filter @workspace/lx-clouds run build`, output `artifacts/lx-clouds/dist`) and goes live on lxclouds.com.
- **Routes:** `/` (home), `/work`, `/work/:slug` (case studies) – each also under `/de` and `/sq`; `/admin` (Studio) and `/d/:slug` (shared demo) without a language prefix. `public/_redirects` provides the SPA fallback.
- **Languages:** English (root), German, Albanian. All copy lives in `src/i18n/{en,de,sq}.ts`; `en.ts` defines the shape, the others must match it. `LocaleProvider` (`src/i18n/index.tsx`) reads the language from the first path segment.
- **Language by country:** `functions/_middleware.js` (Cloudflare Pages Function, repo root) redirects addresses without a language prefix: Germany, Austria and Switzerland → `/de`, Kosovo and Albania → `/sq`, everyone else stays on English. A language picked in the switcher is stored in the cookie `lx-lang` and always wins; crawlers are not redirected. The function only runs for the paths listed in `artifacts/lx-clouds/public/_routes.json` – add new case-study paths there.
- **"What we build" on the home page:** `src/components/home/Designs.tsx` shows the eight demo designs on a dark stage – a browser window and a phone in which a capture of the page travels up and down, the list of industries, and a link to the live demo (`/d/vorlage-<id>`). Data in `src/data/designs.ts` (invented demo names, accent colours, capture heights), captures in `public/showcase/` (`<id>.webp` full desktop page, `<id>-m.webp` top of the phone page), texts under `designs` in the i18n files. The designs are labelled as examples, not client work.
- **Projects:** language-independent facts (URLs, brand colours, screenshot files, stack) in `src/data/projects.ts`; texts and results in the i18n files under `projects`.
- **Screenshots and logos** in `public/work/<slug>/` are captured from the live sites – replace them with new captures, never with mock-ups.
- **Hero glass:** a path-traced render, not CSS and not WebGL. `render/hero-glass.py` builds the scene in Blender (Cycles, `pip install bpy`, Python 3.11) – `python render/hero-glass.py plate out.png 1.5 320` renders the backdrop (ribbons, glass plates, orbit lines, sphere shadows), `sphere:a…d` the four spheres at 4×. Results live in `public/hero/` (`glass-plate.webp` 2400×1100 logical, spheres as cut-outs). `Hero.tsx` places them on the 1440px stage; the frame covers stage x −480…1920, y −200…900.
- **Design tokens** in `src/index.css` (`@theme`): paper `#F8F7F4`, ink `#11121B`, accent `#6865FF`. Font: Outfit, self-hosted in `public/fonts`.
- **Contact dialog** (`src/components/ContactDialog.tsx`) sends each message twice: by e-mail through web3forms and into the Studio's enquiry list (`/api/public/inquiries`). One of the two succeeding counts as sent.

#### LX Studio (`/admin`) – the back office

German-language admin area for the owner only: overview, clients (pipeline, notes, history), demo websites, templates, own projects, tasks, enquiries, settings. Lives in the same app, loaded lazily, outside the public header/footer (`App.tsx`).

- **Backend:** Cloudflare Pages Functions in `functions/api/[[path]].js` (one file, small router) with D1 (`DB`, database `lxclouds`) and R2 (`MEDIA`, bucket `lxclouds-media`, uploaded demo images, served by `functions/media/[[key]].js`). Bindings come from `wrangler.toml` in the repo root.
- **Schema:** `migrations/0001_studio.sql` … `0004_folios.sql`. Apply changes with `npx wrangler d1 migrations apply lxclouds --remote` – run wrangler from the repo, never from the home directory.
- **Login:** e-mail + password (PBKDF2-SHA256, 100,000 rounds), session cookie `lx_studio` (HttpOnly, Secure, SameSite=Strict, 30 days; only its hash is stored). Every writing request needs the header `X-Studio: 1` and a matching Origin. Logins are limited to 8 attempts per 15 minutes and IP. Create or reset a user: `node scripts-studio/hash-password.mjs <email> <name> <password>` prints the SQL for `wrangler d1 execute lxclouds --remote --command "…"`.
- **Demo websites:** a demo is one JSON document (`src/demo/types.ts`: company data, theme, list of blocks). Demos size themselves with container queries, so the phone preview in the editor is the real phone layout.
- **Design languages ("skins"):** `theme.skin` picks one of eight (`noir`, `osteria`, `werk`, `aurelia`, `park`, `linden`, `maison`, `klar`). Each is one file in `src/demo/skins/` with its own renderer per block type, loaded as its own chunk; block types a skin does not restyle fall back to the plain blocks in `src/demo/blocks.tsx`. Fixed colours per skin and mode are in `skins/palettes.ts`, the brand colour (`--p`), font and corner radius stay the user's choice. Shared pieces (stars, drawn map, before/after slider) are in `skins/kit.tsx`. Inside `cn()` a font-size class drops an earlier `leading-*` – put the line height after the size.
- **Templates:** one file per industry in `src/demo/templates/` (list, picker library and empty blocks in `src/demo/templates.ts`). Every template uses one skin. Photos are in `public/demo-assets/<industry>/`: `n-*.webp` were generated with ChatGPT image generation from the design references of 2 October 2026, the others are Unsplash photos (`SOURCES.txt`); `preview.webp` is a capture of the template's first screen.
- **Templates without login:** `/d/vorlage-<id>` renders a built-in template (`?firma=`, `?modus=hell|dunkel`, `?farbe=rrggbb`, `?stil=<skin>` change name, mode, colour and skin).
- **Editor** (`src/admin/editor/Editor.tsx`): texts and images are changed directly in the preview (`src/demo/edit.tsx`), with undo/redo, autosave, device preview, colour/font/corner settings, notes, named snapshots ("Stände"), presentation mode (full screen with a small floating bar) and sharing.
- **Design boards ("Entwürfe", `/admin/entwuerfe`):** sets of design images for a client meeting. `src/admin/pages/Boards.tsx` (list, one collection with upload, rating, notes, summary) and `src/admin/boards/Presenter.tsx` (full-screen view: fitted image, click to zoom, numbered marks placed on the image with a change request each, favourite / maybe / out, two designs side by side, arrow keys and swipe). Tables `boards` and `board_items` (`migrations/0002_boards.sql`, `0003_board_brief.sql`), routes `/api/boards` and `/api/board-items`; images are ordinary uploads in R2. Marks have a kind (keep, colour, smaller, bigger, image, text, remove, other – `src/admin/boards/model.ts`); a colour mark can take its colour from any design with the pipette, an image mark can carry an uploaded example. Per aspect (logo, colours, type, images, layout, name) one design can be chosen as the winner (`boards.picks`). `src/admin/boards/Briefing.tsx` is the order sheet: direction, mix, changes with the marked image, an offer with line items (`boards.offer`) and the client's signature (`boards.signoff`); it prints as a document (print styles hide `#root`).
- **Project folios ("Projektmappen", `/admin/mappen`):** everything an agency team would work out for a client, in ten disciplines (`src/folio/roles.ts`): goal, audiences and positioning, competitors, name and domain, design, content, Google, channels, legal, technology, plan, offer. `src/folio/generate.ts` builds a first version from a playbook per industry (`src/folio/playbooks.ts`: audiences, search terms, channels, legal dos and don'ts …) and the wizard input; every text can then be edited in place. Live checks run server-side in `lib/sitecheck.mjs` (also usable from Node): domain availability via RDAP (DENIC for .de, Verisign for .com/.net, rdap.org otherwise) and a website check (reachability, speed, mobile, Google basics, contact paths, legal pages → score 0–100); Google PageSpeed (mobile) is called from the browser. The folio follows the meeting: first the design drafts as a large gallery (images from a design board, favourites can be set during the presentation), then name and web address as a marketing check (`src/folio/strength.ts`: six criteria – fits the brand ×3, trust of the ending ×2, no look-alike owned by someone else ×2, memorable, phone test, grows with the business – a 0–10 score and a verdict per address), then how new customers find the business (a four-step journey and the channels in columns Zuerst / Danach / Später with cost and effect), the competition (ranked cards with what each site does well and badly, plus the gaps most competitors share) and plan & costs (three weeks, packages with suggested prices, payback calculation). Each chapter: one big answer, three reasons, the main content; everything else under „Mehr Details“. `src/folio/Folio.tsx` renders it, `src/folio/Present.tsx` shows it as slides. Shared read-only at `/m/<slug>` (`src/pages/FolioPublic.tsx`). Table `folios` (`migrations/0004_folios.sql`), routes `/api/folios`, `/api/tools/domains`, `/api/tools/audit`, `/api/public/folios/<slug>`.
- **Sharing:** a demo with the public link switched on is readable at `/d/<slug>` (`src/pages/DemoPublic.tsx`, noindex). Switched off, the address answers "not available".
- **Local test:** `pnpm --filter @workspace/lx-clouds run build`, `npx wrangler d1 migrations apply lxclouds --local`, then `npx wrangler pages dev artifacts/lx-clouds/dist --port 8788`.
- `/admin`, `/d/`, `/m/` and `/api/` are excluded in `robots.txt`; the language redirect skips `/api/` and `/media/`.
- Name, email and social links: `src/data/site.ts`.

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

### Wissen (/admin/wissen)

Plain how-to guides for Leonit, opened from the admin navigation (`src/admin/pages/Knowledge.tsx`). The first one, "Kunden-Domain in mein Cloudflare holen", is a numbered list of what to do: ask the client, add the domain to Cloudflare, check the mail records, note the nameservers, change them at Strato/IONOS, wait for "Aktiv", connect the Pages project, redirect a second domain, test, add the site to the Google profile. Step 3 has an optional helper (`POST /api/tools/dns`, `inspectDomain` in `lib/sitecheck.mjs`) that shows a domain's provider, mail provider and the records that must exist in Cloudflare.

### Besprechungen (/admin/besprechungen)

Everything prepared for a client on one page, opened together with him to decide what to take (`src/admin/meeting.ts`, `src/admin/pages/Meetings.tsx`; stored in D1 `talks`, migration 0005). One topic at a time: a step bar on top (with how many points are decided), the topic in the middle, the live choice on the right, "Weiter" to the next topic and a final "Ergebnis" step (decided per topic, what is still open, next steps, text to send). Two modes: "Vorbereiten" (edit titles, texts, prices, add or remove points and sections, pull drafts from Entwürfe) and "Mit dem Kunden" (clean view). Section kinds: drafts (image cards: Gefällt / Vielleicht / Nein + note), choices (one of several, e.g. name & address or package: "Das nehmen wir"), lists (Nehmen / Vielleicht / Nein, or custom labels like "Ist da / Kommt noch" for material). The sticky "Unsere Auswahl" panel shows the chosen package price and everything taken so far; "Zusammenfassung" turns it into plain text; "Nächste Schritte" holds to-dos for me and the client. New meetings start with sensible default sections and the client's drafts; replaces Projektmappen in the navigation (folios stay reachable from the client page).
