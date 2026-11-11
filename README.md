# Marathon Training App

Full-stack portfolio MVP for marathon training: set a race goal, get a rule-based multi-week plan, view workouts on a calendar, log runs, and track planned vs actual progress.

**Not included (by design):** AI coaching, Strava/Garmin, GPX uploads, realtime sync.

## Stack

| Layer | Tech |
| --- | --- |
| Web | Next.js (App Router), React, Tailwind CSS |
| API | NestJS, Passport JWT, class-validator, Swagger |
| Data | PostgreSQL, Prisma |
| Monorepo | pnpm workspaces (`apps/web`, `apps/api`) |

```text
Browser  →  Next.js (apps/web)
                ↓  REST + Bearer JWT
             NestJS (apps/api)  /api/v1
                ↓
             Prisma → PostgreSQL
```

API client code on the web app is generated from Swagger with [Orval](https://orval.dev/).

## Prerequisites

- Node.js 20+
- [pnpm](https://pnpm.io/) 10+
- PostgreSQL 16 (local install **or** Docker via `docker-compose.yml`)

## Environment

Copy the example env files and fill in real values (never commit `.env` / `.env.local`):

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

| App | File | Variables |
| --- | --- | --- |
| API | `apps/api/.env` | `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`, `CORS_ORIGIN` |
| Web | `apps/web/.env.local` | `NEXT_PUBLIC_API_URL` (base host only; paths already include `/api/v1`) |

## Local setup

1. **Database**

   With Docker (Postgres on port **5433**):

   ```bash
   docker compose up -d
   ```

   Or point `DATABASE_URL` at your own Postgres instance.

2. **Install**

   ```bash
   pnpm install
   ```

3. **Migrate**

   ```bash
   cd apps/api
   pnpm exec prisma migrate dev
   cd ../..
   ```

4. **Run**

   In two terminals from the repo root:

   ```bash
   pnpm dev:api
   pnpm dev:web
   ```

| Service | URL |
| --- | --- |
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Swagger UI | http://localhost:3001/api/docs |
| OpenAPI JSON | http://localhost:3001/api/docs-json |

## Scripts (repo root)

| Script | Description |
| --- | --- |
| `pnpm dev:web` | Next.js dev server |
| `pnpm dev:api` | NestJS watch mode |
| `pnpm generate:api` | Regenerate Orval client from Swagger (`NEXT_PUBLIC_API_URL` / docs must be reachable) |

## Demo flow

1. **Register** → `/register`, then **Login** → `/login`
2. **Onboarding** → create one active marathon goal (race date, baselines, 3–5 days/week)
3. **Plan** → generate / view the rule-based training plan
4. **Calendar** → browse the week; open a workout detail
5. **Runs** → log a run (linked to a workout or standalone)
6. **Progress** / **Dashboard** → planned vs actual mileage and race countdown

Auth token is stored in `localStorage` for the MVP (Bearer header via the Orval mutator).

## Project layout

```text
apps/
  api/                 NestJS API + Prisma
    prisma/            schema + migrations
    src/
      auth/
      race-goals/
      training-plans/  includes PlanGeneratorService
      workouts/
      run-logs/
      progress/
  web/                 Next.js App Router
    src/app/
      (auth)/          login, register
      (app)/           dashboard, onboarding, plan, calendar, workouts, runs, progress
    src/lib/api/       Orval-generated client + mutator
```

## Regenerating the API client

With the API running:

```bash
pnpm generate:api
```

This refreshes `apps/web/src/lib/api/generated/` from `http://localhost:3001/api/docs-json`.

## License

Private / portfolio project (`ISC` at the workspace root).
