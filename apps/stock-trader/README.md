# Stock Trader Pro

A Vue stock trading simulator with Finnhub market data, charting, and local portfolio state. This
app lives inside the monorepo at `apps/stock-trader`.

## Tech Stack

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Tailwind CSS
- Axios
- TradingView Lightweight Charts
- Vitest

## Features

- Live quote loading for a focused basket of large-cap stocks
- Finnhub candle charts with multiple timeframes
- Simulated buy and sell flows
- Local persistence for portfolio, watchlist, and activity
- Fallback market data when the API key is missing or requests fail

## Install

```bash
pnpm install
```

## Environment Setup

```bash
cp apps/stock-trader/.env.example apps/stock-trader/.env
```

Set:

```env
VITE_FINNHUB_API_KEY=your_finnhub_api_key
```

## Run Locally

```bash
pnpm --filter ./apps/stock-trader dev
```

The app runs on `http://localhost:3006`.

## Scripts

- `pnpm --filter ./apps/stock-trader dev`
- `pnpm --filter ./apps/stock-trader build`
- `pnpm --filter ./apps/stock-trader preview`
- `pnpm --filter ./apps/stock-trader test`
- `pnpm --filter ./apps/stock-trader test:ui`
- `pnpm --filter ./apps/stock-trader format`

## Testing

```bash
pnpm --filter ./apps/stock-trader test
```

## Notes

- `.env` is ignored by git; only `.env.example` is committed.
- If no Finnhub key is configured, the app still runs using simulated fallback data.
