# Features

A running log of feature phases. Every feature phase appends an entry here.

## Phase 1: Agent Guardrails

- Added `CLAUDE.md` (defers to `AGENTS.md`) and `AGENTS.md`, which define the monorepo's operating
  principles, design system rules, resilience contract, testing standards, verification commands,
  and completion protocol.

## Phase 2: Portfolio Modernization & Demo Hardening

- **Resume alignment**: the hero and CLI copy say "10+ years". Added Understood.org (Senior Frontend
  Engineer, Contractor, August 2026 to Present, Remote) as the current role, and MilliporeSigma is
  now dated October 2023 to June 2026.
- **Visual redesign**: replaced the neon cyberpunk theme with a neutral zinc palette in the Linear /
  Vercel style, using AAA-contrast tokens for dark and light themes, the Geist typeface, and
  professional section naming ("Core Stack & Systems", "Featured Applications & Sandboxes",
  "Career Experience").
- **Demo viewer resilience** (`/demo/:slug`):
  - a loading skeleton while the iframe boots, then a "still loading" notice for cold starts,
  - a fallback banner for unreachable servers, missing local ports, mixed-content blocks, and
    timeouts, with a "Launch in New Tab" link and the runtime requirements from the registry,
  - a Desktop / Tablet / Mobile viewport toggle.
- **Registry**: added `runtimeRequirements` to `ProjectRecord`. Slug lookups now use an O(1) `Map`
  index.
- **Tooling**: added Vitest + React Testing Library to `apps/portfolio`, plus `typecheck` and
  `test` scripts.

## Phase 3: Visual Polish

- **Hero**: a 24px developer grid at 4% opacity with a soft indigo glow behind the heading, a
  role-centric "Senior Frontend Engineer | Remote" badge, and a balanced two-button CTA row with the
  CLI as a secondary text action.
- **Surface elevation**: raised `#11131c` cards on the `#09090b` canvas, with 80%-opacity zinc
  borders and an indigo hover border. The light theme now uses a `#fafafa` canvas under white cards.
  Shared `surface-card` / `surface-card-interactive` utilities style the capability and project
  cards.
- **Career Experience**: a three-column timeline (a 44-unit date column, a milestone rail, and the
  content). Date ranges wrap only at the dash, dots align with role headings, and the layout stacks
  on mobile.
- **Footer**: the copyright year is computed at runtime (currently 2026).

## Phase 4: Two-Column Hero

- **Ambient depth**: a tokenized `--hero-glow` radial (indigo at 22% opacity in dark mode, 12% in
  light) over the 24px grid, now at 5% opacity.
- **Left column**: a mono kicker, the heading, an enterprise-focused bio, "Explore Architecture" and
  "View Résumé" actions, and an inline CLI link. The floating role badge is removed. Text that sits
  on the glow uses `secondary-foreground` to stay at or above 7:1 at the glow's peak.
- **Right column**: `SystemBlueprintCard`, a glassmorphic key-value card. The hosted app count
  comes from the project registry and the active client from career data. It includes a copyable
  `pnpm install && pnpm dev:all` quickstart with a live-region announcement. Rows switch between
  stacked and side-by-side with container queries.
- **Layout**: two columns from `lg`, stacked below.

## Phase 5: Visual Noise Cleanup

- **Background**: removed the 24px grid entirely. The hero is now a matte `#090a0f` base with a
  single soft top bloom (`ellipse 70% 40%`, indigo at 18% opacity in dark mode, 10% in light).
- **Icons**: replaced the boxed `SquareTerminal` icon with `Terminal`. Removed the decorative icon
  tiles from the capability cards (they read as stray "8 / 4 / B" glyphs at small sizes) and the
  icon in the project "Full stack" badge. Verified that every remaining SVG has drawable paths and
  that Geist covers every non-ASCII character on the page.
- **Hero**: the kicker is now just "Senior Frontend Engineer" (uppercase via CSS). The flex layout
  gives the card a fixed width (24rem at `lg`, 28rem at `xl`) and the text column the rest, so the
  balanced headline renders in two lines from 820px up.
- **Blueprint card**: more padding and spacing between rows and chips. No row wraps at 1024px or
  wider.
- **Capabilities**: each card shows a mono category badge above the capability name.

## Phase 6: Architecture Showcase & Blueprint

- Added required `tier` metadata and optional architecture highlights and solved challenges to the
  project registry. Meeting Application, Chat Application, and Stock Trader are flagship systems;
  the other four demos remain sandboxes.
- Split the project showcase into detailed flagship cards and a compact sandbox grid. Category
  filters, source links, and all seven live demo routes remain available.
- Connected the hero's Explore Architecture CTA and the System Blueprint card to a shared modal
  with a workspace dependency diagram, registry-derived counts, and an interactive app inspector.
- Reused the modal behavior hook for keyboard focus trapping, Escape dismissal, scroll locking,
  and trigger focus restoration. The new modal has no entrance or exit motion.
- Blueprint copy distinguishes configured local caching and package-owned checks from future
  remote-cache setup, shared strict TypeScript/ESLint policy, and automated accessibility auditing.
  Theme tokens belong to the portfolio shell; demos retain independent runtimes and styles.

## Phase 7: Recorded Test Verification Matrix

- Added structured test metadata to the registry, generated from fresh Jest/Vitest JSON reports
  and measured coverage for Meeting Application, Stock Trader, Restaurant Finder, and both chat
  packages. Chat coverage combines covered/total counts rather than averaging percentages.
- Added a navigation-triggered quality inspector with a dated passing/failure/skipped summary,
  per-application suite files and type badges, coverage scope, missing-evidence states, and
  collapsible output captured from an uncached Turborepo run.
- Added a repeatable registry refresh command and parser regression tests. Failed runs are not
  presented as passing; missing or malformed reports preserve the previous dated snapshot.
- Added the matching Vitest V8 coverage provider to Stock Trader and the chat client/server.
  The chat client config explicitly checks both Vite and Vitest types to tolerate distinct pnpm peer instances.
  The inspector reports recorded evidence, not live browser execution or accessibility certification.

## Phase 8: Measured Coverage & Accessible Motion

- Expanded behavioral coverage for Meeting Application, Stock Trader, Restaurant Finder, and both
  chat packages: API failures, database pooling, async cleanup, forms, trading state, routing,
  socket contracts, typing timers, and startup wiring. Coverage scopes and exclusions are unchanged.
- Refreshed the recorded quality inspector from the actual test and coverage reports. Remaining
  gaps are defensive states unreachable through ordinary component lifecycles, plus a Vue
  source-map branch; tests do not manufacture internal React/Vue state to claim 100%.
- Replaced the portfolio's Motion wrapper dependency with direct `framer-motion`. Added reusable
  200ms scroll reveals with an 8px maximum translation, 50ms project staggering, and brief
  architecture backdrop/card transitions. Filtering bypasses entrance replay.
- Reduced motion renders static content and neutralizes active transforms on live OS changes.
  Wrapper hosts stay stable to preserve child state and keyboard focus. Content initially mounted
  with reduced motion stays static until remounted, even if that preference is later disabled.
- Architecture exit content becomes inert and hidden from assistive technology as the modal hook
  restores trigger focus. Added tests for exit focus, reduced motion, preference changes, and filters.
