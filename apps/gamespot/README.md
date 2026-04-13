# Gamespot

A Vue 3 game discovery app powered by the RAWG API. This app lives inside the monorepo at
`apps/gamespot`.

## Features

- Debounced game search powered by the RAWG API
- Responsive game grid with image, title, rating, and platforms
- Game details page with description, release date, rating, genres, and screenshots
- Favorites saved locally with Pinia and `localStorage`
- Loading, empty, and error states

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Tailwind CSS
- Axios
- Vitest
- Vue Test Utils

## Install

```bash
pnpm install
```

## Environment Setup

```bash
cp apps/gamespot/.env.example apps/gamespot/.env
```

Set:

```env
VITE_RAWG_API_KEY=your_rawg_api_key
```

## Run Locally

```bash
pnpm --filter ./apps/gamespot dev
```

The app runs on `http://localhost:3007`.

## Scripts

- `pnpm --filter ./apps/gamespot dev`
- `pnpm --filter ./apps/gamespot build`
- `pnpm --filter ./apps/gamespot preview`
- `pnpm --filter ./apps/gamespot test`
- `pnpm --filter ./apps/gamespot test:ui`
- `pnpm --filter ./apps/gamespot lint`

## Testing

```bash
pnpm --filter ./apps/gamespot test
```

## Notes

- `.env` is ignored by git; only `.env.example` is committed.
- If the RAWG key is missing, API-backed screens will fail until the env file is configured.
