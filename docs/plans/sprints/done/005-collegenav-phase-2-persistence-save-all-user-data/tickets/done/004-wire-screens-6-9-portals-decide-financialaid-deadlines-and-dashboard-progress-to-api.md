---
id: "004"
title: "Wire screens 6–9 (Portals, Decide, FinancialAid, Deadlines) and Dashboard progress to API"
status: done
use-cases:
  - SUC-006
  - SUC-007
  - SUC-008
  - SUC-009
depends-on:
  - "002"
---

# Wire screens 6–9 (Portals, Decide, FinancialAid, Deadlines) and Dashboard progress to API

## Description

Update the four remaining React screen components and the Dashboard to use the API.

## Acceptance Criteria

- [x] Portals screen loads and saves portal list
- [x] Decide screen loads and saves acceptance results
- [x] FinancialAid screen loads and saves FAFSA checklist and scholarship answers
- [x] Deadlines screen loads and saves manual deadline entries
- [x] Dashboard fetches `/api/student/progress` and renders real percentages
- [x] Each screen shows a loading state while fetching
- [x] Dashboard progress bars update after data is saved on a screen

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: Updated Activities test to mock fetch
- **Verification command**: `npm run test:client`
