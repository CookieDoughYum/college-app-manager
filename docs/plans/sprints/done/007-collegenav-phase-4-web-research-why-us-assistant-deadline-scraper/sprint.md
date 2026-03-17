---
id: '007'
title: "CollegeNav Phase 4 \u2014 Web Research (Why Us Assistant + Deadline Scraper)"
status: done
branch: sprint/007-collegenav-phase-4-web-research-why-us-assistant-deadline-scraper
use-cases:
- SUC-001
- SUC-002
---

# Sprint 007: CollegeNav Phase 4 — Web Research (Why Us Assistant + Deadline Scraper)

## Goals

Bring live web data into the app. Replace the two remaining static
placeholders — the Essays "Why Us?" section and the Deadlines calendar —
with Claude-powered features that fetch real content from school websites.

## Problem

Sprint 006 added AI recommendations based on data the student entered
manually. Two high-value features still show static placeholders because
they require fetching live information from the web:

1. The "Why Us?" essay assistant needs specific, current information about
   each school — programs, values, and talking points that generic AI cannot
   generate without visiting the school's site.
2. The Deadlines calendar is empty. Students must manually enter every
   deadline. Automating this from admissions pages saves significant time
   and reduces missed deadlines.

## Solution

Add a server-side web fetch service that retrieves HTML from a URL, strips
it to plain text, and passes it to Claude for analysis. Two new AI endpoints
use this service:

- `POST /api/ai/essays/whyus` — fetches the school's website, extracts
  talking points relevant to "Why Us?" essays
- `POST /api/ai/deadlines/scrape` — iterates the student's college list,
  fetches each school's admissions page, and asks Claude to extract
  application deadlines

No browser automation is required — standard HTTP fetch handles the vast
majority of public university admissions pages.

## Success Criteria

- Essays screen "Why Us?" section accepts a school name + URL and returns
  specific talking points for the "Why Us?" essay prompt
- Deadlines screen has a "Fetch Deadlines" button that populates the
  calendar from the student's college list
- Scraped deadlines are saved to `StudentDeadlines.manualDeadlines` and
  restored on page reload
- "Why Us?" results are saved to `StudentEssays` and restored on reload
- All new AI endpoints return 401 for unauthenticated requests
- Server tests mock `fetch` and verify prompt construction and caching

## Scope

### In Scope

- `server/src/services/webFetch.ts` — fetches a URL and returns plain text
- `POST /api/ai/essays/whyus` — "Why Us?" endpoint
- `POST /api/ai/deadlines/scrape` — deadline scraper endpoint
- Schema update: add `whyUsResults Json @default("{}") ` to `StudentEssays`
- Essays screen: "Why Us?" input form + result display
- Deadlines screen: "Fetch Deadlines" button + calendar display updates
- Server tests mocking fetch

### Out of Scope

- JavaScript-rendered pages (dynamic SPA sites) — plain HTML fetch covers
  most public university admissions pages; JS rendering is Sprint 008+
- Essay draft assistance or writing critique
- Real-time deadline change detection

## Test Strategy

Server tests mock `global.fetch` or the webFetch service and verify:
- 401 for unauthenticated requests
- Prompt includes the student's college list and fetched page content
- Results saved and cached in the database

Client render tests verify the new UI sections display fetched results.

## Architecture Notes

- Web fetch is synchronous per school; for the deadline scraper, the server
  fetches schools sequentially (not in parallel) to avoid rate-limiting.
- `fetch` built into Node 18+ — no extra dependency needed.
- If a school URL fetch fails (404, timeout), that school is skipped and
  the error is noted in the response but does not fail the entire request.
- Results are plain text rendered in `<pre>` tags, consistent with Sprint 006.

## Definition of Ready

Before tickets can be created, all of the following must be true:

- [x] Sprint planning documents are complete (sprint.md, use cases, technical plan)
- [x] Architecture review passed
- [x] Stakeholder has approved the sprint plan

## Tickets

- **#001** Prisma schema — add whyUsResults field and migration
- **#002** Web fetch service and Why Us + Deadline Scraper AI endpoints
- **#003** Wire Why Us assistant and Deadline Scraper into Essays and Deadlines screens
- **#004** Server tests for web research endpoints
