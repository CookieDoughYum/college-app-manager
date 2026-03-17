---
id: "004"
title: "Wire AI recommendations into Decide and Financial Aid screens"
status: todo
use-cases:
  - SUC-005
  - SUC-006
depends-on:
  - "002"
---

# Wire AI recommendations into Decide and Financial Aid screens

## Description

Update Decide and FinancialAid screen components to:
- Load cached `aiRecommendations` on mount
- Show action buttons ("Generate Comparison", "Find Scholarships")
- Call the relevant `/api/ai/*` endpoint when clicked
- Display the returned text replacing static placeholders

## Acceptance Criteria

- [ ] Decide: pros/cons comparison appears after clicking "Generate Comparison"
- [ ] FinancialAid: matched scholarships appear after clicking "Find Scholarships"
- [ ] Cached results are shown on page load
- [ ] Loading spinner shown during fetch

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: None
- **Verification command**: `npm run test:client`
