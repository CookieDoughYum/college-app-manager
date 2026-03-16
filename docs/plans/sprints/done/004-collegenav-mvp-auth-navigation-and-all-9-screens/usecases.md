---
status: draft
---

# Sprint 004 Use Cases

## SUC-001: Student Signs Up
Parent: Onboarding

- **Actor**: Unauthenticated visitor
- **Preconditions**: User is on the signup page (`/signup`)
- **Main Flow**:
  1. User enters full name, email address, password, high school name, and grade level (8–12)
  2. User submits the form
  3. Server creates a `Student` record with a hashed password
  4. Session is established; user is redirected to the Dashboard
- **Postconditions**: Student account exists; user is logged in
- **Acceptance Criteria**:
  - [ ] Signup form shows fields: name, email, password, high school, grade level
  - [ ] Submitting with valid data creates a student and redirects to dashboard
  - [ ] Submitting with a duplicate email returns a 409 error with a user-friendly message
  - [ ] Submitting with missing fields returns validation errors inline

---

## SUC-002: Student Logs In
Parent: Onboarding

- **Actor**: Registered student
- **Preconditions**: Student account exists; user is on the login page (`/login`)
- **Main Flow**:
  1. User enters email and password
  2. User submits the form
  3. Server authenticates via Passport local strategy
  4. Session is established; user is redirected to the Dashboard
- **Postconditions**: User is logged in; session cookie is set
- **Acceptance Criteria**:
  - [ ] Login form shows email and password fields
  - [ ] Valid credentials redirect to Dashboard
  - [ ] Invalid credentials return an error message (do not reveal which field is wrong)
  - [ ] Unauthenticated access to any protected route redirects to `/login`

---

## SUC-003: Student Logs Out
Parent: Onboarding

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student clicks "Log Out" in the sidebar
  2. Server destroys the session
  3. User is redirected to the login page
- **Postconditions**: Session is destroyed; user cannot access protected routes
- **Acceptance Criteria**:
  - [ ] Logout link is visible in the sidebar
  - [ ] After logout, navigating to a protected route redirects to login

---

## SUC-004: Student Views Dashboard
Parent: Dashboard

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student navigates to `/dashboard` (or is redirected here after login)
  2. App displays the student's name, grade, and high school
  3. Progress cards are shown for Activities & Courses, Exam Prep, and Colleges (with placeholder 0% values)
  4. Action items section is shown (placeholder content in Sprint 004)
- **Postconditions**: Student sees their personalised dashboard
- **Acceptance Criteria**:
  - [ ] Dashboard shows "Welcome back, [Name]" with grade and school
  - [ ] Three progress cards render with progress bars (all at 0% for MVP)
  - [ ] Navigation sidebar is visible with all 9 screen links

---

## SUC-005: Student Navigates to Any Screen
Parent: Navigation

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student clicks any item in the sidebar navigation
  2. The corresponding screen renders without error
  3. The active sidebar item is highlighted
- **Postconditions**: The selected screen is displayed
- **Acceptance Criteria**:
  - [ ] All 9 sidebar links navigate to the correct page
  - [ ] Active screen is highlighted in the sidebar (left border accent)
  - [ ] No 404 or blank screens for any route

---

## SUC-006: Student Views and Interacts with Activities & Course Planning (Screen 1)
Parent: Screen 1

- **Actor**: Authenticated student
- **Preconditions**: Student is on `/activities`
- **Main Flow**:
  1. Student sees the interests questionnaire with tag chips (Science, Leadership, Arts, Community, Tech)
  2. Student enters GPA and optional test scores
  3. Student sees the 4-year course plan grid (9th–12th grade columns)
  4. AI recommendations section shows placeholder content ("Complete questionnaire to see recommendations")
- **Postconditions**: Screen is fully rendered; form state held in React state
- **Acceptance Criteria**:
  - [ ] Interest tags are clickable (toggle selected state in UI)
  - [ ] GPA and test score fields accept numeric input
  - [ ] 4-year course plan grid shows all four grade columns
  - [ ] Placeholder text shown where AI recommendations will appear

---

## SUC-007: Student Views Exam Preparation (Screen 2)
Parent: Screen 2

- **Actor**: Authenticated student
- **Preconditions**: Student is on `/exams`
- **Main Flow**:
  1. Student sees the SAT vs ACT quiz section with a placeholder 5-question flow
  2. Student sees the AP exam tracker with tag-style input for AP courses
  3. AI study schedule section shows placeholder content
- **Acceptance Criteria**:
  - [ ] SAT/ACT section renders with a "Take quiz" prompt
  - [ ] AP course tags can be added (held in React state)
  - [ ] Placeholder shown for study schedule

---

## SUC-008: Student Views College & Major Exploration (Screen 3)
Parent: Screen 3

- **Actor**: Authenticated student
- **Preconditions**: Student is on `/colleges`
- **Main Flow**:
  1. Student sees the major questionnaire with salary goal and interest area fields
  2. Student sees recommended majors area (placeholder)
  3. Student sees the college list with reach/target/safety badge layout
  4. "Add a school" placeholder card is shown
- **Acceptance Criteria**:
  - [ ] Major questionnaire fields render
  - [ ] College list renders with example cards matching wireframe badges
  - [ ] Reach/target/safety badges display correctly

---

## SUC-009: Student Views Essay Writing (Screen 4)
Parent: Screen 4

- **Actor**: Authenticated student
- **Preconditions**: Student is on `/essays`
- **Main Flow**:
  1. Student sees the essay timeline cards (Late May–June, July, August)
  2. Student sees the Google Drive folder setup guide with document labels
  3. Student sees the "Why Us?" assistant with a school name input field and placeholder output
- **Acceptance Criteria**:
  - [ ] Timeline cards render with the correct month labels and descriptions
  - [ ] Google Drive folder tag list is displayed
  - [ ] "Why Us?" input field and research button render (non-functional in MVP)

---

## SUC-010: Student Views Remaining Screens (Screens 5–9)
Parent: Navigation

- **Actor**: Authenticated student
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student navigates to each remaining screen
  2. Each screen renders its key UI elements matching the wireframe layout
- **Acceptance Criteria**:
  - [ ] Screen 5 (Rec Letters): Checklist items and teacher tracker cards render
  - [ ] Screen 6 (App Portals): Key date cards and portal list render
  - [ ] Screen 7 (Decide): Acceptances list and AI pros/cons placeholder render
  - [ ] Screen 8 (Financial Aid): FAFSA checklist and scholarship placeholder render
  - [ ] Screen 9 (Deadlines): Calendar grid and upcoming deadlines list render

---

## SUC-011: Unauthenticated User Sees Signup/Login
Parent: Onboarding

- **Actor**: Unauthenticated visitor
- **Preconditions**: User visits any URL without a valid session
- **Main Flow**:
  1. User is redirected to `/login`
  2. Login page shows a link to `/signup`
  3. Signup page shows a link back to `/login`
- **Acceptance Criteria**:
  - [ ] `/login` and `/signup` are accessible without auth
  - [ ] All other routes redirect to `/login` for unauthenticated users
  - [ ] Login page includes "Already have an account? Log in" / "Don't have one? Sign up" toggle link
