---
id: "001"
title: "Prisma schema — 9 screen data models and migration"
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
depends-on: []
---

# Prisma schema — 9 screen data models and migration

## Description

Add 9 new Prisma models to `server/prisma/schema.prisma` — one per feature
screen — each linked to `Student` via a 1-to-1 relation. Run `prisma migrate dev`
to generate and apply the migration. All array/object data uses JSONB (`Json`)
columns.

Models to add: `StudentActivities`, `StudentExams`, `StudentColleges`,
`StudentEssays`, `StudentRecLetters`, `StudentPortals`, `StudentDecide`,
`StudentFinancialAid`, `StudentDeadlines`. See the technical plan for the full
schema.

## Acceptance Criteria

- [x] All 9 models are added to `schema.prisma` with correct fields and relation
- [x] Migration file is generated under `server/prisma/migrations/`
- [x] `npx prisma migrate dev` succeeds without errors
- [x] `npx prisma generate` succeeds

## Testing

- **Existing tests to run**: `npm run test:server` (ensure no regressions)
- **New tests to write**: None — schema is exercised by ticket #002 tests
- **Verification command**: `cd server && npx prisma migrate dev --name add_screen_data_models`
