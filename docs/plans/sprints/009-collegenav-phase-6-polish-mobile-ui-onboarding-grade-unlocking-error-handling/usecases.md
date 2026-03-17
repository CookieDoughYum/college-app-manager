---
status: draft
---

# Sprint 009 Use Cases

## SUC-001: Mobile-responsive layout

- **Actor**: Student visiting on a mobile device
- **Preconditions**: Student is logged in
- **Main Flow**:
  1. Student opens the app on a phone (≤768px viewport)
  2. The sidebar collapses to a hamburger button
  3. Student taps the hamburger to open a slide-out nav
  4. Progress cards stack in a single column
- **Postconditions**: App is navigable on mobile
- **Acceptance Criteria**:
  - [ ] Sidebar is hidden on viewports ≤768px
  - [ ] Hamburger button visible and opens nav on tap
  - [ ] Progress cards are 1-column at ≤768px

## SUC-002: First-visit onboarding overlay

- **Actor**: New student logging in for the first time
- **Preconditions**: Student has no saved screen data; localStorage flag absent
- **Main Flow**:
  1. Student logs in and lands on Dashboard
  2. An overlay appears: "Welcome! Here's where to start…" with 2–3 bullet
     points and a "Start with Activities →" button linking to Screen 1
  3. Student clicks "Got it" or the start button to dismiss
  4. The flag is written to localStorage so the overlay doesn't appear again
- **Postconditions**: Overlay dismissed; student knows where to start
- **Acceptance Criteria**:
  - [ ] Overlay appears on first Dashboard visit
  - [ ] Overlay does not appear on subsequent visits
  - [ ] "Got it" and "Start" buttons dismiss the overlay

## SUC-003: Grade-based screen locking in sidebar

- **Actor**: Any authenticated student
- **Preconditions**: Student's grade is set in their profile
- **Main Flow**:
  1. Student views the sidebar
  2. Screens locked for their grade appear dimmed (opacity 0.4) with a
     "Unlocks in Grade N" tooltip on hover
  3. Unlocked screens appear at full opacity and are clickable normally
- **Postconditions**: Sidebar communicates grade-based progression
- **Acceptance Criteria**:
  - [ ] Grade 9 student sees Decide, Essays, Rec Letters, Portals dimmed
  - [ ] Grade 12 student sees all screens at full opacity
  - [ ] Dimmed items show tooltip on hover

## SUC-004: Error messages for failed AI calls

- **Actor**: Student clicking an AI recommendation button
- **Preconditions**: The AI endpoint returns an error (network or server)
- **Main Flow**:
  1. Student clicks "Get Recommendations"
  2. Network or server error occurs
  3. Instead of a blank recommendation section, an error message appears:
     "Could not generate recommendations — please try again."
  4. The button is re-enabled so the student can retry
- **Postconditions**: Student is informed and can retry
- **Acceptance Criteria**:
  - [ ] Error message visible when AI endpoint fails
  - [ ] Button re-enabled after failure
  - [ ] No unhandled promise rejections in the console
