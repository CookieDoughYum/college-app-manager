---
status: draft
---

# Sprint 006 Use Cases

## SUC-001: Get extracurricular and summer program recommendations

- **Actor**: Authenticated student
- **Preconditions**: Student has selected at least one interest tag on the Activities screen
- **Main Flow**:
  1. Student clicks "Get Recommendations" on Activities screen
  2. App calls `POST /api/ai/activities/recommend`
  3. Server reads student's interests and grade from stored data
  4. Server calls Claude with a prompt including interests, grade, and GPA
  5. Claude returns personalized extracurricular and summer program suggestions
  6. Screen displays recommendations in the "AI Recommendations" section
- **Postconditions**: Recommendations are displayed and cached
- **Acceptance Criteria**:
  - [ ] Recommendations appear in the Activities screen's AI section
  - [ ] Recommendations reference the student's selected interest tags
  - [ ] Response is cached in `StudentActivities.aiRecommendations` JSON field

## SUC-002: Course load warning from AI

- **Actor**: Authenticated student
- **Preconditions**: Student has filled in course plan on Activities screen
- **Main Flow**:
  1. Student saves their 4-year course plan
  2. Server analyzes the plan for AP overload (>3 APs in one grade)
  3. If overloaded, AI generates a specific warning and suggestion
  4. Warning appears inline in the course plan section
- **Postconditions**: Student is warned about unsustainable course loads
- **Acceptance Criteria**:
  - [ ] Warning appears when a grade has more than 3 AP courses
  - [ ] Warning message is AI-generated and specific to the courses listed

## SUC-003: SAT vs ACT recommendation

- **Actor**: Authenticated student
- **Preconditions**: Student has saved test preference or has quiz answers
- **Main Flow**:
  1. Student clicks "Get Recommendation" on Exams screen
  2. App calls `POST /api/ai/exams/recommend`
  3. Claude returns a recommendation (SAT or ACT) with rationale
  4. Screen displays the recommendation
- **Postconditions**: Test recommendation displayed
- **Acceptance Criteria**:
  - [ ] Recommendation is either SAT or ACT with a clear rationale
  - [ ] Rationale is stored and restored on page reload

## SUC-004: Major and college recommendations

- **Actor**: Authenticated student
- **Preconditions**: Student has filled salary goal and interest area on Colleges screen
- **Main Flow**:
  1. Student clicks "Get Major Recommendations"
  2. App calls `POST /api/ai/colleges/recommend`
  3. Claude returns 3–5 recommended majors with brief rationale
  4. Screen displays them in the "Recommended Majors" section
- **Postconditions**: Major recommendations displayed
- **Acceptance Criteria**:
  - [ ] 3–5 majors displayed with rationale
  - [ ] Recommendations are based on salary goal and interest area
  - [ ] Results are cached

## SUC-005: Pros/cons decision comparison

- **Actor**: Authenticated student
- **Preconditions**: Student has logged at least 2 accepted schools on Decide screen
- **Main Flow**:
  1. Student clicks "Generate Comparison"
  2. App calls `POST /api/ai/decide/compare`
  3. Claude compares the top 2 accepted schools using the student's profile priorities
  4. Screen displays pros/cons for each school
- **Postconditions**: Comparison displayed in the AI Decision Helper section
- **Acceptance Criteria**:
  - [ ] Pros/cons listed for each of the two schools
  - [ ] Comparison references student's stated priorities (major, salary goal)
  - [ ] Result is cached

## SUC-006: Scholarship matching

- **Actor**: Authenticated student
- **Preconditions**: Student has selected profile tags on Financial Aid screen
- **Main Flow**:
  1. Student clicks "Find Scholarships"
  2. App calls `POST /api/ai/financialaid/scholarships`
  3. Claude returns 3–5 scholarships matched to the student's profile tags
  4. Screen displays them in the Recommended Scholarships section
- **Postconditions**: Matched scholarships displayed
- **Acceptance Criteria**:
  - [ ] 3–5 scholarships displayed with name, amount, and deadline
  - [ ] Scholarships are relevant to the student's selected profile tags
  - [ ] Results are cached
