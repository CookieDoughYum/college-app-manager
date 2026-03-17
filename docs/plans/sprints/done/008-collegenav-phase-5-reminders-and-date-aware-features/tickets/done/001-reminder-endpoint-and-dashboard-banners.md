---
id: '001'
title: Reminder endpoint and Dashboard banners
status: in-progress
use-cases:
- SUC-001
depends-on: []
---

# Reminder endpoint and Dashboard banners

## Description

Add `GET /api/student/reminders` to `server/src/routes/student.ts`. This
endpoint computes time-sensitive action items from the student's data:

1. Load `StudentDeadlines.manualDeadlines` and `Student.grade`
2. For each deadline, parse the date and compute days until due
3. Emit red (≤7 days), amber (≤30 days) deadline reminders
4. Always emit a grade-based general reminder

Response: `{ reminders: [{ type, urgency, message }] }`

Update `client/src/pages/Dashboard.tsx` to fetch `GET /api/student/reminders`
on mount alongside the existing progress fetch, and display colored banners
above the progress section.

## Acceptance Criteria

- [x] `GET /api/student/reminders` returns 401 without auth
- [x] Returns `{ reminders: array }` when authenticated
- [x] Includes a grade-based reminder in the response
- [x] Includes a deadline reminder when a deadline is within 30 days
- [x] Dashboard displays reminder banners color-coded by urgency

## Testing

- **Existing tests to run**: `npm run test:server && npm run test:client`
- **New tests to write**: In `tests/server/reminders.test.ts` (ticket #004)
- **Verification command**: `npm run test:server`
