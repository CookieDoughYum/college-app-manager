---
id: "003"
title: "Wire screens 1–5 (Activities, Exams, Colleges, Essays, RecLetters) to API"
status: done
use-cases:
  - SUC-001
  - SUC-002
  - SUC-003
  - SUC-004
  - SUC-005
depends-on:
  - "002"
---

# Wire screens 1–5 (Activities, Exams, Colleges, Essays, RecLetters) to API

## Description

Update the five React screen components to fetch their data from the API on
mount and save changes back.

## Acceptance Criteria

- [x] Activities screen loads and saves interests and course plan
- [x] Exams screen loads and saves test preference and AP courses
- [x] Colleges screen loads and saves major answers and college list
- [x] Essays screen loads and saves drive link and notes
- [x] RecLetters screen loads and saves checklist and teacher list
- [x] Each screen shows a loading state while fetching
- [x] Each screen's save action calls the correct PUT endpoint

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: Updated Activities test to mock fetch
- **Verification command**: `npm run test:client`
