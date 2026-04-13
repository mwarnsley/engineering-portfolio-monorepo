# Real-Time Chat Simulator

A lightweight portfolio project that demonstrates real-time messaging with a dual-user interface.
This app lives inside the monorepo at `apps/chat-application` and keeps its React client and
Socket.IO/Express server together.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Node.js
- Express
- Socket.IO
- Vitest
- React Testing Library

## Features

- Dual chat panels for User A and User B
- Real-time message delivery over Socket.IO
- Typing indicators
- Connection status badges
- Message timestamps
- Clear chat/reset action
- Responsive layout that stacks on smaller screens

## Project Structure

```text
client/
  src/
  tests/
server/
  src/
  tests/
```

## Install

```bash
pnpm install
```

## Run Locally

```bash
pnpm --filter ./apps/chat-application dev
```

- Client: `http://localhost:3009`
- Server: `http://localhost:3010`

You can also run `pnpm dev` from inside `apps/chat-application`.

## Scripts

- `pnpm --filter ./apps/chat-application dev`
- `pnpm --filter ./apps/chat-application build`
- `pnpm --filter ./apps/chat-application preview`
- `pnpm --filter ./apps/chat-application lint`
- `pnpm --filter ./apps/chat-application test`
- `pnpm --filter ./apps/chat-application format`

## Testing

```bash
pnpm --filter ./apps/chat-application test
```

## Notes

- The React client connects to the local Socket.IO server at `http://localhost:3010`.
- `Open Full Demo` from the shell will only work when both the client and server are running.
