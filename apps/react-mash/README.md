# React-MASH

A modernized MASH game built with React, TypeScript, Redux Toolkit, and styled-components. This app
lives inside the monorepo at `apps/react-mash`.

## Tech Stack

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Redux
- styled-components

## Install

```bash
pnpm install
```

## Run Locally

```bash
pnpm --filter ./apps/react-mash dev
```

The app runs on `http://localhost:3002`.

## Scripts

- `pnpm --filter ./apps/react-mash dev`
- `pnpm --filter ./apps/react-mash start`
- `pnpm --filter ./apps/react-mash build`
- `pnpm --filter ./apps/react-mash preview`

## Notes

- The main app component is `src/Mash.tsx`.
- Build output goes to `dist/` and should not be committed.
