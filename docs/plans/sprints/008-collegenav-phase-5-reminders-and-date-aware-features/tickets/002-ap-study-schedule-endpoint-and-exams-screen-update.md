---
id: "002"
title: "AP study schedule endpoint and Exams screen update"
status: todo
use-cases:
  - SUC-002
depends-on: []
---

# AP study schedule endpoint and Exams screen update

## Description

Add `POST /api/ai/exams/schedule` to `server/src/routes/ai.ts`.

1. Reads `StudentExams.apCourses`
2. Computes weeks until May 1 (AP exam month)
3. Asks Claude for a week-by-week study schedule
4. Caches result in `StudentExams.aiRecommendations.schedule`
5. Returns `{ result }`

Update `client/src/pages/screens/Exams.tsx` to:
- Load cached `aiRecommendations.schedule` from the GET response
- Add a "Generate Study Schedule" button below the AP tracker
- Show a loading spinner while in flight
- Display the schedule in a `<pre>` tag

## Acceptance Criteria

- [ ] `POST /api/ai/exams/schedule` returns 401 without auth
- [ ] Returns `{ result: string }` with auth
- [ ] Result is cached in `StudentExams.aiRecommendations.schedule`
- [ ] Exams screen shows "Generate Study Schedule" button
- [ ] Schedule displayed on page reload from cache

## Testing

- **Existing tests to run**: `npm run test:server && npm run test:client`
- **New tests to write**: In `tests/server/reminders.test.ts` (ticket #004)
- **Verification command**: `npm run test:server`
