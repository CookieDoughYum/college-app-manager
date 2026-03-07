---
id: "002"
title: "Student auth backend — signup, login, session"
status: todo
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
depends-on:
  - "001"
---

# Student auth backend — signup, login, session

## Description

Add student authentication to the Express server: Passport local strategy,
signup/login endpoints, and updates to the existing `/api/auth/me` and
`/api/auth/logout` routes to handle student sessions.

Student auth is merged into the existing `server/src/routes/auth.ts` to avoid
route conflicts (those routes already exist there).

## Implementation Notes

**Install dependencies:**
```bash
cd server && npm install bcryptjs passport-local
npm install -D @types/bcryptjs @types/passport-local
```

**`server/src/routes/auth.ts` — add to the existing file:**

1. Import `bcryptjs`, `passport-local`, and the Prisma client.
2. Register a Passport local strategy named `'student-local'`:
   - Look up student by email; compare password with `bcrypt.compare`.
   - Call `done(null, { type: 'student', id, name, email, highSchool, grade })` on success.
3. Update the global `serializeUser` / `deserializeUser` in `app.ts` to handle
   both OAuth users and student users. Store only
   `{ type, id, name, email, highSchool, grade }` — never `passwordHash`.
4. Add `POST /api/auth/signup`:
   - Validate: name, email, password (min 8 chars), highSchool, grade (8–12).
   - Check for duplicate email → 409.
   - Hash password with `bcryptjs` (10 rounds).
   - Create `Student` record via Prisma.
   - Call `req.login()` to establish session.
   - Return 201 `{ id, name, email, highSchool, grade }`.
5. Add `POST /api/auth/login`:
   - Delegate to `passport.authenticate('student-local')`.
   - Return 200 `{ id, name, email, highSchool, grade }` on success.
6. Update `GET /api/auth/me` (already exists):
   - If `req.user` exists and `req.user.type === 'student'`, return student fields.
   - Existing OAuth behavior unchanged.
7. Update `POST /api/auth/logout` (already exists):
   - Existing implementation already calls `req.logout()` and destroys session — no change needed.

**`server/src/middleware/requireAuth.ts` — new file:**
```ts
import { Request, Response, NextFunction } from 'express';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as any)?.type === 'student') {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
}
```

**Prisma import**: use `../generated/prisma/client` (matches existing `services/prisma.ts` pattern).

## Acceptance Criteria

- [ ] `POST /api/auth/signup` creates a student and returns 201 with student fields (no passwordHash)
- [ ] `POST /api/auth/signup` returns 409 on duplicate email
- [ ] `POST /api/auth/signup` returns 400 on missing/invalid fields
- [ ] `POST /api/auth/login` returns 200 and student fields on valid credentials
- [ ] `POST /api/auth/login` returns 401 on invalid credentials
- [ ] `GET /api/auth/me` returns student fields when logged in as student
- [ ] `GET /api/auth/me` returns 401 when not authenticated
- [ ] `POST /api/auth/logout` destroys the session
- [ ] Existing GitHub/Google OAuth auth routes continue to work
- [ ] `passwordHash` is never returned in any response

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: See ticket 008 — auth route tests are written there
- **Verification command**: `npm run test:server`
