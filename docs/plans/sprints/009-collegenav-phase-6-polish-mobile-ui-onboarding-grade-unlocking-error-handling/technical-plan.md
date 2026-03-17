---
status: draft
from-architecture-version: collegenav-008
to-architecture-version: collegenav-009
---

# Sprint 009 Technical Plan

## Architecture Version

- **From version**: `collegenav-008` — Reminders, AP schedule, date-aware Rec Letters
- **To version**: `collegenav-009` — v1 Polish: mobile, onboarding, grade locking, error handling

## Architecture Overview

No backend changes. All work is in the React client.

```
client/
  src/
    components/
      AppLayout.tsx       ← Add hamburger + slide-out nav for mobile
      OnboardingOverlay.tsx ← New component for first-visit prompt
    pages/
      Dashboard.tsx       ← Mount OnboardingOverlay
    styles/
      AppLayout.module.css ← Responsive breakpoints
      Dashboard.module.css ← Responsive card grid
```

No new backend endpoints. No schema changes.

## Component Design

### Component: Mobile-responsive AppLayout

**Use Cases**: SUC-001

Add to `AppLayout.module.css`:

```css
@media (max-width: 768px) {
  .layout { flex-direction: column; }
  .sidebar { display: none; }
  .sidebar.open { display: flex; position: fixed; top: 0; left: 0; height: 100vh; z-index: 100; }
  .hamburger { display: flex; }
}
```

Add a `hamburger` button to the AppLayout header (mobile only) that toggles
a `sidebarOpen` state. The sidebar renders with `open` class when toggled.

---

### Component: Grade-based sidebar locking

**Use Cases**: SUC-003

In AppLayout, read the student's grade from `StudentContext`. Each nav item
has a `minGrade` property. Items with `minGrade > grade` are rendered with
`opacity: 0.4` and a `title` attribute showing "Unlocks in Grade N".

Grade thresholds:
- Activities: 8 (always visible)
- Exams: 8
- Colleges: 10
- Essays: 11
- Rec Letters: 11
- Portals: 12
- Decide: 12
- Financial Aid: 11
- Deadlines: 11

---

### Component: OnboardingOverlay

**Use Cases**: SUC-002

New component `client/src/components/OnboardingOverlay.tsx`:

```tsx
const ONBOARDING_KEY = 'collegenav_onboarded';

export default function OnboardingOverlay({ grade }: { grade: number }) {
  const [visible, setVisible] = useState(!localStorage.getItem(ONBOARDING_KEY));

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2>Welcome to CollegeNav!</h2>
        <p>Here's where to start for Grade {grade}:</p>
        <ul>
          <li>Set up your <strong>Activities</strong> and interests</li>
          <li>Check out <strong>Exam Prep</strong> for SAT/ACT guidance</li>
          <li>Add schools to your <strong>College List</strong></li>
        </ul>
        <div>
          <Link to="/activities" onClick={dismiss}>Start with Activities →</Link>
          <button onClick={dismiss}>Got it</button>
        </div>
      </div>
    </div>
  );
}
```

Mounted in `Dashboard.tsx` directly above the progress cards.

---

### Component: Error handling in AI recommendation sections

**Use Cases**: SUC-004

All 7 screens with AI recommendation buttons (Activities, Exams, Colleges,
Decide, FinancialAid, Essays whyus, Deadlines scrape) get the same pattern:

```tsx
const [aiError, setAiError] = useState('');

async function getRecommendations() {
  setAiLoading(true);
  setAiError('');
  try {
    const res = await fetch('/api/ai/...', { method: 'POST', credentials: 'include' });
    if (!res.ok) throw new Error('Server error');
    const { result } = await res.json();
    // ... update state
  } catch {
    setAiError('Could not generate recommendations — please try again.');
  } finally {
    setAiLoading(false);
  }
}

// In render:
{aiError && <p style={{ color: '#e94560' }}>{aiError}</p>}
```

---

### Component: React Error Boundary

**Use Cases**: SUC-004

Add `client/src/components/ErrorBoundary.tsx` that wraps the router in
`App.tsx`. Catches render errors and shows a "Something went wrong" message
with a reload button instead of a blank white screen.

## Decisions

1. **No backend changes** — All polish is UI-side. Server is complete.
2. **localStorage for onboarding flag** — Simple, instant, no round-trip.
   Clearing localStorage resets the onboarding, which is desirable for testing.
3. **Grade locking is presentational only** — Locked routes are still
   accessible directly. The sidebar is a guide, not an enforcer.
4. **Error state per-component** — Not a global toast system.
   Keeps error display close to the failed action.
