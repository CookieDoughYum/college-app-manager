---
id: "005"
title: "Server integration tests — student data API"
status: done
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
`/api/student/*` endpoints.

## Acceptance Criteria

- [x] Unauthenticated requests to all `/api/student/*` routes return 401
- [x] GET on a fresh student account returns defaults (not 404 or error)
- [x] PUT for each screen updates data; subsequent GET returns updated values
- [x] `GET /api/student/profile` returns correct student fields
- [x] `PUT /api/student/profile` updates name, highSchool, grade
- [x] `GET /api/student/progress` returns numeric percentages for all 9 screens
- [x] Progress increases correctly when data is saved

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/studentData.test.ts`
- **Verification command**: `npm run test:server`
