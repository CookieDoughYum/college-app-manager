---
id: "002"
title: "Student data API — /api/student/* endpoints for all 9 screens"
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
  - "001"
---

# Student data API — /api/student/* endpoints for all 9 screens

## Description

Create `server/src/routes/student.ts` with GET + PUT endpoints for each screen's
data, plus `GET /api/student/profile`, `PUT /api/student/profile`, and
`GET /api/student/progress`. Mount the router in `server/src/app.ts` under
`/api/student` with `requireAuth` applied to all routes.

## Acceptance Criteria

- [x] `GET /api/student/profile` returns student name, email, highSchool, grade
- [x] `PUT /api/student/profile` updates name, highSchool, grade
- [x] GET for each of the 9 screens returns default data on first call (no 404)
- [x] PUT for each screen persists data; subsequent GET returns updated data
- [x] `GET /api/student/progress` returns `{ activities, exams, ... }` percentages
- [x] All routes return 401 for unauthenticated requests
- [x] Router mounted in `app.ts` under `/api/student`

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: covered by ticket #005 (server integration tests)
- **Verification command**: `npm run test:server`
