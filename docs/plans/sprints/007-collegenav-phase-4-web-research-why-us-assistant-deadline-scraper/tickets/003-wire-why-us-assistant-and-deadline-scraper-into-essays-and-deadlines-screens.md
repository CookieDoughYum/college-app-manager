---
id: "003"
title: "Wire Why Us assistant and Deadline Scraper into Essays and Deadlines screens"
status: todo
use-cases:
  - SUC-001
  - SUC-002
depends-on:
  - "002"
---

# Wire Why Us assistant and Deadline Scraper into Essays and Deadlines screens

## Description

Update the Essays and Deadlines React screens to use the new AI endpoints.

**Essays screen** (`client/src/pages/screens/Essays.tsx`):
- Add a "Why Us? Assistant" section with school name input, optional URL input,
  and a "Research School" button
- On click, POST to `/api/ai/essays/whyus`
- Show loading spinner while in flight
- Display result in a `<pre>` tag
- Load cached `whyUsResults` from the GET response on mount

**Deadlines screen** (`client/src/pages/screens/Deadlines.tsx`):
- Add a "Fetch Deadlines" button at the top
- On click, POST to `/api/ai/deadlines/scrape`
- Show loading spinner while in flight
- Merge returned deadlines into the displayed deadline list
- Save merged deadlines back to the server via PUT

## Acceptance Criteria

- [ ] Essays screen shows "Why Us? Assistant" section with school name + URL inputs
- [ ] "Research School" button calls the endpoint and displays result
- [ ] Essays screen loads cached whyUsResults on mount
- [ ] Deadlines screen has "Fetch Deadlines" button
- [ ] "Fetch Deadlines" populates the deadline list from the student's college list
- [ ] Client render tests pass

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: Update `tests/client/Essays.test.tsx` and
  `tests/client/Deadlines.test.tsx` to verify new UI sections render
- **Verification command**: `npm run test:client`
