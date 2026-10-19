# Engineering Portfolio Shell

The portfolio shell lives at `apps/portfolio` and uses
`@engineering-portfolio/project-registry` for project metadata and demo preview routes.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui
- Motion

## Install

```bash
pnpm install
```

## Run Locally

```bash
pnpm --filter ./apps/portfolio dev
```

The app runs on `http://localhost:3000`.

## Scripts

- `pnpm --filter ./apps/portfolio dev`
- `pnpm --filter ./apps/portfolio build`
- `pnpm --filter ./apps/portfolio preview`
- `pnpm --filter ./apps/portfolio lint`
- `pnpm --filter ./apps/portfolio format`

## Notes

- Featured projects come from the shared registry instead of GitHub fetch.
- Demo previews are available at `/demo/:slug`.
- Territory Trap public support pages are available at `/territory-trap/privacy` and `/territory-trap/support`.
- `Open Full Demo` uses each project's `localDevUrl`, so the target demo app must be running locally.
- The Manifest overlay still downloads `public/resume.pdf` as `Marcus-Warnsley-Resume.pdf`.

## Architecture showcase

The project registry classifies demos with `tier: 'flagship' | 'sandbox'`. Flagship cards display
`architectureHighlights` and `challengesSolved`; sandbox cards retain compact descriptions and demo
links. Category filters apply to both sections.

Use **Explore Architecture** in the hero or **Open architecture blueprint** in the System Blueprint
card to inspect the workspace diagram, application boundaries, runtime requirements, and quality
strategy. Select an application to update the inspector. Close with Escape, the close button, or
the backdrop; keyboard focus returns to the opening control.

The blueprint describes the checked-in configuration. Remote caching, a shared strict
TypeScript/ESLint policy, and an automated accessibility audit pipeline are follow-ups, not
claims of configured infrastructure or certified conformance.

## Test verification matrix

The **Tests** navigation control opens a keyboard-accessible quality inspector. It displays a
**recorded snapshot**, not a live test service. The scope is Meeting Application, Stock Trader,
Restaurant Finder, and the chat client/server; other applications display an explicit missing-data
state. Suite types describe existing test boundaries. `[API]` is a presentation label for API-route
integration suites; ordinary component tests are not advertised as dedicated accessibility audits.

Refresh the evidence from the repository root after changing those applications:

```bash
pnpm --filter @engineering-portfolio/project-registry refresh:test-matrix
```

This runs the five package test commands with JSON and coverage reporters, then captures a separate
uncached Turbo test run. It regenerates `packages/project-registry/src/generated-test-matrix.ts`.
Review and include that file with source changes when publishing a new snapshot. Raw reports and
logs are saved in the temporary directory printed by the command; local absolute paths and ANSI
formatting are removed from the displayed Turbo summary.

Coverage uses each Jest package's `collectCoverageFrom` configuration and `src/**/*.{ts,tsx,vue}`
for the Vitest packages, including untested source files. Chat percentages are calculated from
summed covered/total counts across client and server. These scopes do not measure every backend
entry point in the entire monorepo. Skipped tests are separate from passed tests. Failed runner
exits produce failed evidence and a nonzero refresh exit; missing/malformed reports leave the
previous snapshot intact and exit with an error. The recorded UTC timestamp identifies freshness.

Run the report normalization regressions with:

```bash
pnpm --filter @engineering-portfolio/project-registry test
```
