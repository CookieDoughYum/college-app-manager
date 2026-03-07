---
id: '003'
title: React routing, auth pages, ProtectedRoute, and StudentContext
status: done
use-cases:
- SUC-001
- SUC-002
- SUC-003
- SUC-011
depends-on:
- '002'
---

# React routing, auth pages, ProtectedRoute, and StudentContext

## Description

Replace the current placeholder `App.tsx` routing with the full CollegeNav
route structure. Implement the Login and Signup pages, `ProtectedRoute`
(redirects to `/login` if not authenticated), and `StudentContext` (stores
the logged-in student's info for use across all pages).

## Implementation Notes

**New files to create:**

`client/src/contexts/StudentContext.tsx`:
```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface Student {
  id: number;
  name: string;
  email: string;
  highSchool: string;
  grade: number;
}

interface StudentContextValue {
  student: Student | null;
  setStudent: (s: Student | null) => void;
}

export const StudentContext = createContext<StudentContextValue>({
  student: null,
  setStudent: () => {},
});

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
```

`client/src/components/ProtectedRoute.tsx`:
- On mount, call `GET /api/auth/me`.
- If 200: store student in `StudentContext`, render `<Outlet />`.
- If 401: redirect to `/login`.
- Show a loading state while the request is in flight.

`client/src/pages/auth/Login.tsx`:
- Form: email + password fields + submit button.
- On submit: `POST /api/auth/login` → on success, set student in context, navigate to `/dashboard`.
- Show error message on 401.
- Link to `/signup`.

`client/src/pages/auth/Signup.tsx`:
- Form: name, email, password, high school, grade (select 8–12).
- On submit: `POST /api/auth/signup` → on success, set student in context, navigate to `/dashboard`.
- Show field-level errors on 400.
- Link to `/login`.
- Show the "separate email" tip box (matches wireframe).

`client/src/layouts/AuthLayout.tsx`:
- Centered card layout for login/signup pages.

**Update `client/src/App.tsx`:**

Wrap with `<StudentProvider>`. Add routes:
```tsx
// Public
<Route element={<AuthLayout />}>
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
</Route>

// Protected (AppLayout added in ticket 004)
<Route element={<ProtectedRoute />}>
  <Route path="/" element={<Navigate to="/dashboard" />} />
</Route>

// Admin (existing — keep unchanged)
```

**Wireframe reference**: `docs/Concept/wireframes.html` — Screen 0 (Signup).

## Acceptance Criteria

- [x] Visiting `/login` shows the login form without auth
- [x] Visiting `/signup` shows the signup form without auth
- [x] Visiting any protected route while unauthenticated redirects to `/login`
- [x] Login form submits to `/api/auth/login` and redirects to `/dashboard` on success
- [x] Signup form submits to `/api/auth/signup` and redirects to `/dashboard` on success
- [x] Signup page shows the "separate email" tip box
- [x] Login/Signup pages have links to each other
- [x] `StudentContext` is available throughout the app
- [x] Existing admin routes (`/admin`, `/admin/*`) are unaffected

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: See ticket 008
- **Verification command**: `npm run test:client`
