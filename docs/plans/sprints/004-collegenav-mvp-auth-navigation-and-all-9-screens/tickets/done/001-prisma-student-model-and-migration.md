---
id: '001'
title: Prisma Student model and migration
status: done
use-cases:
- SUC-001
- SUC-002
depends-on: []
---

# Prisma Student model and migration

## Description

Add the `Student` model to `server/prisma/schema.prisma` and run a migration.
This is the database foundation that all student auth work (ticket 002) depends on.

## Implementation Notes

Add to `server/prisma/schema.prisma`:

```prisma
model Student {
  id           Int      @id @default(autoincrement())
  name         String
  email        String   @unique
  passwordHash String
  highSchool   String
  grade        Int      // 8–12
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

Then run:
```bash
cd server && npx prisma migrate dev --name add-student-model
npx prisma generate
```

## Acceptance Criteria

- [x] `Student` model is in `schema.prisma` with all fields listed above
- [x] Migration file exists in `server/prisma/migrations/`
- [x] `npx prisma migrate dev` runs cleanly
- [x] `npx prisma generate` regenerates the client without errors

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: None — migration correctness verified by commands succeeding
- **Verification command**: `cd server && npx prisma migrate dev && npx prisma generate`
