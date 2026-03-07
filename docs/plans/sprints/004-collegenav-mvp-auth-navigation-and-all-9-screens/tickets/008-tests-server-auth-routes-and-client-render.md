---
id: "008"
title: "Tests — server auth routes and client render"
status: todo
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
  - SUC-005
  - SUC-011
depends-on:
  - "002"
  - "004"
---

# Tests — server auth routes and client render

## Description

Write the test suite for Sprint 004: server-side auth route tests (Jest +
Supertest) and client-side render tests (Vitest + React Testing Library).

All existing tests must continue to pass.

## Server Tests

**New file: `tests/server/studentAuth.test.ts`**

Test the following scenarios against the real test database (or an in-memory
mock — follow the pattern of existing server tests):

```
POST /api/auth/signup
  ✓ creates student and returns 201 with student fields
  ✓ does NOT include passwordHash in response
  ✓ returns 409 on duplicate email
  ✓ returns 400 when name is missing
  ✓ returns 400 when grade is out of range (< 8 or > 12)
  ✓ sets session cookie on success

POST /api/auth/login
  ✓ returns 200 and student fields on valid credentials
  ✓ returns 401 on wrong password
  ✓ returns 401 on unknown email
  ✓ sets session cookie on success

GET /api/auth/me
  ✓ returns 401 when not authenticated
  ✓ returns student fields when logged in as student

POST /api/auth/logout
  ✓ destroys session and returns { success: true }
  ✓ /me returns 401 after logout
```

## Client Tests

**New file: `tests/client/AppLayout.test.tsx`**

```
AppLayout
  ✓ renders sidebar with all 10 nav links
  ✓ renders active state on the current route link
  ✓ renders Log Out button
```

**New file: `tests/client/Dashboard.test.tsx`**

```
Dashboard
  ✓ renders welcome message with student name from context
  ✓ renders grade and school name
  ✓ renders three progress cards
```

**New file: `tests/client/Activities.test.tsx`**

```
Activities
  ✓ renders interests questionnaire with tag chips
  ✓ renders 4-year course plan grid with 4 columns
```

Follow the existing test infrastructure patterns in `tests/server/` and
`tests/client/`. Check existing jest/vitest config files before writing new
tests to ensure imports and setup match.

## Acceptance Criteria

- [ ] All server auth tests pass (`npm run test:server`)
- [ ] All client render tests pass (`npm run test:client`)
- [ ] All pre-existing tests continue to pass (health, counter, admin, integrations)
- [ ] `passwordHash` never appears in any test response assertion

## Testing

- **Existing tests to run**: `npm run test:server && npm run test:client`
- **New tests to write**: As described above
- **Verification command**: `npm run test:server && npm run test:client`
