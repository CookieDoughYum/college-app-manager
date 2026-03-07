---
status: review
---

# Project Overview

## Reference Materials

- **Wireframes:** [`docs/Concept/wireframes.html`](../Concept/wireframes.html) — Full HTML mockups for all 11 screens (Signup, Dashboard, and Screens 1–9). Refer to this file when designing UI layout, component structure, and field names for any sprint.
- **Build Strategy:** `docs/Concept/Build Strategy.pdf` — Phased development plan describing what to build in each phase, what to skip, and feasibility estimates.

## Project Name

CollegeNav — College Application Navigator

## Problem Statement

Most high school students navigate the college application process without a
clear roadmap. They rely on overworked school counselors, scattered internet
research, and word of mouth — a system that consistently favors students who
already have resources, connections, and informed parents. The result is that
many capable students either under-apply (aiming too low), over-apply
inefficiently (wasting effort), or miss critical deadlines and opportunities
entirely.

There is no single, personalized guide that walks a student through the entire
journey — from course selection and extracurriculars through enrollment — while
adapting to that student's specific profile, goals, and timeline.

## Target Users

**Primary:** Middle and high school students (grades 8–12) in the United States
who are planning to apply to college. The app is designed to be used
independently, without requiring a counselor or parent to drive the experience.

**V1 scope:** Students only. Parent and counselor views are out of scope for
the initial build.

## Key Constraints

- **Technology:** Existing docker-node-template stack (Express + React +
  TypeScript + PostgreSQL + Prisma + Docker Swarm).
- **AI:** Claude API powers conversational recommendations. Browser MCP enables
  live web scraping for deadlines and school research (Phase 4+).
- **Monetization:** Free to use — no paywall or subscription in this version.
- **Team:** AI-assisted development (CLASI process); future contributors can
  pick up any self-contained phase.
- **Build strategy:** Phases are self-contained and ordered by value. The app
  is useful after Phase 1 and improves incrementally. See phased plan below.

## High-Level Requirements

The app is organized into 9 feature screens plus a signup/onboarding screen and
a dashboard. Each screen is a self-contained module.

### Onboarding & Account
- Student can sign up with name, email, high school, and grade level (8–12).
- Grade level unlocks/recommends relevant screens.
- App recommends creating a dedicated email for college applications.
- Student can log in and log out.

### Dashboard
- Shows progress across all 9 screens as progress bars.
- Surfaces action items generated from grade level and incomplete tasks.
- Greets the student by name and shows grade/school.

### Screen 1 — Activities & Course Planning
- Student fills out an interests questionnaire (interests, GPA, test scores).
- App (via Claude API) recommends extracurriculars and summer programs.
- App warns when course load is too heavy (e.g., 4 APs in one year).
- Student builds and saves a 4-year course plan with per-grade warnings.

### Screen 2 — Exam Preparation
- 5-question quiz determines whether SAT or ACT is recommended.
- Links to registration, prep materials, and test-day checklist.
- AP exam tracker: student enters which APs they're taking.
- Claude generates a study schedule based on selected AP courses.

### Screen 3 — College & Major Exploration
- Major questionnaire (salary goal, interest area) → Claude recommends majors.
- Student builds a college list with reach/target/safety labels.
- Running count toward the goal (e.g., 5 reach, 10 target, 5 safety).
- Claude recommends schools based on GPA, interests, and chosen major.

### Screen 4 — Essay Writing
- Displays a timeline: UC PIQs (May–June), Supplementals (July), Honors (Aug).
- Google Drive folder setup guide with recommended document structure.
- "Why Us?" AI assistant: student enters a school name; Claude researches the
  school's website and returns specific programs, values, and talking points.
  (Requires Browser MCP — Phase 4.)

### Screen 5 — Letter of Recommendation Tracker
- Step-by-step checklist covering the full rec letter lifecycle (relationship
  building → request → brag packet → Common App add → thank you).
- Checklist items are date-aware: the next action highlights based on current
  date and grade.
- Teacher tracker: per-teacher status (requested, brag packet given, etc.).

### Screen 6 — Application Portals
- Key date cards: Common App / UC App open Aug 1; CSU opens Oct 1.
- Student saves links to their application portals in one place.
- Status tags per portal (Not Started, In Progress, Submitted).
- Reminder to check portals regularly surfaces on dashboard.

### Screen 7 — Deciding Which School
- Student logs acceptance results (accepted, waitlisted, denied) per school.
- Claude provides pros/cons comparison based on the student's original
  questionnaire priorities (location, cost, major fit).
- Honors program links auto-surfaced for accepted schools.

### Screen 8 — Scholarships & Financial Aid
- FAFSA and CSS Profile reminder checklist (parent-directed action items).
- Scholarship questionnaire (first-gen, STEM, state, community service tags).
- Claude recommends scholarships matched to profile with deadlines.
- Deadline color-coding: red = soon, orange = upcoming, green = ample time.

### Screen 9 — Automated Deadline Tracker
- Calendar view auto-populated from the student's college list.
- Claude (via Browser MCP) scrapes application deadlines from each school's
  admissions site and plots them on the calendar. (Phase 4.)
- Upcoming deadlines listed with days-until countdown and reach/target/safety
  badge.

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend API | Express 4 + TypeScript (Node.js 20 LTS) |
| Frontend SPA | Vite + React + TypeScript |
| Database | PostgreSQL 16 Alpine via Prisma ORM |
| AI | Claude API (Anthropic) — `claude-sonnet-4-6` |
| Live web data | Browser MCP (Phase 4+) |
| Auth | Express session + Passport.js (local strategy) |
| Containerization | Docker Compose (dev), Docker Swarm (prod) |
| Secrets | SOPS + age at rest; Docker Swarm secrets at runtime |
| Reverse proxy | Caddy (`collegenav.jtlapp.net`) |

All API routes prefixed with `/api`. PostgreSQL is the single data store.

## Sprint Roadmap

The build strategy defines 6 phases. Each phase maps to one or more sprints.

| Phase | Sprint(s) | Focus | Feasibility |
|-------|-----------|-------|-------------|
| **Phase 1 — MVP** | Sprint 004 | Auth, all 9 screens as static forms/checklists, navigation, dashboard | Full sprint |
| **Phase 2 — Persistence** | Sprint 005 | Database schema, save all user data between sessions | Full sprint |
| **Phase 3 — AI Recommendations** | Sprint 006 | Claude API: extracurricular recs, course load warnings, SAT/ACT advisor, college/major recs, scholarship matching, pros/cons | Full sprint |
| **Phase 4 — Browser MCP** | Sprint 007 | "Why Us?" assistant, automated deadline scraping and calendar population | Full sprint |
| **Phase 5 — Reminders** | Sprint 008 | In-app banners, AP study schedule generator, timeline nudges, date-aware checklist highlighting | Full sprint |
| **Phase 6 — Polish** | Sprint 009 | Mobile-friendly UI, onboarding flow, grade-based screen unlocking, error handling, contributor docs | Full sprint |

**Sprint 004 is the starting point.** Phases 1 and 2 are the highest priority;
Phases 3–6 layer on incrementally and each is independently useful.

## Out of Scope

- Parent and counselor accounts or dashboards (v1 is student-only)
- Paid features, subscriptions, or any monetization mechanism
- Real-time college admissions data feeds or integrations with Common App,
  Coalition App, or any third-party application portal
- Actual letter of recommendation submission or email delivery
- Direct integration with high school SIS (student information systems)
- Mobile native apps (iOS/Android) — web-only in v1
- Multi-language support
- FERPA compliance infrastructure
