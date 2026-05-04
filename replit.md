# CollegeNav — College Application Navigator

A personalized college application guide for high school students (grades 8–12), featuring AI-powered recommendations via Anthropic Claude, deadline tracking, and a full student dashboard.

## Architecture

- **Frontend**: React 19 + TypeScript + Vite, running on port 5000
- **Backend**: Node.js + Express + TypeScript, running on port 3000
- **Database**: PostgreSQL (Replit managed) via Prisma ORM
- **AI**: Anthropic Claude API (`@anthropic-ai/sdk`)
- **Auth**: Passport.js with local strategy + optional GitHub/Google OAuth

## Project Layout

```
/client       React frontend (Vite)
/server       Express backend
  /prisma     Schema + migrations
  /src/routes API endpoints (auth, student, ai, admin, etc.)
  /src/services Claude, Prisma, config, logBuffer
/start.sh     Dev startup script (server + client)
```

## Running the App

The "Start application" workflow runs `bash start.sh`, which:
1. Starts the Express server (`tsx watch src/index.ts`) on port 3000
2. Waits for the server health check at `/api/health`
3. Starts the Vite dev server on port 5000

## Environment Variables / Secrets

- `DATABASE_URL` — Replit managed PostgreSQL connection string
- `SESSION_SECRET` — Express session secret
- `ANTHROPIC_API_KEY` — Required for AI features (Claude)
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` — Optional, for GitHub OAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — Optional, for Google OAuth

## Database

Uses Replit's built-in PostgreSQL. Prisma migrations live in `server/prisma/migrations/`. All 7 migrations have been applied. Run `cd server && npx prisma migrate deploy` to apply new migrations.

## Deployment

Configured as `autoscale` deployment. Build compiles both server (TypeScript) and client (Vite), copies client output to `server/public/`, then serves everything from the Express server on port 5000.

## Key Features

- Student registration & login
- Personalized roadmap across 8 sections (Activities, Exams, Colleges, Essays, Rec Letters, Portals, Decide, Financial Aid)
- AI recommendations powered by Claude
- Deadline tracking (manual + web-scraped)
- Admin dashboard with log viewer and session management
- Pike13 and GitHub integrations
