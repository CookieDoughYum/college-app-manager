---
id: "004"
title: "Server tests for web research endpoints"
status: todo
use-cases:
  - SUC-001
  - SUC-002
depends-on:
  - "002"
---

# Server tests for web research endpoints

## Description

Write `tests/server/webResearch.test.ts` that mocks both `@anthropic-ai/sdk`
and `global.fetch` to test the two new web research endpoints.

Verify:
- 401 for unauthenticated requests to both endpoints
- `whyus` endpoint passes school name and page text to Claude
- `whyus` result is saved to `StudentEssays.whyUsResults`
- `scrape` endpoint iterates the college list
- `scrape` skips schools whose fetch fails
- All existing server tests still pass

## Acceptance Criteria

- [ ] Unauthenticated requests to `/api/ai/essays/whyus` return 401
- [ ] Unauthenticated requests to `/api/ai/deadlines/scrape` return 401
- [ ] `whyus` returns `{ result: string }` and caches in `whyUsResults`
- [ ] `scrape` iterates college list and returns merged deadlines
- [ ] Failed fetches for a school are skipped without crashing
- [ ] All 100+ existing server tests still pass

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/webResearch.test.ts`
- **Verification command**: `npm run test:server`
