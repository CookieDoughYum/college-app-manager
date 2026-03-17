---
id: "008"
title: "CollegeNav Phase 5 — Reminders and Date-Aware Features"
status: active
branch: sprint/008-collegenav-phase-5-reminders-and-date-aware-features
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
---

# Sprint 008: CollegeNav Phase 5 — Reminders and Date-Aware Features

## Goals

Make the app time-aware. Surface in-app banners for upcoming deadlines,
generate a Claude-powered AP study schedule, and highlight the next action
on the Rec Letters checklist based on the student's current grade and date.

## Problem

Sprint 007 completed the core AI features. The app now has data and
recommendations but it is still passive — it waits for students to navigate
to the right screen. Students miss deadlines and forget action items because
the app doesn't surface urgency at the right time.

## Solution

1. **Dashboard action banners**: The Dashboard computes time-sensitive
   action items from the student's data (upcoming deadlines, grade-based
   reminders) and shows them as colored banners at the top.
2. **AP study schedule**: The Exams screen gets a "Generate Study Schedule"
   button. Claude reads the student's AP courses and generates a week-by-week
   study schedule leading up to May AP exams.
3. **Date-aware Rec Letters checklist**: The checklist items on Screen 5
   highlight the "next action" based on the student's grade level, surfacing
   what the student should be doing right now.

## Success Criteria

- Dashboard shows at least one time-based banner when the student has
  upcoming deadlines within 30 days
- Exams screen has a "Generate Study Schedule" button that calls Claude and
  displays the result
- Rec Letters checklist highlights the next recommended action based on grade
- All server and client tests pass

## Scope

### In Scope

- `GET /api/student/reminders` — computes time-sensitive items server-side
- Dashboard updated to fetch and display reminder banners
- Exams screen updated with "Generate Study Schedule" button calling
  `POST /api/ai/exams/schedule`
- Rec Letters screen updated with grade-aware next-action highlighting
- Server tests for the new reminder and schedule endpoints

### Out of Scope

- Email or push notifications (web-only, in-browser only)
- Customizable reminder preferences
- Reminder snooze/dismiss persistence

## Test Strategy

Server tests verify reminder computation (correct items surfaced, correct
date math). Client render tests verify banner display and schedule display.

## Architecture Notes

- Reminders are computed on-the-fly server-side — no separate cron job or
  scheduled task. Each GET /api/student/reminders call computes fresh.
- The "next action" for Rec Letters is determined by grade: 9th/10th = build
  relationships, 11th = request letters, 12th = track submission.
- AP study schedule cached in `StudentExams.aiRecommendations.schedule`.
- Date math uses server-side `Date.now()` — no client-side time needed.

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [x] Sprint planning documents are complete (sprint.md, use cases, technical plan)
- [x] Architecture review passed
- [x] Stakeholder has approved the sprint plan

## Tickets

- **#001** Reminder endpoint and Dashboard banners
- **#002** AP study schedule endpoint and Exams screen update
- **#003** Date-aware Rec Letters next-action highlight
- **#004** Server tests for reminder and study schedule endpoints
