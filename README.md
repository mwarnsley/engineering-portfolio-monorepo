# Engineering Portfolio Monorepo

This repository is a pnpm + Turborepo workspace that keeps the portfolio shell separate from the demo apps it showcases.

## What lives here

- `apps/portfolio`: the shell app that renders the portfolio experience and the embedded demo preview route
- `apps/*`: preserved demo apps, each still running with its original framework/tooling
- `packages/project-registry`: the shared typed metadata registry the shell uses to render project cards and demo routes

## Folder structure

```text
.
├── apps/
│   ├── portfolio/
│   ├── react-mash/
│   ├── meeting-application/
│   ├── restaurant-finder/
│   ├── stock-trader/
│   ├── gamespot/
│   ├── movies/
│   └── chat-application/
├── packages/
│   └── project-registry/
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## How the shell works

The portfolio shell no longer uses GitHub API fetches as its primary project source. It now reads curated project metadata from `packages/project-registry`, including slugs, descriptions, tech tags, local dev URLs, preview mode, and source links.

The shell also exposes `/demo/:slug`, which keeps the shell navigation/footer visible and embeds the selected demo app in an `iframe` inside the main content area.

## Prerequisites

- Node.js 20+
- pnpm 10+

## Install

```bash
pnpm install
```

## Run the portfolio shell

```bash
pnpm dev
```

The shell runs at `http://localhost:3000`.

The demo ports are intentionally fixed for iframe preview. If one of those ports is already in use,
free it before starting the app.

## Run the shell and all demos together

```bash
pnpm dev:all
```

This starts the portfolio plus every app registered in the showcase. Some demos still require their
own env vars or backend services to work fully, but this is the fastest way to make the shell's
`Launch in New Tab` links and iframe previews available at once.

## Run a demo app

Use pnpm path filters from the repo root:

```bash
pnpm --filter ./apps/react-mash dev
pnpm --filter ./apps/meeting-application dev
pnpm --filter ./apps/restaurant-finder dev
pnpm --filter ./apps/stock-trader dev
pnpm --filter ./apps/gamespot dev
pnpm --filter ./apps/movies dev
pnpm --filter ./apps/chat-application dev
```

Verified local dev URLs:

- `apps/react-mash`: `http://localhost:3002`
- `apps/meeting-application`: `http://localhost:8000`
- `apps/restaurant-finder`: `http://localhost:3004`
- `apps/stock-trader`: `http://localhost:3006`
- `apps/gamespot`: `http://localhost:3007`
- `apps/movies`: `http://localhost:3008`
- `apps/chat-application`: `http://localhost:3009`

## Using iframe preview

1. Start the portfolio shell.
2. Start the demo app you want to preview.
3. Open `http://localhost:3000/demo/<slug>`.

Example:

```text
http://localhost:3000/demo/react-mash
```

The demo page includes:

- **Launch in New Tab** and **View Source** actions
- a **Desktop / Tablet / Mobile** viewport toggle for previewing breakpoints inside the shell
- a loading skeleton while the iframe boots, plus a "still loading" notice for cold starts
- a fallback banner when the demo cannot be shown, with a "Launch in New Tab" link, a retry
  action, and the app's runtime requirements from the registry

The fallback banner covers these cases:

- **Unreachable server or missing local port**: a `no-cors` reachability probe fails. When the
  shell runs on localhost, the banner shows the exact `pnpm --filter` command that starts the demo.
- **Mixed content**: an HTTPS shell embedding a non-local HTTP URL is blocked up front.
- **Timeout**: the iframe has not loaded after 25 seconds. The iframe stays mounted and recovers
  automatically if it finishes loading.

On localhost the shell embeds each project's `localDevUrl`. Everywhere else it uses
`productionUrl`, falling back to `localDevUrl` when no production URL exists.

## Environment files

- Real `.env` files are not kept in the final repo state.
- Safe `.env.example` files are committed where an app expects environment variables.
- Copy the example file to `.env` inside the specific app only when you need to run that app.

Apps with env setup:

- `apps/meeting-application/.env.example`
- `apps/restaurant-finder/.env.example`
- `apps/stock-trader/.env.example`
- `apps/gamespot/.env.example`
- `apps/movies/.env.example`
- `apps/portfolio/.env.example`

## Adding a new project

1. Add the app under `apps/`.
2. Add a metadata entry in `packages/project-registry/src/index.ts`.
3. Include its `slug`, `title`, `description`, `framework`, `tags`, `appPath`, `localDevUrl`,
   `productionUrl`, `runtimeRequirements`, and source information.
4. Mark it `featured: true` if it should show up in the portfolio shell.

## Verification

Run these from the repository root:

```bash
pnpm run typecheck   # turbo run typecheck
pnpm run lint        # turbo run lint
pnpm run test        # turbo run test (portfolio uses Vitest + React Testing Library)
pnpm run build       # turbo run build
```

## Agent guidelines

Coding agents follow [`AGENTS.md`](./AGENTS.md). [`CLAUDE.md`](./CLAUDE.md) defers to it. Feature
phases are logged in [`FEATURES.md`](./FEATURES.md).

## Caveats

- `meeting-application` requires a MongoDB connection string.
- `restaurant-finder` requires a Geoapify API key and runs both a Vite frontend and an Express backend.
- `chat-application` runs a Vite client plus a Socket.IO/Express server.
- `gamespot`, `movies`, and `stock-trader` depend on third-party API keys for live data, though some apps have local fallback behavior.
