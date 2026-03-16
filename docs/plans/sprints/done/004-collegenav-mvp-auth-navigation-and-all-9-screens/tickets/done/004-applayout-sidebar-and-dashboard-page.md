---
id: "004"
title: "AppLayout sidebar and Dashboard page"
status: done
use-cases:
  - SUC-004
  - SUC-005
depends-on:
  - "003"
---

# AppLayout sidebar and Dashboard page

## Description

Build the `AppLayout` component (sidebar + main content area) and the
`Dashboard` page. This is the authenticated shell that wraps all 9 feature
screens. Also establish the shared CSS variables and global styles for the
CollegeNav color palette.

## Implementation Notes

**`client/src/layouts/AppLayout.tsx`:**
- Fixed left sidebar (180px wide, `#1a1a2e` background).
- Main content area fills remaining width.
- Uses React Router `<Outlet />` for child pages.
- Import and render `<Sidebar />`.

**`client/src/components/Sidebar.tsx`:**
- Logo area: "CollegeNav" text.
- Nav items (use `<NavLink>` for active state):
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
- Log Out button: calls `POST /api/auth/logout`, clears `StudentContext`, navigates to `/login`.
- Active item style: left border `#e94560`, background `#16213e`, text white.
- Inactive item style: text `#aaa`.

**`client/src/pages/Dashboard.tsx`:**
- Header: "Welcome back, [name]" with grade and school subtitle.
- Grade tag pill.
- Three `ProgressCard` components (all at 0% for MVP):
  - Activities & Courses
  - Exam Prep
  - Colleges
- Action Items section with placeholder text.

**`client/src/components/ProgressCard.tsx`:**
- Props: `title`, `percent`, `subtitle`.
- Progress bar fills to `percent` width with `#e94560`.

**`client/src/index.css` — add CSS variables:**
```css
:root {
  --color-navy: #1a1a2e;
  --color-navy-mid: #16213e;
  --color-accent: #e94560;
  --color-text-muted: #888;
}
```

**Update `client/src/App.tsx`** — wrap protected routes in `<AppLayout />`:
```tsx
<Route element={<ProtectedRoute />}>
  <Route element={<AppLayout />}>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/dashboard" element={<Dashboard />} />
    {/* feature screen routes added in tickets 005–007 */}
  </Route>
</Route>
```

**Wireframe reference**: `docs/Concept/wireframes.html` — Screen 1 (Dashboard).

## Acceptance Criteria

- [x] Sidebar renders on all protected pages with all 10 nav links + logout
- [x] Active nav item has red left border and highlighted background
- [x] Clicking a nav link navigates to the correct route
- [x] Logout button calls `/api/auth/logout`, clears session, redirects to `/login`
- [x] Dashboard shows "Welcome back, [name]" with correct grade and school from `StudentContext`
- [x] Three progress cards render at 0%
- [x] CSS variables are defined in `index.css`

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: See ticket 008 — sidebar and dashboard render tests
- **Verification command**: `npm run test:client`
