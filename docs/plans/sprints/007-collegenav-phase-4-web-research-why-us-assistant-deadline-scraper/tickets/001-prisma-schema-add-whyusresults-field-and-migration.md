---
id: "001"
title: "Prisma schema — add whyUsResults field and migration"
status: todo
use-cases:
  - SUC-001
depends-on: []
---

# Prisma schema — add whyUsResults field and migration

## Description

Add a `whyUsResults Json @default("{}")` field to the `StudentEssays` model.
This stores a map of school name → Claude talking points so multiple
schools can be researched without overwriting previous results.

Run `prisma migrate dev` to create and apply the migration.

Also update the `GET /api/student/essays` endpoint to return `whyUsResults`
in the response (it already returns all fields via upsert).

## Acceptance Criteria

- [ ] `StudentEssays` model has `whyUsResults Json @default("{}")`
- [ ] Migration created and applied successfully
- [ ] `npm run test:server` passes with no regressions

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: None — schema change tested via endpoint tests in ticket #004
- **Verification command**: `npm run test:server`
