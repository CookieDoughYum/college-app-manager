---
id: "001"
title: "Prisma schema — add aiRecommendations cache fields and migration"
status: todo
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
  - SUC-005
  - SUC-006
depends-on: []
---

# Prisma schema — add aiRecommendations cache fields and migration

## Description

Add `aiRecommendations Json @default("{}")` to 5 existing screen models:
`StudentActivities`, `StudentExams`, `StudentColleges`, `StudentDecide`,
`StudentFinancialAid`. Run migration. Update the corresponding GET endpoints
in `student.ts` to include `aiRecommendations` in the response.

## Acceptance Criteria

- [ ] `aiRecommendations` field added to all 5 models in schema.prisma
- [ ] Migration generated and applied
- [ ] GET endpoints for activities, exams, colleges, decide, financialaid
  return `aiRecommendations` in their response body

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: None — exercised by ticket #005
- **Verification command**: `cd server && npx prisma migrate dev --name add_ai_recommendations`
