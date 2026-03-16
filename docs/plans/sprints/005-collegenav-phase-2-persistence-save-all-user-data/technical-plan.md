---
status: draft
from-architecture-version: collegenav-004
to-architecture-version: collegenav-005
---

# Sprint 005 Technical Plan

## Architecture Version

- **From version**: `collegenav-004` — Auth shell, all 9 screens as static
  ephemeral React components
- **To version**: `collegenav-005` — All 9 screens backed by Prisma models
  and REST API; Dashboard wired to real progress

## Architecture Overview

```
server/
  src/
    routes/
      student.ts          ← All /api/student/* endpoints
    middleware/
      requireAuth.ts      ← Already exists; applied to all student routes

  prisma/
    schema.prisma         ← Add 9 screen data models
    migrations/           ← New migration

client/
  src/
    pages/screens/
      Activities.tsx      ← fetch on mount, save on action (all 9 screens)
      Exams.tsx
      Colleges.tsx
      Essays.tsx
      RecLetters.tsx
      Portals.tsx
      Decide.tsx
      FinancialAid.tsx
      Deadlines.tsx
    pages/
      Dashboard.tsx       ← fetch /api/student/progress, render real bars

tests/
  server/
    studentData.test.ts   ← Integration tests for all /api/student/ endpoints
```

## Component Design

### Component: Prisma Schema Extension

**Use Cases**: SUC-001 through SUC-009

Add one model per screen linked to `Student` via a 1-to-1 relation. Use JSONB
(`Json`) columns for array data to avoid over-normalisation at this stage.

```prisma
model StudentActivities {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  interests    Json    @default("[]")   // string[] — selected tag chips
  coursePlan   Json    @default("{}")   // { "9": [...], "10": [...], "11": [...], "12": [...] }
  updatedAt    DateTime @updatedAt
}

model StudentExams {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  testPreference String? // "SAT" | "ACT" | null
  apCourses    Json    @default("[]")   // string[]
  updatedAt    DateTime @updatedAt
}

model StudentColleges {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  majorAnswers Json    @default("{}")   // { salaryGoal, interestArea }
  collegeList  Json    @default("[]")   // { name, label }[]
  updatedAt    DateTime @updatedAt
}

model StudentEssays {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  driveLink    String?
  notes        String?
  updatedAt    DateTime @updatedAt
}

model StudentRecLetters {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  checklist    Json    @default("{}")   // { [itemKey]: boolean }
  teachers     Json    @default("[]")   // { name, status }[]
  updatedAt    DateTime @updatedAt
}

model StudentPortals {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  portals      Json    @default("[]")   // { name, url, status }[]
  updatedAt    DateTime @updatedAt
}

model StudentDecide {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  decisions    Json    @default("[]")   // { school, result }[] result: "Accepted"|"Waitlisted"|"Denied"
  updatedAt    DateTime @updatedAt
}

model StudentFinancialAid {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  fafsaChecklist     Json  @default("{}")   // { [itemKey]: boolean }
  scholarshipAnswers Json  @default("{}")   // { firstGen, stem, state, communityService }
  updatedAt    DateTime @updatedAt
}

model StudentDeadlines {
  id           Int     @id @default(autoincrement())
  studentId    Int     @unique
  student      Student @relation(fields: [studentId], references: [id], onDelete: Cascade)
  manualDeadlines Json @default("[]")  // { school, label, date }[]
  updatedAt    DateTime @updatedAt
}
```

---

### Component: Student Data API (`server/src/routes/student.ts`)

**Use Cases**: SUC-001 through SUC-009

