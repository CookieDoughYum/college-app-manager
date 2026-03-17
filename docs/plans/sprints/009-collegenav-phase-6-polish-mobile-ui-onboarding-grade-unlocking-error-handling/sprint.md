---
id: "009"
title: "CollegeNav Phase 6 — Polish (Mobile UI, Onboarding, Grade Unlocking, Error Handling)"
status: active
branch: sprint/009-collegenav-phase-6-polish-mobile-ui-onboarding-grade-unlocking-error-handling
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
---

# Sprint 009: CollegeNav Phase 6 — Polish (Mobile UI, Onboarding, Grade Unlocking, Error Handling)

## Goals

Ship a production-quality v1. Make the app usable on phones, guide new
students through setup, surface only grade-appropriate screens, and handle
errors gracefully so students are never left staring at a blank page.

## Problem

Sprints 004–008 built all the features. But the app still has rough edges:

1. The layout breaks on mobile (fixed sidebar, no responsive grid).
2. New students land on the Dashboard with no guidance — they don't know
   where to start or what each screen does.
3. An 8th grader sees the Decide screen (college acceptance results) which
   is irrelevant for them. Grade-irrelevant screens cause confusion.
4. When a network request fails or Claude returns an error, the UI silently
   breaks or shows nothing. Students have no feedback.

## Solution

1. **Mobile-responsive layout**: Replace fixed sidebar with a hamburger menu
   on small screens. Make progress card grid responsive (1-column on mobile).
2. **Onboarding flow**: After first login (when no screen data exists), show
   a brief "What to do first" overlay that links to the most relevant screen
   for the student's grade.
3. **Grade-based screen unlocking**: The sidebar shows screens as active or
   dimmed based on grade:
   - Grades 8–9: Activities, Exams visible; others dimmed with tooltip
   - Grade 10: + Colleges unlocked
   - Grade 11: + Essays, Rec Letters unlocked
   - Grade 12: All screens unlocked
4. **Error handling**: All fetch calls get try/catch with user-visible error
   messages. AI endpoint failures show "Could not generate — try again" in
   the recommendation section instead of nothing.

## Success Criteria

- App layout is usable on a 375px-wide viewport
- New students see an onboarding prompt on first Dashboard visit
- Screens are visually locked/unlocked based on grade
- Failed fetch calls show an error message, not a blank state
- All existing tests still pass

## Scope

### In Scope

- Responsive CSS for the AppLayout sidebar (hamburger on mobile)
- Responsive grid for Dashboard progress cards
- First-visit onboarding overlay (dismissed with localStorage flag)
- Grade-based sidebar item states (active vs. dimmed)
- User-visible error messages for failed AI endpoint calls
- Error boundary for the React app (catch unexpected render errors)

### Out of Scope

- Native mobile app (iOS/Android)
- Accessibility audit (WCAG AA compliance)
- Internationalization
- Contributor documentation (moved to post-v1)

## Test Strategy

Client render tests verify onboarding overlay renders and dismisses.
Existing tests must all pass — no regressions.

## Architecture Notes

- Mobile layout uses CSS media queries only — no JS breakpoint detection.
- Onboarding dismissed flag stored in `localStorage` — simple, no DB needed.
- Grade-based locking is purely presentational — locked screens are still
  accessible via URL, but the sidebar provides the primary navigation hint.
- Error messages are inline in the component, not global toast notifications.

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [x] Sprint planning documents are complete (sprint.md, use cases, technical plan)
- [x] Architecture review passed
- [x] Stakeholder has approved the sprint plan

## Tickets

- **#001** Mobile-responsive layout and grade-based sidebar locking
- **#002** First-visit onboarding overlay
- **#003** Error handling for AI recommendation calls
