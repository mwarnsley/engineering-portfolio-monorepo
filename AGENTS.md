# AGENTS

Operational specification for every coding agent, model, and session working in this monorepo.
`CLAUDE.md` defers to this file.

## Workspace Anatomy

- Toolchain: pnpm workspaces (`pnpm-workspace.yaml`) + Turborepo (`turbo.json`).
- `apps/portfolio`: React 19 + Vite + Tailwind CSS v4 shell. Reads typed project metadata from the
  registry and embeds live demos at `/demo/:slug` via iframes.
- `packages/project-registry` (`@engineering-portfolio/project-registry`): single source of truth for
  project slugs, metadata, technology stacks, runtime requirements, and demo URLs.
- Sub-apps (each owns its own framework, config, and deploy target):

  | App                        | Stack                            | Local port |
  | -------------------------- | -------------------------------- | ---------- |
  | `apps/react-mash`          | React + Redux Toolkit            | 3002       |
  | `apps/restaurant-finder`   | React/Vite + Express (Geoapify)  | 3004       |
  | `apps/stock-trader`        | Vue 3 + Pinia (Finnhub)          | 3006       |
  | `apps/gamespot`            | Vue 3 (RAWG)                     | 3007       |
  | `apps/movies`              | Vue 3 (TMDB)                     | 3008       |
  | `apps/chat-application`    | React client + Express/Socket.IO | 3009       |
  | `apps/meeting-application` | Next.js App Router + Mongoose    | 8000       |

  The registry's `localDevUrl` values are authoritative if this table drifts.

## Operating Principles

- Read before write. Inspect the target package, its `package.json`, and any config it owns before
  changing it.
- Respect package boundaries. Do not change a sub-app's framework, build config, or Turbo pipeline
  unless the task explicitly requires it. Additive changes (a new script or task) are preferred over
  edits to existing ones.
- Never run `git commit`, `git push`, or any history-rewriting git command autonomously. Leave changes
  in the working tree for the owner to review.
- Protect local work. Do not discard, stash, or overwrite uncommitted changes you did not make.
- Never commit secrets. `.env` files and API tokens (TMDB, RAWG, Finnhub, Geoapify, MongoDB URIs) stay
  out of source. Document required variables in each package's `.env.example` instead.
- Registry encapsulation. Consumers read project data only through
  `@engineering-portfolio/project-registry`. Never hand-copy slugs, URLs, or tech stacks into a
  consumer. If a consumer needs a new field, add it to `ProjectRecord`.
- Keep diffs minimal and atomic. Work in small phases and record each feature phase in `FEATURES.md`.
- Use the `@/` path alias inside `apps/portfolio` instead of deep relative imports.

## Design System & Visual Standards (`apps/portfolio`)

- Aesthetic: refined, neutral dark mode in the Linear / Vercel style. Zinc foundations, hairline
  borders, restrained motion, crisp sans-serif typography, and one restrained brand hue for emphasis.
- All color comes from the CSS variables in `apps/portfolio/src/index.css`, exposed as Tailwind tokens
  (`bg-background`, `text-muted-foreground`, `border-border`, `text-brand`, `text-success`, and so on).
  Do not use raw hex or `rgba()` values or un-tokenized color overrides in components.
- Do not use arbitrary pixel values (`text-[10px]`, `w-[390px]`, `shadow-[0_0_10px_...]`). Use the
  Tailwind scale or add a named token.
- Contrast: body and muted text must meet WCAG AAA (7:1) against the surface they sit on. Large
  display text must meet at least 4.5:1. Verify new tokens in both dark and light themes.
- Accessibility (Section 508 / WCAG): visible `focus-visible` rings on every interactive element,
  accessible names on icon-only controls, `aria-pressed` or `aria-checked` on toggles,
  `aria-live` regions for async status, decorative icons marked `aria-hidden`, and support for
  `prefers-reduced-motion`.
- Copy is professional engineering language. No sci-fi, terminal-roleplay, or video-game phrasing.

## Error Handling & Resilience Contract

- Demo iframes in `apps/portfolio` must never crash the shell. Handle these cases with a visible,
  recoverable UI:
  - slow cold starts (a loading skeleton, then a "still loading" notice),
  - unreachable servers or missing local dev ports (a fallback banner),
  - blocked mixed content (an HTTPS shell embedding an HTTP demo, detected up front),
  - hard timeouts (a fallback banner while the iframe stays mounted in case it recovers).
- Every fallback offers a "Launch in New Tab" link and explains the demo's runtime requirements
  (sourced from the registry).
- Sub-apps that depend on third-party APIs (TMDB, RAWG, Finnhub, Geoapify) or databases should
  degrade to mock data or an explanatory empty state when keys or endpoints are unavailable,
  rather than throwing.

## Testing Standards

- `apps/portfolio` uses Vitest, React Testing Library, and `@testing-library/user-event`.
- Render components through `@/test/test-utils` (it wraps the router), not RTL's raw `render`.
- Prefer small, atomic `it` blocks with one to three assertions. Use `test.each` matrices for pure
  logic. Cover accessibility behavior (roles, names, pressed and live states), not only rendering.
- Co-locate tests with the code they cover. New logic ships with tests.

## Verification Contract

Run these from the repository root before reporting completion:

```bash
pnpm run typecheck   # turbo run typecheck  (tsc --noEmit per package that defines it)
pnpm run lint        # turbo run lint
pnpm run test        # turbo run test
pnpm run build       # turbo run build
```

For a faster loop scoped to the shell, run `pnpm --filter ./apps/portfolio <script>`.
If a command cannot run (for example a sub-app needs secrets to build), say so explicitly. Never
report it as passing.

## Completion Output Protocol

Every task ends with a report containing these sections:

1. **File Change Rundown**: each created or modified file with a one-line purpose.
2. **Package / Config Rundown**: dependencies, scripts, and config changes (or "none").
3. **Tests Updated**: new or changed test files and what they cover.
4. **Verification Results**: the exact commands run and their real outcome.
5. **Step-by-Step Validation Guide**: how a human can confirm the change in the running app.
6. **Remaining Risks**: known gaps, assumptions, and follow-ups.
