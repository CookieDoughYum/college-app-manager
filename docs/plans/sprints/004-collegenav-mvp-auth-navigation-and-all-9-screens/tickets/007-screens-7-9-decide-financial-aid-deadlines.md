---
id: "007"
title: "Screens 7–9: Decide, Financial Aid, Deadlines"
status: todo
use-cases:
  - SUC-010
depends-on:
  - "004"
---

# Screens 7–9: Decide, Financial Aid, Deadlines

## Description

Implement the final three feature screen pages as static layouts with local
React state. These complete the full 9-screen CollegeNav MVP.

**Wireframe reference**: `docs/Concept/wireframes.html` — Screens S8, S9, S10.

## Screen Implementations

**`client/src/pages/screens/Decide.tsx`** (`/decide`):
- Acceptances section: three example result cards (UCLA ✅ Accepted with green left border, UC San Diego ✅ Accepted with green left border, MIT ❌ Not admitted with grey left border). State held in `useState`.
- "+ Add Result" button (no-op in Sprint 004).
- AI Decision Helper section: placeholder box with example pros/cons text (non-functional).
- Honors Programs card with example links (static text, no actual links needed).

**`client/src/pages/screens/FinancialAid.tsx`** (`/aid`):
- FAFSA & CSS Checklist: amber warning box reminding about October 1st deadline. Two `ChecklistItem` components (parents completed FAFSA, parents completed CSS Profile). State held in `useState`.
- Recommended Scholarships section: placeholder box with a row of profile tag chips (First-gen, STEM, California resident, Community service).
- Three example scholarship cards (Gates Scholarship, Dell Scholars Program, Local Community Foundation) each with a colored deadline badge (red/amber/green).

**`client/src/pages/screens/Deadlines.tsx`** (`/deadlines`):
- Month/year header with "(auto-populated from your college list)" note.
- Calendar grid (CSS grid, 7 columns): render a static November 2025 calendar with two highlighted days (Nov 15 and Nov 30) using the accent color.
- Upcoming Deadlines list: three example deadline cards (MIT Early Action, UC Application, Cal Poly SLO Regular Decision) with reach/target/safety `BadgeLabel` components and days-until countdown text (static).
- Note at bottom: "Deadlines auto-fetched via Browser MCP from each school's admissions page. Last updated: today." (informational — Browser MCP wired in Sprint 007).

**Complete the route registration** in `client/src/App.tsx` — add all remaining screen routes under `<AppLayout />`:
```tsx
<Route path="/activities" element={<Activities />} />
<Route path="/exams" element={<Exams />} />
<Route path="/colleges" element={<Colleges />} />
<Route path="/essays" element={<Essays />} />
<Route path="/recs" element={<RecLetters />} />
<Route path="/portals" element={<Portals />} />
<Route path="/decide" element={<Decide />} />
<Route path="/aid" element={<FinancialAid />} />
<Route path="/deadlines" element={<Deadlines />} />
```

## Acceptance Criteria

- [ ] `/decide` renders acceptance result cards with color-coded left borders
- [ ] `/aid` renders FAFSA checklist with toggleable checkboxes and scholarship cards with deadline badges
- [ ] `/deadlines` renders a calendar grid with two highlighted days and upcoming deadline cards
- [ ] All 9 feature screens are reachable via sidebar navigation
- [ ] No broken routes — all `/activities`, `/exams`, `/colleges`, `/essays`, `/recs`, `/portals`, `/decide`, `/aid`, `/deadlines` load without error

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: None in this ticket — covered by ticket 008
- **Verification command**: `npm run test:client`
