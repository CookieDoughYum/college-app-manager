---
id: "005"
title: "CollegeNav Phase 2 — Persistence: Save All User Data"
status: planning
branch: sprint/005-collegenav-phase-2-persistence-save-all-user-data
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
  - SUC-005
  - SUC-006
  - SUC-007
  - SUC-008
  - SUC-009
---

# Sprint 005: CollegeNav Phase 2 — Persistence: Save All User Data

## Goals

Make all 9 feature screens durable. Every form input, checklist toggle, college
list entry, and tag selection a student makes is saved to the database and
restored the next time they visit. After this sprint a student can close the
browser and return to find their work exactly as they left it.

## Problem

Sprint 004 built all 9 screens as static React components with ephemeral local
state. Refreshing the page loses all student work. Students cannot build up
their college plan incrementally over weeks — the app is not usable yet.

## Solution

1. Extend the Prisma schema with models covering each screen's data.
2. Add a `/api/student/` REST layer (GET + PUT endpoints per screen), all
   protected by `requireAuth`.
3. Wire each screen component to load data on mount and save on action.
4. Wire the Dashboard progress bars to real completion percentages.

## Success Criteria

- All 9 screens restore data on page load
- All 9 screens persist changes to the server immediately or on save action
- Dashboard progress bars reflect actual stored data
- No data loss between sessions
- New API endpoints covered by server integration tests

## Scope

### In Scope

- Prisma models: `Activities`, `Exams`, `Colleges`, `Essays`, `RecLetters`,
  `Portals`, `Decide`, `FinancialAid`, `Deadlines` — all linked to `Student`
- Student profile edit endpoint (`GET/PUT /api/student/profile`)
- Per-screen data endpoints under `/api/student/`
- React screens updated to fetch on mount and save changes
- Dashboard wired to real progress data

### Out of Scope

- AI recommendations (Sprint 006)
- Browser MCP scraping (Sprint 007)
- Reminders and date-aware logic (Sprint 008)

## Test Strategy

Server integration tests using Supertest for every new endpoint. Tests verify
authenticated access, data persistence, and 401 rejection without a session.

## Architecture Notes

All student data lives under `/api/student/` routes protected by `requireAuth`.
JSONB columns handle flexible array data (college list, teacher list, AP
courses) rather than normalised junction tables — simpler and sufficient for
this data volume.

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [x] Sprint planning documents are complete (sprint.md, use cases, technical plan)
- [x] Architecture review passed
- [x] Stakeholder has approved the sprint plan

## Tickets

(To be created after sprint approval.)
