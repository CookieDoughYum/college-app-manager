---
id: "003"
title: "Wire screens 1–5 (Activities, Exams, Colleges, Essays, RecLetters) to API"
status: todo
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
mount and save changes back. Replace ephemeral `useState` with load-on-mount +
save-on-action pattern per the technical plan.

- `Activities.tsx` — interests tags, course plan
- `Exams.tsx` — test preference, AP courses
- `Colleges.tsx` — major answers, college list
- `Essays.tsx` — drive link, notes
- `RecLetters.tsx` — checklist, teacher list

## Acceptance Criteria

- [ ] Activities screen loads and saves interests and course plan
- [ ] Exams screen loads and saves test preference and AP courses
- [ ] Colleges screen loads and saves major answers and college list
- [ ] Essays screen loads and saves drive link and notes
- [ ] RecLetters screen loads and saves checklist and teacher list
- [ ] Each screen shows a loading state while fetching
- [ ] Each screen's save action calls the correct PUT endpoint

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: Update existing render tests to mock fetch; verify
  loading state and data display
- **Verification command**: `npm run test:client`
