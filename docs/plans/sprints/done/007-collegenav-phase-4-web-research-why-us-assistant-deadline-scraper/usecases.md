---
status: draft
---

# Sprint 007 Use Cases

## SUC-001: Generate "Why Us?" essay talking points

- **Actor**: Authenticated student
- **Preconditions**: Student is on the Essays screen and has a school name in mind
- **Main Flow**:
  1. Student enters a school name and optionally a URL on the Essays screen
  2. Student clicks "Research School"
  3. App calls `POST /api/ai/essays/whyus` with `{ schoolName, url }`
  4. Server fetches the school's website (admissions or main page)
  5. Server passes the fetched HTML (stripped to plain text) to Claude with
     a prompt asking for specific programs, values, and talking points
  6. Claude returns 3–5 specific talking points for a "Why Us?" essay
  7. Screen displays the talking points in the "Why Us?" section
- **Postconditions**: Talking points are displayed and cached in `StudentEssays.whyUsResults`
- **Acceptance Criteria**:
  - [ ] Student can enter a school name and optional URL
  - [ ] Talking points are displayed in the Essays screen
  - [ ] Results reference specific programs or values from the school's site
  - [ ] Results are cached and restored on page reload
  - [ ] Returns a graceful error message if the URL cannot be fetched

## SUC-002: Auto-populate deadlines from college list

- **Actor**: Authenticated student
- **Preconditions**: Student has at least one school in their college list (Screen 3)
- **Main Flow**:
  1. Student navigates to the Deadlines screen
  2. Student clicks "Fetch Deadlines"
  3. App calls `POST /api/ai/deadlines/scrape`
  4. Server reads the student's college list from `StudentColleges.collegeList`
  5. For each school, server fetches the school's admissions page
  6. Server passes each page to Claude asking for application deadline dates
  7. Claude extracts regular decision, early action, and early decision deadlines
  8. Server saves extracted deadlines to `StudentDeadlines.manualDeadlines`
  9. Screen updates the calendar and upcoming deadline list
- **Postconditions**: Deadlines calendar is populated with scraped dates
- **Acceptance Criteria**:
  - [ ] "Fetch Deadlines" button is visible on the Deadlines screen
  - [ ] Deadlines for each college in the student's list are fetched and displayed
  - [ ] Each deadline entry includes: school name, deadline type (RD/EA/ED), date
  - [ ] Results are saved and restored on page reload
  - [ ] Schools whose pages cannot be fetched are skipped with a note in the response
