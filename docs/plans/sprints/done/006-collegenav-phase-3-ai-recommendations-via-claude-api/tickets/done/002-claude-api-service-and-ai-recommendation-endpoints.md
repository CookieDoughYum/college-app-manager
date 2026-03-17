---
id: "002"
title: "Claude API service and AI recommendation endpoints"
status: done
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

## Acceptance Criteria

- [x] `@anthropic-ai/sdk` installed in `server/package.json`
- [x] `server/src/services/claude.ts` exports `askClaude(prompt)`
- [x] `POST /api/ai/activities/recommend` returns AI text
- [x] `POST /api/ai/exams/recommend` returns SAT/ACT recommendation
- [x] `POST /api/ai/colleges/recommend` returns major recommendations
- [x] `POST /api/ai/decide/compare` returns pros/cons comparison
- [x] `POST /api/ai/financialaid/scholarships` returns scholarship matches
- [x] All endpoints return 401 for unauthenticated requests
- [x] All endpoints cache result in `aiRecommendations`
