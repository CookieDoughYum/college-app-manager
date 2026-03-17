---
id: '002'
title: Web fetch service and Why Us + Deadline Scraper AI endpoints
status: in-progress
use-cases:
- SUC-001
- SUC-002
depends-on:
- '001'
---

# Web fetch service and Why Us + Deadline Scraper AI endpoints

## Description

Create `server/src/services/webFetch.ts` that fetches a URL and returns
stripped plain text (no script/style tags, truncated to 8000 chars, 10s timeout).

Add two new POST endpoints to `server/src/routes/ai.ts`:

- `POST /api/ai/essays/whyus` — accepts `{ schoolName, url? }`, fetches the
  school page, asks Claude for "Why Us?" talking points, saves to
  `StudentEssays.whyUsResults[schoolName]`, returns `{ result }`
- `POST /api/ai/deadlines/scrape` — reads the student's college list from
  `StudentColleges`, fetches each school's admissions page, asks Claude to
  extract deadlines as JSON, merges into `StudentDeadlines.manualDeadlines`,
  returns `{ result, deadlines }`

## Acceptance Criteria

- [x] `server/src/services/webFetch.ts` exists and strips HTML to plain text
- [x] `POST /api/ai/essays/whyus` returns 401 without auth, `{ result }` with auth
- [x] `POST /api/ai/essays/whyus` saves result to `StudentEssays.whyUsResults`
- [x] `POST /api/ai/deadlines/scrape` returns 401 without auth
- [x] `POST /api/ai/deadlines/scrape` iterates college list and merges deadlines
- [x] Failed fetches for individual schools are skipped gracefully

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/webResearch.test.ts` (ticket #004)
- **Verification command**: `npm run test:server`
