---
status: draft
---

# Sprint 005 Use Cases

## SUC-001: Save and restore Activities & Course Planning data

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in; has previously entered data on the Activities screen
- **Main Flow**:
  1. Student navigates to Activities screen
  2. App fetches saved interests, extracurricular list, and 4-year course plan from API
  3. Screen renders with previously saved data pre-filled
  4. Student modifies data and saves
  5. App sends updated data to `PUT /api/student/activities`
- **Postconditions**: Data is stored; next load restores it
- **Acceptance Criteria**:
  - [ ] Activities screen loads saved interests tags on mount
  - [ ] 4-year course plan is restored between sessions
  - [ ] Save action writes to database

## SUC-002: Save and restore Exam Prep data

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student navigates to Exam Prep screen
  2. App fetches saved SAT/ACT quiz answers and AP course list
  3. Screen renders with saved state
  4. Student updates AP courses; app saves on change
- **Postconditions**: Exam prep data persists across sessions
- **Acceptance Criteria**:
  - [ ] SAT/ACT quiz selection is restored
  - [ ] AP course list is restored
  - [ ] Updates are saved to the database

## SUC-003: Save and restore College & Major data

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student navigates to College & Major screen
  2. App fetches saved major questionnaire answers and college list
  3. College list renders with reach/target/safety labels
  4. Student adds/removes colleges; app saves on change
- **Postconditions**: College list and major answers persist
- **Acceptance Criteria**:
  - [ ] College list entries (name, label) are restored
  - [ ] Major questionnaire answers are restored
  - [ ] Add/remove operations persist immediately

## SUC-004: Save and restore Essays data

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student navigates to Essays screen
  2. App fetches saved Google Drive link and essay notes
  3. Student updates link or notes; app saves on change
- **Postconditions**: Essay data persists
- **Acceptance Criteria**:
  - [ ] Drive link is restored between sessions
  - [ ] Notes field is restored

## SUC-005: Save and restore Rec Letters checklist and teacher tracker

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student navigates to Rec Letters screen
  2. App fetches saved checklist state and teacher list
  3. Checklist items render checked/unchecked per saved state
  4. Teacher list renders with per-teacher status
  5. Student toggles items or updates teachers; app saves on change
- **Postconditions**: Checklist and teacher data persist
- **Acceptance Criteria**:
  - [ ] Checklist checked states are restored
  - [ ] Teacher list (name, status) is restored
  - [ ] Toggles persist immediately

## SUC-006: Save and restore Application Portals data

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student navigates to App Portals screen
  2. App fetches saved portal entries (name, URL, status)
  3. Student adds a portal link with status tag; app saves
- **Postconditions**: Portal entries persist
- **Acceptance Criteria**:
  - [ ] Portal list is restored between sessions
  - [ ] Status tags are restored correctly

## SUC-007: Save and restore Decide screen data

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in; has a college list from Screen 3
- **Main Flow**:
  1. Student navigates to Decide screen
  2. App fetches saved acceptance results per school
  3. Student updates decision status (Accepted/Waitlisted/Denied); app saves
- **Postconditions**: Decision data persists
- **Acceptance Criteria**:
  - [ ] Acceptance results per school are restored
  - [ ] Status updates persist immediately

## SUC-008: Save and restore Financial Aid data

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student navigates to Financial Aid screen
  2. App fetches saved FAFSA checklist state and scholarship questionnaire answers
  3. Student toggles checklist items or updates questionnaire; app saves
- **Postconditions**: Financial aid data persists
- **Acceptance Criteria**:
  - [ ] FAFSA checklist checked states are restored
  - [ ] Scholarship questionnaire answers are restored

## SUC-009: Dashboard shows real progress

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in; has data in at least one screen
- **Main Flow**:
  1. Student navigates to Dashboard
  2. App fetches progress summary from `/api/student/progress`
  3. Dashboard renders progress bars with real completion percentages
- **Postconditions**: Dashboard reflects actual student progress
- **Acceptance Criteria**:
  - [ ] Each screen's progress bar reflects real completion percentage
  - [ ] Progress updates after student saves data on a screen