One router mounted at `/api/student`, all routes wrapped with `requireAuth`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/student/profile` | Return `{ name, email, highSchool, grade }` |
| `PUT` | `/api/student/profile` | Update name, highSchool, grade |
| `GET` | `/api/student/activities` | Return activities data |
| `PUT` | `/api/student/activities` | Upsert activities data |
| `GET` | `/api/student/exams` | Return exams data |
| `PUT` | `/api/student/exams` | Upsert exams data |
| `GET` | `/api/student/colleges` | Return colleges data |
| `PUT` | `/api/student/colleges` | Upsert colleges data |
| `GET` | `/api/student/essays` | Return essays data |
| `PUT` | `/api/student/essays` | Upsert essays data |
| `GET` | `/api/student/recletters` | Return rec letters data |
| `PUT` | `/api/student/recletters` | Upsert rec letters data |
| `GET` | `/api/student/portals` | Return portals data |
| `PUT` | `/api/student/portals` | Upsert portals data |
| `GET` | `/api/student/decide` | Return decide data |
| `PUT` | `/api/student/decide` | Upsert decide data |
| `GET` | `/api/student/financialaid` | Return financial aid data |
| `PUT` | `/api/student/financialaid` | Upsert financial aid data |
| `GET` | `/api/student/deadlines` | Return deadlines data |
| `PUT` | `/api/student/deadlines` | Upsert deadlines data |
| `GET` | `/api/student/progress` | Return `{ [screen]: percentage }` for dashboard |

All GET endpoints use Prisma `upsert` (create with defaults if not found).
All PUT endpoints use Prisma `upsert` with the new values.

---

### Component: Screen Components — Data Wiring

**Use Cases**: SUC-001 through SUC-008

Each of the 9 screen components gains:

1. A `useEffect` on mount that calls `GET /api/student/<screen>` and sets
   local state from the response.
2. A save function that calls `PUT /api/student/<screen>` with current state.
3. Save is triggered either on blur/change (simple fields) or an explicit
   "Save" button (complex structures like course plan and college list).
4. A loading state shown while fetch is in flight.

Pattern:

```tsx
const [data, setData] = useState<ScreenData>(defaultData);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch('/api/student/activities', { credentials: 'include' })
    .then(r => r.json())
    .then(d => { setData(d); setLoading(false); });
}, []);

const save = (updated: ScreenData) => {
  setData(updated);
  fetch('/api/student/activities', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(updated),
  });
};
```

---

### Component: Dashboard Progress Wiring

**Use Cases**: SUC-009

`GET /api/student/progress` returns a progress object:

```json
{
  "activities": 40,
  "exams": 0,
  "colleges": 75,
  "essays": 0,
  "recletters": 20,
  "portals": 100,
  "decide": 0,
  "financialaid": 50,
  "deadlines": 0
}
```

Progress percentage per screen is computed server-side:
- Activities: interests selected + course plan rows filled
- Exams: test preference set (50%) + AP courses entered (50%)
- Colleges: college list length capped at goal of 20 entries = 100%
- Essays: drive link set (50%) + notes non-empty (50%)
- RecLetters: % of checklist items checked
- Portals: portal count capped at 3 = 100%
- Decide: % of college list with a decision logged
- FinancialAid: % FAFSA checklist + scholarship answers filled
- Deadlines: deadline count capped at 5 = 100%

---

### Component: Server Integration Tests

**Use Cases**: SUC-001 through SUC-009

File: `tests/server/studentData.test.ts`

Covers:
- Unauthenticated requests to all endpoints return 401
- GET on a fresh student returns defaults (not 404)
- PUT updates data; subsequent GET returns updated data
- Profile PUT updates student name/school/grade
- Progress endpoint returns correct percentages

## Decisions

1. **JSONB for array data** — avoids normalised tables for arrays always read
   and written together. Simpler queries; acceptable at this scale.
2. **Upsert on GET** — ensures a row always exists after first visit; avoids
   null checks in the frontend.
3. **Separate router file** — `server/src/routes/student.ts` keeps student
   data routes separate from auth routes.
4. **Save-on-action, not debounce** — explicit save button for complex
   structures; immediate save for simple toggles. Reduces partial saves.
