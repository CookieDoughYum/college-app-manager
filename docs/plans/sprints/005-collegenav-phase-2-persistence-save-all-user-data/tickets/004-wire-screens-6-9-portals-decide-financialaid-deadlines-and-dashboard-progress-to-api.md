---
id: "004"
title: "Wire screens 6–9 (Portals, Decide, FinancialAid, Deadlines) and Dashboard progress to API"
status: todo
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

- `Portals.tsx` — portal list with URLs and status tags
- `Decide.tsx` — acceptance results per school
- `FinancialAid.tsx` — FAFSA checklist, scholarship questionnaire
- `Deadlines.tsx` — manual deadline entries
- `Dashboard.tsx` — fetch `/api/student/progress`; render real progress bars

## Acceptance Criteria

- [ ] Portals screen loads and saves portal list
- [ ] Decide screen loads and saves acceptance results
- [ ] FinancialAid screen loads and saves FAFSA checklist and scholarship answers
- [ ] Deadlines screen loads and saves manual deadline entries
- [ ] Dashboard fetches `/api/student/progress` and renders real percentages
- [ ] Each screen shows a loading state while fetching
- [ ] Dashboard progress bars update after data is saved on a screen

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: Update Dashboard test to mock progress fetch
- **Verification command**: `npm run test:client`
