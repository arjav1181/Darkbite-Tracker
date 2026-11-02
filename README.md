# Darkbite Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=000)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](package.json)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](package.json)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](package.json)

A dark-mode calorie and nutrition tracker. Log a meal by uploading a photo or
describing it in text, and the app uses **Google Gemini** to estimate the
calories and macros. Daily totals, macro breakdown and a food log, all in a
dark UI.

> **Status:** prototype. Storage is in-memory, so entries reset when the
> server restarts. The Drizzle/Postgres schema is defined and ready to wire up.

## What it does

- **Photo logging.** Upload a food photo (jpeg, png, webp, up to 10 MB) and
  Gemini (`gemini-2.5-flash`) extracts the name, description, calories,
  protein, carbs and fat, plus a confidence score.
- **Text logging.** Describe a meal in plain text and get the same breakdown.
- **Daily totals.** Calorie progress against a goal, with macro breakdown bars.
- **Food log.** Every entry kept with its image, timestamp and meal type
  (breakfast, lunch, dinner, snack).
- **Dark UI.** Mobile-first, dark by default, shadcn/ui on Radix primitives.

## Stack

React + TypeScript (Vite) · Express + TypeScript · Tailwind CSS 3 ·
shadcn/ui (Radix) · TanStack Query · Drizzle ORM (schema ready) · Google
Gemini AI. In-memory storage today; Neon/Postgres is the configured migration
path.

## Running it

```bash
export GEMINI_API_KEY=...   # required for photo/text analysis
npm install
npm run dev                 # http://localhost:5000
```

`GEMINI_API_KEY` is the only thing you need for the AI features. Without it
the app still runs, but photo and text analysis will fail.

### Environment

| Variable | Required | Notes |
|---|---|---|
| `GEMINI_API_KEY` | yes (for analysis) | Google Gemini API key |
| `DATABASE_URL` | no | Neon/Postgres URL; only needed once you switch from in-memory storage |
| `PORT` | no | defaults to `5000` |

### Build

```bash
npm run build   # vite build + esbuild server bundle
npm run start   # run the production build
npm run check   # TypeScript typecheck
```

### Database (optional)

The Drizzle schema is defined in `shared/schema.ts` but storage is in-memory
today. To move to Postgres:

```bash
npm run db:push   # push the schema (needs DATABASE_URL)
```

## Layout

```
client/           React + Vite app
  src/components/  feature components (photo upload, macro breakdown, …)
  src/pages/       routes (Dashboard)
server/           Express API
  gemini.ts        Gemini analysis (image + text)
  routes.ts        REST endpoints
  storage.ts       in-memory storage (MemStorage)
shared/           Drizzle schema + Zod types
uploads/          uploaded food photos (gitignored, created at runtime)
deployment_helpers/  free-hosting notes (GitHub Pages, Netlify, Vercel, …)
```

## API

| Method | Path | What it does |
|---|---|---|
| `GET` | `/api/food-entries` | list all entries |
| `POST` | `/api/food-entries` | create an entry |
| `POST` | `/api/analyze-photo` | analyze an uploaded photo |
| `POST` | `/api/analyze-text` | analyze a text description |
| `DELETE` | `/api/food-entries/:id` | delete an entry |

## Known limits

- **In-memory storage.** Entries do not survive a server restart. The
  `IStorage` interface is there so a database implementation can be swapped in
  without touching components.
- **Gemini free tier.** `gemini-2.5-flash` can return 503 "model overloaded"
  under load. The app surfaces this as an error toast and lets you retry.
- **No auth.** Single-user by design.

## License

MIT. See [LICENSE](LICENSE). Not affiliated with Google, MyFitnessPal,
Cronometer or Samsung Health.