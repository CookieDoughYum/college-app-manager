---
id: "003"
title: "Wire AI recommendations into Activities, Exams, and Colleges screens"
status: todo
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
depends-on:
  - "002"
---

# Wire AI recommendations into Activities, Exams, and Colleges screens

## Description

Update Activities, Exams, and Colleges screen components to:
- Load cached `aiRecommendations` from the GET endpoint on mount
- Show a "Get Recommendations" button
- Call the relevant `/api/ai/*` endpoint when clicked
- Show a loading spinner while the request is in flight
- Display the returned text in the recommendation section

## Acceptance Criteria

- [ ] Activities: recommendations appear after clicking "Get Recommendations"
- [ ] Activities: course load warning appears when >3 APs in one grade
- [ ] Exams: SAT/ACT recommendation appears after clicking button
- [ ] Colleges: major recommendations replace the static list
- [ ] Cached recommendations are shown on page load (no re-fetch needed)
- [ ] Loading spinner shown during fetch

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: None (screens tested by existing render tests)
- **Verification command**: `npm run test:client`
