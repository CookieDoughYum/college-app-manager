---
id: "001"
title: "Mobile-responsive layout and grade-based sidebar locking"
status: todo
use-cases:
  - SUC-001
  - SUC-003
depends-on: []
---

# Mobile-responsive layout and grade-based sidebar locking

## Description

Two related changes to `AppLayout.tsx` and `AppLayout.module.css`:

**Mobile layout:**
- Add a hamburger button visible only at ≤768px
- Toggle `sidebarOpen` state to show/hide the sidebar on mobile
- Sidebar is a slide-out overlay on mobile (fixed position, z-index 100)
- Dashboard card grid becomes 1-column at ≤768px (via CSS media query)

**Grade-based sidebar locking:**
- Read student grade from `StudentContext`
- Each nav item gets a `minGrade` threshold
- Items below the student's grade are rendered with `opacity: 0.4` and
  `title="Unlocks in Grade N"` — still rendered, just visually dimmed
- Thresholds: Activities/Exams = 8, Colleges/Financial Aid/Deadlines/Essays/Rec Letters = 11, Portals/Decide = 12

## Acceptance Criteria

- [ ] Sidebar hides at ≤768px, hamburger button appears
- [ ] Hamburger toggles a slide-out sidebar overlay
- [ ] Dashboard progress cards stack 1-column at ≤768px
- [ ] Grade 9 student sees Decide and Portals dimmed in sidebar
- [ ] Grade 12 student sees all sidebar items at full opacity
- [ ] All client tests pass

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: None beyond existing (CSS/visual changes)
- **Verification command**: `npm run test:client`
