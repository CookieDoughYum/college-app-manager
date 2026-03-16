---
id: "005"
title: "Server integration tests — student data API"
status: todo
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
  - SUC-005
  - SUC-006
  - SUC-007
  - SUC-008
  - SUC-009
depends-on:
  - "002"
---

# Server integration tests — student data API

## Description

Write integration tests in `tests/server/studentData.test.ts` covering all
`/api/student/*` endpoints. Tests use Supertest with a real test database
(same pattern as `tests/server/studentAuth.test.ts`).

## Acceptance Criteria

- [ ] Unauthenticated requests to all `/api/student/*` routes return 401
- [ ] GET on a fresh student account returns defaults (not 404 or error)
- [ ] PUT for each screen updates data; subsequent GET returns updated values
- [ ] `GET /api/student/profile` returns correct student fields
- [ ] `PUT /api/student/profile` updates name, highSchool, grade
- [ ] `GET /api/student/progress` returns numeric percentages for all 9 screens
- [ ] Progress increases correctly when data is saved

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/studentData.test.ts`
- **Verification command**: `npm run test:server`
