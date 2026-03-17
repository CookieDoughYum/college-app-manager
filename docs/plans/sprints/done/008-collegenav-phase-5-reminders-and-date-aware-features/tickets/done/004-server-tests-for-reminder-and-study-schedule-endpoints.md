---
id: '004'
title: Server tests for reminder and study schedule endpoints
status: in-progress
use-cases:
- SUC-001
- SUC-002
depends-on:
- '001'
- '002'
---

# Server tests for reminder and study schedule endpoints

## Description

Write `tests/server/reminders.test.ts` with:

- `GET /api/student/reminders`: 401 without auth, returns `{ reminders }`,
  includes grade reminder, includes deadline reminder when deadline is
  within 30 days, skips unparseable dates
- `POST /api/ai/exams/schedule`: 401 without auth, returns `{ result }`,
  result cached in `aiRecommendations.schedule`
- All existing tests still pass

## Acceptance Criteria

- [x] 401 for unauthenticated `GET /api/student/reminders`
- [x] Reminders array includes a grade-based reminder
- [x] Deadline reminder appears when deadline date is within 30 days
- [x] 401 for unauthenticated `POST /api/ai/exams/schedule`
- [x] Schedule endpoint returns `{ result: string }`
- [x] Schedule cached in `aiRecommendations.schedule`
- [x] All 108+ existing server tests still pass

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/reminders.test.ts`
- **Verification command**: `npm run test:server`
