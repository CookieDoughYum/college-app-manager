---
id: "005"
title: "Server tests for AI recommendation endpoints"
status: done
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
  - SUC-005
  - SUC-006
depends-on:
  - "002"
---

# Server tests for AI recommendation endpoints

## Description

Write tests in `tests/server/aiRecommendations.test.ts` that mock
`@anthropic-ai/sdk` and verify all AI endpoints behave correctly.

## Acceptance Criteria

- [x] Unauthenticated requests to all `/api/ai/*` routes return 401
- [x] Each endpoint returns `{ result: string }` on success
- [x] Prompt sent to Claude includes relevant student context
- [x] Result is saved to `aiRecommendations` in the screen model
- [x] All existing server tests still pass

## Testing

- **Existing tests to run**: `npm run test:server`
- **New tests to write**: `tests/server/aiRecommendations.test.ts`
- **Verification command**: `npm run test:server`
