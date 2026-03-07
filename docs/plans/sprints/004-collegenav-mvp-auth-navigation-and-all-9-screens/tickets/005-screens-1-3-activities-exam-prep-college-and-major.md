---
id: "005"
title: "Screens 1–3: Activities, Exam Prep, College and Major"
status: todo
use-cases:
  - SUC-006
  - SUC-007
  - SUC-008
depends-on:
  - "004"
---

# Screens 1–3: Activities, Exam Prep, College and Major

## Description

Implement the first three feature screen pages as static forms with local
React state. Also build the shared `TagChip` and `BadgeLabel` UI primitives
used across these screens.

**Wireframe reference**: `docs/Concept/wireframes.html` — Screens S2, S3, S4.

## Shared UI Primitives to Build

**`client/src/components/TagChip.tsx`:**
- Props: `label`, `selected` (boolean), `onClick`.
- Selected: blue background (`#e8eaf6`), blue text (`#3949ab`).
- Clickable for toggling in questionnaire contexts.

**`client/src/components/BadgeLabel.tsx`:**
- Props: `variant: 'reach' | 'target' | 'safety'`, `label`.
- Reach: red tint. Target: amber tint. Safety: green tint.

## Screen Implementations

**`client/src/pages/screens/Activities.tsx`** (`/activities`):
- Interests questionnaire: row of `TagChip` components (Science, Leadership, Arts, Community, Tech). Toggle state in `useState`.
- GPA input field.
- SAT Score and ACT Score input fields (side by side).
- AI Recommendations section: placeholder card with "Complete questionnaire to see recommendations" for Extracurriculars and Summer Programs.
- 4-year course plan grid: four columns (9th, 10th, 11th, 12th Grade). 11th grade column shows a warning style (red border). Content is placeholder text.

**`client/src/pages/screens/Exams.tsx`** (`/exams`):
- SAT or ACT section: box with "Answer 5 quick questions" and a placeholder result line.
- Two cards: SAT Prep (with "Register for SAT →" button as a styled link) and Test Day Reminders.
- AP Exam Tracker: tag-style input area showing AP courses as `TagChip` components (use `useState` for the list). "+ Add" chip opens a simple text input.
- Suggested Study Schedule card: placeholder text.
- Warning box about registering AP exams early.

**`client/src/pages/screens/Colleges.tsx`** (`/colleges`):
- Major Questionnaire: salary goal input + professional interest area input (side by side).
- Recommended Majors row: placeholder `TagChip` chips (Computer Science, Biomedical Eng., Data Science).
- College list section header: "My College List" with goal count note.
- Three example college cards with `BadgeLabel` (MIT/Reach, UCLA/Target, Cal Poly SLO/Safety). Content held in `useState`.
- "+ Add a school" placeholder card.

## Acceptance Criteria

- [ ] `/activities` renders interests questionnaire with clickable tag chips
- [ ] `/activities` renders 4-year course plan grid with 4 columns; 11th grade column shows warning style
- [ ] `/exams` renders SAT/ACT section, AP tracker (chips addable via state), and study schedule placeholder
- [ ] `/colleges` renders major questionnaire, recommended majors chips, and college list with reach/target/safety badges
- [ ] All three screens are reachable from the sidebar
- [ ] No API calls are made — all state is local `useState`
- [ ] Form inputs accept user input (controlled components)

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: None in this ticket — covered by ticket 008
- **Verification command**: `npm run test:client`
