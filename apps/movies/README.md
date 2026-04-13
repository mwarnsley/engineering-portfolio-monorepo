# Movies

A Vue 3 movie discovery app powered by TMDB. This app lives inside the monorepo at `apps/movies`.

## Features

- Popular movie listings
- Search by movie title
- Featured hero content
- Movie details with cast and metadata

## Tech Stack

- Vue 3
- Vite
- Vue Router
- Vitest
- Vue Test Utils
- TMDB API

## Install

```bash
pnpm install
```

## Environment Setup

```bash
cp apps/movies/.env.example apps/movies/.env
```

Set:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_TMDB_API_URL=https://api.themoviedb.org/3/
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p/
```

## Run Locally

```bash
pnpm --filter ./apps/movies dev
```

The app runs on `http://localhost:3008`.

## Scripts

- `pnpm --filter ./apps/movies dev`
- `pnpm --filter ./apps/movies build`
- `pnpm --filter ./apps/movies preview`
- `pnpm --filter ./apps/movies test`
- `pnpm --filter ./apps/movies test:watch`

## Testing

```bash
pnpm --filter ./apps/movies test
```

## Notes

- `.env` is ignored by git; only `.env.example` is committed.
- The app will show an error state if `VITE_TMDB_API_KEY` is missing or invalid.
