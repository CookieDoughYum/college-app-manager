---
id: '002'
title: "Student auth backend — signup, login, session"
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
depends-on:
- '001'
---

# Student auth backend — signup, login, session

## Description

Add student authentication to the Express server: Passport local strategy,
signup/login endpoints, and updates to the existing `/api/auth/me` and
`/api/auth/logout` routes to handle student sessions.

Student auth is merged into the existing `server/src/routes/auth.ts` to avoid
route conflicts (those routes already exist there).

## Acceptance Criteria

- [x] `POST /api/auth/signup` creates a student and returns 201 with student fields (no passwordHash)
- [x] `POST /api/auth/signup` returns 409 on duplicate email
- [x] `POST /api/auth/signup` returns 400 on missing/invalid fields
- [x] `POST /api/auth/login` returns 200 and student fields on valid credentials
- [x] `POST /api/auth/login` returns 401 on invalid credentials
- [x] `GET /api/auth/me` returns student fields when logged in as student
- [x] `GET /api/auth/me` returns 401 when not authenticated
- [x] `POST /api/auth/logout` destroys the session
- [x] Existing GitHub/Google OAuth auth routes continue to work
- [x] `passwordHash` is never returned in any response

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: See ticket 008 — auth route tests are written there
- **Verification command**: `npm run test:server`
