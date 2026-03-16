---
id: '004'
title: "CollegeNav MVP \u2014 Auth, Navigation, and All 9 Screens"
status: done
branch: sprint/004-collegenav-mvp-auth-navigation-and-all-9-screens
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
- SUC-010
- SUC-011
---

# Sprint 004: CollegeNav MVP — Auth, Navigation, and All 9 Screens

## Goals

Deliver a working, navigable CollegeNav application with all 9 feature screens
visible and usable, even though data is not yet persisted between sessions
(persistence comes in Sprint 005). A student can sign up, log in, navigate the
full app, and interact with all forms and checklists in a single session.

This is Phase 1 of the Build Strategy: the simplest useful version that
validates the entire screen structure and unblocks future sprints.

## Problem

The project starts from the docker-node-template with no CollegeNav-specific
screens, routing, or data models. Students have no place to begin their college
planning journey.

## Solution

Replace the placeholder frontend with the full CollegeNav app shell:
- Auth routes (signup, login, logout) with Passport.js local strategy
- A persistent sidebar layout matching the wireframe design
- All 11 screens implemented as React pages with forms and static content
- A Prisma schema capturing the Student profile and session data
- API routes for auth and a placeholder student-profile endpoint
- Grade-based navigation: screens are visible but labeled appropriately for
  the student's grade

Data entered in forms is held in React state for the session but not yet saved
to the database (that is Sprint 005). The goal is a complete, navigable skeleton.

## Success Criteria

- [ ] Student can sign up with name, email, password, high school, and grade level
- [ ] Student can log in and log out; session persists across page refreshes
- [ ] All 11 screens (Signup, Dashboard, and Screens 1–9) are reachable via sidebar navigation
- [ ] Dashboard shows the student's name, school, grade, and placeholder progress bars
- [ ] Each screen renders the correct layout and fields matching the wireframes
- [ ] No broken routes or blank pages in the app
- [ ] All existing tests continue to pass
- [ ] Server and client build without errors

## Scope

### In Scope

- Student signup and login (email + password, Passport.js local strategy)
- Logout endpoint
- Express session middleware (already present; wire to student auth)
- Prisma `Student` model (id, name, email, passwordHash, highSchool, grade, createdAt)
- Auth API routes: `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`
- React app restructure: replace `ExampleIntegrations` root with CollegeNav app shell
- Sidebar layout component with navigation links for all 9 screens + Dashboard
- React Router routes for all 11 pages
- All 9 feature screen pages (static forms matching wireframe layout and fields):
  - Screen 1: Activities & Course Planning
  - Screen 2: Exam Preparation
  - Screen 3: College & Major Exploration
  - Screen 4: Essay Writing
  - Screen 5: Letter of Recommendation Tracker
  - Screen 6: Application Portals
  - Screen 7: Deciding Which School
  - Screen 8: Scholarships & Financial Aid
  - Screen 9: Automated Deadline Tracker
- Dashboard page with welcome message, grade tag, and placeholder progress cards
- Signup and Login pages
- Protected route wrapper (redirect to login if not authenticated)
- Basic CSS / styling consistent with the wireframe color scheme (dark navy sidebar, red accent `#e94560`)
- Server tests for auth routes (signup, login, logout, /me)
- Client tests for layout and at least one feature page

### Out of Scope

- Saving any form data to the database (Sprint 005)
- AI recommendations (Sprint 006)
- Browser MCP / live web scraping (Sprint 007)
- Reminders or date-aware highlighting (Sprint 008)
- GitHub OAuth or Google OAuth (template sprints; not used for student auth)
- Admin dashboard changes
- Mobile-specific layout optimization (Sprint 009)

## Test Strategy

- **Server (Jest + Supertest):** Auth route tests — happy path and error cases
  for signup, login, logout, and `/api/auth/me`. Confirm sessions are established
  and the `Student` model is written.
- **Client (Vitest + React Testing Library):** Render tests for the sidebar
  layout, the Dashboard page, and at least two feature screen pages to confirm
  they mount without errors and show expected headings.
- All existing tests (admin, counter, health) must continue passing.

## Architecture Notes

- Passport.js local strategy is already wired for admin auth; student auth
  reuses the same session infrastructure with a different passport strategy
  and a new `Student` model.
- The `requireAdmin` middleware pattern is reused as `requireAuth` for student
  routes.
- The wireframe design uses a fixed left sidebar (180px) with a dark navy
  background and a main content area. This maps to a React layout component
  wrapping child routes via React Router's `<Outlet />`.
- Reference wireframes for exact field names, labels, and layout:
  `docs/Concept/wireframes.html`

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [x] Sprint planning documents are complete (sprint.md, use cases, technical plan)
- [ ] Architecture review passed
- [ ] Stakeholder has approved the sprint plan

## Tickets

(To be created after sprint approval.)
