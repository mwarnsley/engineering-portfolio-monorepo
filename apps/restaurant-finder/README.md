# Restaurant Finder

A React + Vite restaurant search app powered by Geoapify. This app lives inside the monorepo at
`apps/restaurant-finder`.

## Stack

- React 19
- TypeScript
- Vite
- HeroUI
- Axios
- Jest
- React Testing Library

## Features

- Search restaurants by city, zip, or current location
- Route-based restaurant details
- Client-side cuisine and price filters
- Server-side Geoapify proxy routes so the API key stays server-side

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

Required for deployed Vercel API routes:

- `GEOAPIFY_API_KEY`

Optional overrides:

- `PLACES_API_URL`
- `PLACE_DETAILS_API_URL`

Not used by the current implementation:

- `PROJECT_ID`

## Run Locally

```bash
pnpm --filter ./apps/restaurant-finder dev
```

- Frontend: `http://localhost:3004`
- Backend/API proxy: `http://localhost:3005`

For Vercel deploys, requests to `/api/health`, `/api/restaurants`, and
`/api/restaurants/:restaurantId` are handled by serverless functions in `apps/restaurant-finder/api`.

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
- `server.js` is still used for local development and local production-style runs.
- Vercel does not use `server.js`; it uses the serverless handlers in `api/`.
