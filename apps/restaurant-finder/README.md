# Restaurant Finder

A React + Vite + Express restaurant search app powered by Geoapify. This app lives inside the
monorepo at `apps/restaurant-finder`.

## Stack

- React 19
- TypeScript
- Vite
- HeroUI
- Axios
- Express
- Jest
- React Testing Library

## Features

- Search restaurants by city, zip, or current location
- Route-based restaurant details
- Client-side cuisine and price filters
- Express proxy so the API key stays server-side

## Install

```bash
pnpm install
```

## Environment Setup

```bash
cp apps/restaurant-finder/.env.example apps/restaurant-finder/.env
```

Set:

```env
GEOAPIFY_API_KEY=your_geoapify_api_key
PLACES_API_URL=https://api.geoapify.com/v2/places
PLACE_DETAILS_API_URL=https://api.geoapify.com/v2/place-details
PORT=3005
```

## Run Locally

```bash
pnpm --filter ./apps/restaurant-finder dev
```

- Frontend: `http://localhost:3004`
- Backend: `http://localhost:3005`

## Scripts

- `pnpm --filter ./apps/restaurant-finder dev`
- `pnpm --filter ./apps/restaurant-finder build`
- `pnpm --filter ./apps/restaurant-finder start`
- `pnpm --filter ./apps/restaurant-finder test`
- `pnpm --filter ./apps/restaurant-finder format`
- `pnpm --filter ./apps/restaurant-finder format:check`

## Testing

```bash
pnpm --filter ./apps/restaurant-finder test
```

## Notes

- `.env` is ignored by git; only `.env.example` is committed.
- `Open Full Demo` from the shell only works when both the Vite frontend and Express backend are running.
