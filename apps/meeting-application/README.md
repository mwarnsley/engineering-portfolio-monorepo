# Meeting Hub

A Next.js meeting management platform for scheduling meetings, tracking discussion, and keeping
teams aligned. This app lives inside the monorepo at `apps/meeting-application`.

## Tech Stack

- Next.js 16
- React 19
- Mantine 9
- MongoDB Atlas
- Mongoose
- Jest
- React Testing Library

## Features

- Create, edit, view, and delete meetings
- Calendar-based planning and detail pages
- MongoDB-backed meeting, comment, and action item storage
- Discussion board and API routes

## Install

```bash
pnpm install
```

## Environment Setup

```bash
cp apps/meeting-application/.env.example apps/meeting-application/.env
```

Set:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=8000
```

## Run Locally

```bash
pnpm --filter ./apps/meeting-application dev
```

The app runs on `http://localhost:8000`.

## Scripts

- `pnpm --filter ./apps/meeting-application dev`
- `pnpm --filter ./apps/meeting-application build`
- `pnpm --filter ./apps/meeting-application start`
- `pnpm --filter ./apps/meeting-application seed`
- `pnpm --filter ./apps/meeting-application test`
- `pnpm --filter ./apps/meeting-application test:watch`
- `pnpm --filter ./apps/meeting-application format`
- `pnpm --filter ./apps/meeting-application format:check`

## Testing

```bash
pnpm --filter ./apps/meeting-application test
```

## Notes

- The app requires a valid `MONGODB_URI` even for `build`, because Next.js touches server code at build time.
- If the UI loads with no meetings, seed data with `pnpm --filter ./apps/meeting-application seed`.
