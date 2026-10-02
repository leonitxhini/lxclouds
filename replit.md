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
- **Routes:** `/` (home), `/work`, `/work/:slug` (case studies) – each also under `/de` and `/sq`. `public/_redirects` provides the SPA fallback.
- **Languages:** English (root), German, Albanian. All copy lives in `src/i18n/{en,de,sq}.ts`; `en.ts` defines the shape, the others must match it. `LocaleProvider` (`src/i18n/index.tsx`) reads the language from the first path segment.
- **Language by country:** `functions/_middleware.js` (Cloudflare Pages Function, repo root) redirects addresses without a language prefix: Germany, Austria and Switzerland → `/de`, Kosovo and Albania → `/sq`, everyone else stays on English. A language picked in the switcher is stored in the cookie `lx-lang` and always wins; crawlers are not redirected. The function only runs for the paths listed in `artifacts/lx-clouds/public/_routes.json` – add new case-study paths there.
- **Projects:** language-independent facts (URLs, brand colours, screenshot files, stack) in `src/data/projects.ts`; texts and results in the i18n files under `projects`.
- **Screenshots and logos** in `public/work/<slug>/` are captured from the live sites – replace them with new captures, never with mock-ups.
- **Hero glass:** a path-traced render, not CSS and not WebGL. `render/hero-glass.py` builds the scene in Blender (Cycles, `pip install bpy`, Python 3.11) – `python render/hero-glass.py plate out.png 1.5 320` renders the backdrop (ribbons, glass plates, orbit lines, sphere shadows), `sphere:a…d` the four spheres at 4×. Results live in `public/hero/` (`glass-plate.webp` 2400×1100 logical, spheres as cut-outs). `Hero.tsx` places them on the 1440px stage; the frame covers stage x −480…1920, y −200…900.
- **Design tokens** in `src/index.css` (`@theme`): paper `#F8F7F4`, ink `#11121B`, accent `#6865FF`. Font: Outfit, self-hosted in `public/fonts`.
- **Contact dialog** posts to web3forms (`src/components/ContactDialog.tsx`); no backend required.
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
