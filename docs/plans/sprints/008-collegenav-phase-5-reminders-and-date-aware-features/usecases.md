---
status: draft
---

# Sprint 008 Use Cases

## SUC-001: Dashboard reminder banners

- **Actor**: Authenticated student
- **Preconditions**: Student has at least some data saved (deadlines, college list)
- **Main Flow**:
  1. Student loads the Dashboard
  2. Dashboard fetches `GET /api/student/reminders`
  3. Server computes time-sensitive items:
     - Upcoming deadlines within 30 days (from manualDeadlines)
     - Grade-based reminder (e.g. "Grade 11: Start requesting rec letters now")
  4. Dashboard displays banners at the top, color-coded by urgency
     (red = ≤7 days, amber = ≤30 days, green = general reminder)
- **Postconditions**: Student sees actionable reminders on the Dashboard
- **Acceptance Criteria**:
  - [ ] Dashboard calls `/api/student/reminders` on load
  - [ ] Banners appear when deadlines are within 30 days
  - [ ] Grade-based general reminder always appears
  - [ ] Banners are color-coded by urgency

## SUC-002: AP study schedule generation

- **Actor**: Authenticated student
- **Preconditions**: Student has at least one AP course listed on the Exams screen
- **Main Flow**:
  1. Student clicks "Generate Study Schedule" on the Exams screen
  2. App calls `POST /api/ai/exams/schedule`
  3. Server reads the student's AP courses from `StudentExams.apCourses`
  4. Claude generates a week-by-week study schedule for the AP exams in May
  5. Schedule is cached in `StudentExams.aiRecommendations.schedule`
  6. Exams screen displays the schedule below the AP tracker
- **Postconditions**: Study schedule displayed and cached
- **Acceptance Criteria**:
  - [ ] "Generate Study Schedule" button visible on Exams screen
  - [ ] Schedule references the student's specific AP courses
  - [ ] Schedule is cached and restored on page reload

## SUC-003: Date-aware Rec Letters next-action highlight

- **Actor**: Authenticated student
- **Preconditions**: Student is on the Rec Letters screen
- **Main Flow**:
  1. Student navigates to the Rec Letters screen
  2. Screen determines the student's grade from their profile
  3. The appropriate "next action" checklist step highlights based on grade:
     - Grade 8–10: "Build relationships with teachers"
     - Grade 11: "Request letters from 2–3 teachers"
     - Grade 12 (Aug–Oct): "Ensure teachers are added on Common App"
     - Grade 12 (Nov+): "Send thank-you notes"
  4. The highlighted step has a distinct visual treatment (border, label)
- **Postconditions**: Student sees their recommended next action
- **Acceptance Criteria**:
  - [ ] One checklist step is highlighted as "Recommended Next Step"
  - [ ] The highlighted step matches the student's grade
  - [ ] Client render test verifies the highlight renders
