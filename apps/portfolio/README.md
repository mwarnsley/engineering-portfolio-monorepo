# Engineering Portfolio Shell

The portfolio shell lives at `apps/portfolio` and uses
`@engineering-portfolio/project-registry` for project metadata and demo preview routes.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui
- Framer Motion

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
- The Manifest overlay still downloads `public/resume.pdf` as `Marcus Warnsley - Senior Frontend Engineer.pdf`.

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

## Accessible motion

`MotionReveal` provides a once-only, 200ms scroll reveal with at most 8px of vertical movement.
Project grids stagger cards by 50ms; category changes show results without replaying entrance
animations. The architecture modal fades its backdrop for 150ms and its card for 180ms with a
restrained 0.98-to-1 scale. Motion changes opacity and transforms, not layout dimensions.

The shell respects `prefers-reduced-motion`, including changes while the page is open. Static
content uses ordinary elements when reduced motion is initially enabled. Existing animated
elements remain mounted and immediately target neutral transforms when the preference changes,
preserving focus and child state. Content initially mounted as static stays static until remounted.
The CLI and résumé drawer also disable their transforms under reduced motion.

Validate with `pnpm --filter ./apps/portfolio test`, then open the architecture modal, use Tab,
Shift+Tab and Escape, and toggle the OS Reduce Motion preference while the page is open. Check
both themes and a narrow viewport. Exiting architecture content is inert while focus returns to
the opening control.

## Résumé and layout alignment

The downloadable `public/resume.pdf` is the supplied current résumé, preserved byte for byte.
`src/data.ts` owns résumé-aligned skills, career history, profile details, and education; the CLI
reads the same skills and contact data. Project framework descriptions continue to describe the
actual repository implementations.

The hero and main sections share the `max-w-portfolio` token (90rem). Sandbox cards use four
columns at 2xl and two at medium widths so desktop action buttons have enough room on one row.
