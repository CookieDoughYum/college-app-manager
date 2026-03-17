---
id: "003"
title: "Date-aware Rec Letters next-action highlight"
status: todo
use-cases:
  - SUC-003
depends-on:
  - "001"
---

# Date-aware Rec Letters next-action highlight

## Description

Update `client/src/pages/screens/RecLetters.tsx` to:

1. Fetch `GET /api/student/profile` on mount to get the student's grade
2. Determine the "next action" step based on grade:
   - Grade 8–10: "Build relationships with potential recommenders"
   - Grade 11: "Request letters from 2–3 teachers by September"
   - Grade 12 (before Nov): "Ensure teachers are added on Common App"
   - Grade 12 (Nov+): "Send thank-you notes to your recommenders"
3. Visually highlight that step in the checklist with a "→ Next Step" badge

## Acceptance Criteria

- [ ] Rec Letters screen fetches student profile on mount
- [ ] One checklist step is highlighted as the recommended next action
- [ ] The highlighted step matches the student's grade
- [ ] Client render tests pass

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: None beyond existing client tests
- **Verification command**: `npm run test:client`
