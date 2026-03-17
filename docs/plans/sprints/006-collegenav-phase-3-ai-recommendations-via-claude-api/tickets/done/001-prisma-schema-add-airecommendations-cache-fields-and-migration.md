---
id: "001"
title: "Prisma schema — add aiRecommendations cache fields and migration"
status: done
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

## Acceptance Criteria

- [x] `aiRecommendations` field added to all 5 models in schema.prisma
- [x] Migration generated and applied
- [x] GET endpoints for activities, exams, colleges, decide, financialaid
  return `aiRecommendations` in their response body

## Testing

- **Verification command**: `cd server && npx prisma migrate dev --name add_ai_recommendations`
