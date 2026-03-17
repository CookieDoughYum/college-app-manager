---
status: draft
from-architecture-version: collegenav-007
to-architecture-version: collegenav-008
---

# Sprint 008 Technical Plan

## Architecture Version

- **From version**: `collegenav-007` — Web research on Essays and Deadlines screens
- **To version**: `collegenav-008` — Reminder banners, AP study schedule, date-aware Rec Letters

## Architecture Overview

```
server/
  src/
    routes/
      student.ts    ← Add GET /api/student/reminders
      ai.ts         ← Add POST /api/ai/exams/schedule

client/
  src/
    pages/
      Dashboard.tsx ← Fetch reminders and display banners
    pages/screens/
      Exams.tsx     ← Add "Generate Study Schedule" button + display
      RecLetters.tsx ← Highlight next-action step by grade
```

No schema changes required — AP schedule is cached in the existing
`StudentExams.aiRecommendations` JSONB field.

## Component Design

### Component: GET /api/student/reminders

**Use Cases**: SUC-001

New endpoint added to `student.ts` (still protected by `requireAuth`):

```typescript
GET /api/student/reminders
```

Response:
```json
{
  "reminders": [
    { "type": "deadline", "urgency": "red", "message": "UC Berkeley RD due in 5 days" },
    { "type": "grade", "urgency": "green", "message": "Grade 11: Request rec letters from 2–3 teachers" }
  ]
}
```

Logic:
1. Load `StudentDeadlines.manualDeadlines` and `Student.grade`
2. For each deadline, compute days until due (parse the date string)
3. Emit "red" reminder if ≤7 days, "amber" if ≤30 days
4. Always emit a grade-based general reminder

Date parsing: use `new Date(dateString)` — gracefully skip unparseable dates.

---

### Component: POST /api/ai/exams/schedule

**Use Cases**: SUC-002

New endpoint in `ai.ts`:

```typescript
POST /api/ai/exams/schedule
```

1. Reads `StudentExams.apCourses`
2. Computes weeks until May 1 (AP exam month)
3. Prompt:
   ```
   You are a study coach for a high school student taking AP exams in May.
   AP courses: ${apCourses.join(', ')}
   Weeks until exams: ${weeksUntil}

   Create a week-by-week study plan for the next ${Math.min(weeksUntil, 12)} weeks.
   Each week: which course to focus on and 1–2 specific study tasks.
   Format as a numbered list (Week 1: ..., Week 2: ...).
   ```
4. Saves result to `StudentExams.aiRecommendations.schedule`
5. Returns `{ result }`

---

### Component: Dashboard reminder banners

**Use Cases**: SUC-001

Dashboard fetches `GET /api/student/reminders` on mount alongside the
existing progress fetch. Displays banners above the progress section:

```tsx
<div className={styles.reminderBanners}>
  {reminders.map((r, i) => (
    <div key={i} className={`${styles.banner} ${styles[r.urgency]}`}>
      {r.message}
    </div>
  ))}
</div>
```

Three CSS variants: `red` (border-left: red), `amber` (border-left: amber),
`green` (border-left: green).

---

### Component: Exams screen — study schedule

**Use Cases**: SUC-002

Add below the AP tracker:

```tsx
const [scheduleLoading, setScheduleLoading] = useState(false);

async function generateSchedule() { ... }

// In render:
<button onClick={generateSchedule} disabled={scheduleLoading}>
  {scheduleLoading ? 'Generating…' : 'Generate Study Schedule'}
</button>
{data.aiRecommendations?.schedule && (
  <pre>{data.aiRecommendations.schedule}</pre>
)}
```

---

### Component: Rec Letters — grade-aware next-action

**Use Cases**: SUC-003

The Rec Letters screen already has a checklist. Add logic to determine
which step is the "next action" based on grade (passed from the server
as part of the student profile or fetched via `GET /api/student/profile`).

Grade mapping:
- 8–10: highlight "Build relationships with potential recommenders"
- 11: highlight "Request letters from 2–3 teachers"
- 12 (before Nov): highlight "Ensure teachers are added on Common App"
- 12 (Nov+): highlight "Send thank-you notes"

The highlighted item gets a `data-next-action` attribute and a visible
"→ Recommended Next Step" label.

---

### Component: Server Tests

**Use Cases**: SUC-001, SUC-002

- Test `GET /api/student/reminders`: 401 without auth, returns array with
  grade reminder, returns deadline reminder when deadline is within 30 days
- Test `POST /api/ai/exams/schedule`: 401 without auth, returns `{ result }`,
  caches in `aiRecommendations.schedule`

## Decisions

1. **Reminders computed on-the-fly** — no cron, no stored reminder state.
   Fresh computation on every GET. Simple and always current.
2. **Date parsing best-effort** — `new Date(str)` skips invalid dates silently.
   Students who enter free-form dates may not get deadline reminders for those
   entries, which is acceptable.
3. **Schedule cached in existing aiRecommendations JSONB** — no schema change
   needed. Follows the same pattern as Sprint 006.
