---
status: draft
from-architecture-version: template-003
to-architecture-version: collegenav-004
---

# Sprint 004 Technical Plan

## Architecture Version

- **From version**: `template-003` — Docker-node-template with admin dashboard, OAuth integrations, Prisma 7 + ESM
- **To version**: `collegenav-004` — CollegeNav app shell with student auth and all 9 screens

## Architecture Overview

The existing template stack is kept intact (admin dashboard, session middleware,
Prisma client, ESM build). Sprint 004 layers the CollegeNav student-facing
application on top:

```
client/
  src/
    App.tsx                   ← Replace routes with CollegeNav routes
    layouts/
      AppLayout.tsx           ← Sidebar + Outlet (authenticated shell)
      AuthLayout.tsx          ← Centered card layout for login/signup
    pages/
      Dashboard.tsx
      auth/
        Login.tsx
        Signup.tsx
      screens/
        Activities.tsx        ← Screen 1
        Exams.tsx             ← Screen 2
        Colleges.tsx          ← Screen 3
        Essays.tsx            ← Screen 4
        RecLetters.tsx        ← Screen 5
        Portals.tsx           ← Screen 6
        Decide.tsx            ← Screen 7
        FinancialAid.tsx      ← Screen 8
        Deadlines.tsx         ← Screen 9
    components/
      ProtectedRoute.tsx      ← Redirect to /login if not authed
      Sidebar.tsx             ← Nav links, active state, logout button
      ProgressCard.tsx        ← Reusable dashboard card with progress bar
      TagChip.tsx             ← Selectable/display tag pill

server/
  src/
    routes/
      studentAuth.ts          ← /api/auth/signup, login, logout, me
    middleware/
      requireAuth.ts          ← 401 if no student session
    services/
      studentAuth.ts          ← Password hashing, Passport local strategy

  prisma/
    schema.prisma             ← Add Student model
    migrations/               ← New migration for Student table
```

## Component Design

### Component: Prisma Student Model

**Use Cases**: SUC-001, SUC-002

New model added to `schema.prisma`:

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

---

### Component: Student Auth Routes (`server/src/routes/studentAuth.ts`)

**Use Cases**: SUC-001, SUC-002, SUC-003

Four endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/signup` | Create student, hash password, establish session |
| `POST` | `/api/auth/login` | Passport local strategy, establish session |
| `POST` | `/api/auth/logout` | Destroy session |
| `GET` | `/api/auth/me` | Return `{ id, name, email, highSchool, grade }` or 401 |

Password hashing: `bcrypt` with 12 rounds (already a dependency via admin auth or
install if needed).

Passport local strategy serialises/deserialises student by `id` (separate from
admin strategy — use strategy name `"student-local"`).

Session key: `req.session.studentId` (set alongside Passport's `req.user`).

---

### Component: `requireAuth` Middleware (`server/src/middleware/requireAuth.ts`)

**Use Cases**: SUC-002, SUC-011

Returns 401 JSON `{ error: "Unauthorized" }` if `req.user` is not a student.
Applied to all `/api/student/*` routes (Sprint 005+).

---

### Component: React App Shell (`client/src/App.tsx`)

**Use Cases**: SUC-002, SUC-005, SUC-011

Updated route structure:

```tsx
<Routes>
  {/* Public */}
  <Route element={<AuthLayout />}>
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
  </Route>

  {/* Protected */}
  <Route element={<ProtectedRoute />}>
    <Route element={<AppLayout />}>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/activities" element={<Activities />} />
      <Route path="/exams" element={<Exams />} />
      <Route path="/colleges" element={<Colleges />} />
      <Route path="/essays" element={<Essays />} />
      <Route path="/recs" element={<RecLetters />} />
      <Route path="/portals" element={<Portals />} />
      <Route path="/decide" element={<Decide />} />
      <Route path="/aid" element={<FinancialAid />} />
      <Route path="/deadlines" element={<Deadlines />} />
    </Route>
  </Route>

  {/* Admin (existing) */}
  <Route path="/admin" element={<AdminLogin />} />
  <Route element={<AdminLayout />}>
    ...existing admin routes...
  </Route>
</Routes>
```

`ProtectedRoute` calls `GET /api/auth/me` on mount; redirects to `/login` if
401. Stores student info in React context (`StudentContext`).

---

### Component: `AppLayout` — Sidebar Shell

**Use Cases**: SUC-004, SUC-005

Fixed left sidebar (180px, `#1a1a2e` background) + main content area.
Matches wireframe layout exactly. Sidebar items:

- Dashboard (`/dashboard`)
- Activities & Courses (`/activities`)
- Exam Prep (`/exams`)
- College & Major (`/colleges`)
- Essays (`/essays`)
- Rec Letters (`/recs`)
- App Portals (`/portals`)
- Decide (`/decide`)
- Financial Aid (`/aid`)
- Deadlines (`/deadlines`)
- Log Out (button, calls `POST /api/auth/logout`)

Active item: left border accent `#e94560`, background `#16213e`.

---

### Component: Feature Screen Pages (Screens 1–9)

**Use Cases**: SUC-006 through SUC-010

Each screen is a React page component that:
1. Renders the layout matching the wireframe (refer to `docs/Concept/wireframes.html`)
2. Uses local `useState` for any interactive elements (tag selection, form inputs)
3. Shows placeholder text where AI content will appear in Sprint 006

Screens do NOT call any API endpoints in Sprint 004 — all state is ephemeral.

Key shared UI primitives to build in `components/`:
- `TagChip` — selectable pill (click to toggle selected state)
- `ProgressCard` — card with title, progress bar, subtitle
- `ChecklistItem` — checkbox + label + optional sub-text
- `BadgeLabel` — reach/target/safety colored badge

---

### Component: Styling Approach

**Use Cases**: All

Use CSS Modules (already supported by Vite). Global CSS variables for the
CollegeNav color palette:

```css
--color-navy: #1a1a2e;
--color-navy-mid: #16213e;
--color-accent: #e94560;
--color-text-muted: #888;
```

No new CSS framework is introduced. The wireframe uses plain CSS — replicate
the same approach with CSS Modules per component.

## Open Questions

1. **Password hashing library**: Does `bcrypt` need to be added, or is it
   already present from the admin auth implementation? Check `server/package.json`.
   Options:
   a. Use `bcrypt` (most common, native bindings)
   b. Use `bcryptjs` (pure JS, no native deps — simpler for Docker)

2. **Student context persistence**: Should `ProtectedRoute` store student info
   in React Context, Zustand, or simple prop drilling for Sprint 004?
   Options:
   a. React Context (simple, sufficient for MVP — recommended)
   b. Zustand (more scalable, adds a dependency)
   c. Prop drilling (too messy across 11 pages)
