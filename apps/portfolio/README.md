# Engineering Portfolio Shell

The portfolio shell lives at `apps/portfolio` and uses
`@engineering-portfolio/project-registry` for project metadata and demo preview routes.

## Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- shadcn/ui
- Motion

## Install

```bash
pnpm install
```

## Run Locally

```bash
pnpm --filter ./apps/portfolio dev
```

The app runs on `http://localhost:3000`.

## Scripts

- `pnpm --filter ./apps/portfolio dev`
- `pnpm --filter ./apps/portfolio build`
- `pnpm --filter ./apps/portfolio preview`
- `pnpm --filter ./apps/portfolio lint`
- `pnpm --filter ./apps/portfolio format`

## Notes

- Featured projects come from the shared registry instead of GitHub fetch.
- Demo previews are available at `/demo/:slug`.
- `Open Full Demo` uses each project's `localDevUrl`, so the target demo app must be running locally.
- The Manifest overlay still downloads `public/resume.pdf` as `Marcus-Warnsley-Resume.pdf`.
