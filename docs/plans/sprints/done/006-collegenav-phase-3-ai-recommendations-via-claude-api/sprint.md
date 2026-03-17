---
id: '006'
title: "CollegeNav Phase 3 \u2014 AI Recommendations via Claude API"
status: done
branch: sprint/006-collegenav-phase-3-ai-recommendations-via-claude-api
use-cases:
- SUC-001
- SUC-002
- SUC-003
- SUC-004
- SUC-005
- SUC-006
---

# Sprint 006: CollegeNav Phase 3 — AI Recommendations via Claude API

## Goals

Bring Claude into the app. Replace all "Complete your profile to see recommendations"
placeholders with real AI-generated output. After this sprint the app actively
helps students — recommending extracurriculars, flagging heavy course loads,
advising on SAT vs ACT, suggesting college majors, matching scholarships, and
comparing accepted schools.

## Problem

Sprint 005 made the app durable but still passive. All 9 screens still show
static placeholder text where AI recommendations should appear. Students have no
guidance yet.

## Solution

Add a Claude API service layer on the server. Each screen that promises an AI
recommendation gets a corresponding backend endpoint that reads the student's
stored data, builds a context-aware prompt, calls `claude-sonnet-4-6`, and
streams or returns the response. The React screens call these endpoints and
display the results.

## Success Criteria

- Activities screen shows personalized extracurricular and summer program recommendations
- Activities screen warns when the course plan has too many APs in one year
- Exams screen recommends SAT or ACT based on student answers
- Colleges screen recommends majors based on salary goal and interest area
- Colleges screen recommends schools based on GPA and chosen major
- Decide screen generates a pros/cons comparison for the student's accepted schools
- Financial Aid screen recommends scholarships matched to the student's profile tags
- All AI endpoints are protected by `requireAuth`
- Claude API key is loaded from environment (`ANTHROPIC_API_KEY`)

## Scope

### In Scope

- `server/src/services/claude.ts` — Claude API client wrapper using `@anthropic-ai/sdk`
- AI endpoints under `/api/ai/` for each recommendation type
- React screen updates to call AI endpoints and display streamed/returned text
- Server tests that mock the Claude API

### Out of Scope

- "Why Us?" essay assistant (requires Browser MCP — Sprint 007)
- Automated deadline scraping (Sprint 007)
- AP study schedule (Sprint 008)
- Real-time streaming to the browser (responses returned as JSON strings for now)

## Test Strategy

Server tests mock the Anthropic SDK and verify that prompts include the
expected student context. Client render tests verify the AI response is
displayed when returned.

## Architecture Notes

The Claude API is called server-side only — the API key never reaches the browser.
Responses are stored in the database alongside the student's screen data so that
re-loading a page shows the last AI response without re-calling Claude.

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [x] Sprint planning documents are complete (sprint.md, use cases, technical plan)
- [x] Architecture review passed
- [x] Stakeholder has approved the sprint plan

## Tickets

_(populated during ticketing phase)_
