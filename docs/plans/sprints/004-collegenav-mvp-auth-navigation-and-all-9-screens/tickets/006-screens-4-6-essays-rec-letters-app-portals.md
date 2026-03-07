---
id: "006"
title: "Screens 4–6: Essays, Rec Letters, App Portals"
status: todo
use-cases:
  - SUC-009
  - SUC-010
depends-on:
  - "004"
---

# Screens 4–6: Essays, Rec Letters, App Portals

## Description

Implement three more feature screen pages as static layouts with local React
state. Also build the `ChecklistItem` shared UI primitive used in screens 5 and 6.

**Wireframe reference**: `docs/Concept/wireframes.html` — Screens S5, S6, S7.

## Shared UI Primitive to Build

**`client/src/components/ChecklistItem.tsx`:**
- Props: `checked` (boolean), `label`, `subtext?`, `onChange`.
- Renders a checkbox square + label + optional subtext line.
- Checked state: green filled checkbox.

## Screen Implementations

**`client/src/pages/screens/Essays.tsx`** (`/essays`):
- Essay Timeline: three cards with colored titles (Late May–June in red, July in amber, August in green), each with a description of what essays are due.
- Google Drive Setup section: box listing the six folder document labels as green `TagChip` components (UC PIQs, Personal Statement, Supplementals, Honors Essays, Scholarships, Activities List).
- "Why Us?" Assistant section: school name text input + "Research →" button (non-functional placeholder in Sprint 004, Browser MCP wired in Sprint 007). Output area shows placeholder text.

**`client/src/pages/screens/RecLetters.tsx`** (`/recs`):
- Rec Letter Checklist: six `ChecklistItem` components with the following items and subtexts (initial checked state: first two checked):
  1. "Build relationships with teachers" — "Ask questions, attend office hours — Junior Year (ongoing)"
  2. "Request rec letter in person (2–3 teachers)" — "Done by end of Junior Year"
  3. "Complete brag packet, FERPA & teacher forms" — "Due: Summer before Senior Year"
  4. "Give brag packet + FERPA to teachers & counselor" — "Due: First week of Senior Year"
  5. "Add teachers & counselor on Common App" — "Due: First week of Senior Year"
  6. "Write thank you notes + gift" — "After submission"
- Teacher Tracker: three example cards (Ms. Johnson, Mr. Patel, Counselor Ms. Lee) with status subtexts. State held in `useState`.

**`client/src/pages/screens/Portals.tsx`** (`/portals`):
- Key Dates: two cards with left color borders — Common App/UC App (red border) and CSU Application (amber border).
- My Application Portals section: placeholder empty state text.
- Two example portal cards (Common App with green "In Progress" tag, UC Application with amber "Not Started" tag). State held in `useState`.
- "+ Add Portal" button (no-op in Sprint 004).

## Acceptance Criteria

- [ ] `/essays` renders timeline cards with correct month labels and colors
- [ ] `/essays` renders Google Drive folder tag list
- [ ] `/essays` renders "Why Us?" input and button (non-functional)
- [ ] `/recs` renders all 6 checklist items; first 2 pre-checked; checkboxes toggle in `useState`
- [ ] `/recs` renders teacher tracker cards
- [ ] `/portals` renders key date cards with colored left borders
- [ ] `/portals` renders portal status cards with colored tags
- [ ] All three screens reachable from sidebar

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: None in this ticket — covered by ticket 008
- **Verification command**: `npm run test:client`
