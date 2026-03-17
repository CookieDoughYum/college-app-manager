---
id: "002"
title: "Claude API service and AI recommendation endpoints"
status: todo
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
  - SUC-005
  - SUC-006
depends-on:
  - "001"
---

# Claude API service and AI recommendation endpoints

## Description

1. Install `@anthropic-ai/sdk` in the server package.
2. Create `server/src/services/claude.ts` — wraps the Anthropic SDK with an
   `askClaude(prompt)` function.
3. Create `server/src/routes/ai.ts` with 5 POST endpoints mounted at `/api/ai`.
   Mount in `app.ts`.

Each endpoint reads student data, builds a context prompt, calls Claude,
saves the result to `aiRecommendations`, and returns `{ result: string }`.

## Acceptance Criteria

- [ ] `@anthropic-ai/sdk` installed in `server/package.json`
- [ ] `server/src/services/claude.ts` exports `askClaude(prompt)`
- [ ] `POST /api/ai/activities/recommend` returns AI text
- [ ] `POST /api/ai/exams/recommend` returns SAT/ACT recommendation
- [ ] `POST /api/ai/colleges/recommend` returns major recommendations
- [ ] `POST /api/ai/decide/compare` returns pros/cons comparison
- [ ] `POST /api/ai/financialaid/scholarships` returns scholarship matches
- [ ] All endpoints return 401 for unauthenticated requests
- [ ] All endpoints cache result in `aiRecommendations`

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: covered by ticket #005
- **Verification command**: `npm run test:server`
