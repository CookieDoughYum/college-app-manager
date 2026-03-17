---
id: '003'
title: Error handling for AI recommendation calls
status: done
use-cases:
- SUC-004
depends-on: []
---

# Error handling for AI recommendation calls

## Description

Add error state handling to all 7 AI recommendation buttons across the
5 active screens (Activities, Exams, Colleges, Decide, FinancialAid) plus
the 2 new web research actions (Essays whyus, Deadlines scrape).

For each, add:
- `const [aiError, setAiError] = useState('')`
- `setAiError('')` at start of each AI call
- `catch` block: `setAiError('Could not generate — please try again.')`
- In render: `{aiError && <p style={{ color: '#e94560' }}>{aiError}</p>}`
- Re-enable the button after failure (the `finally` block already handles this)

Also add a simple React error boundary `client/src/components/ErrorBoundary.tsx`
and wrap the router in `client/src/App.tsx` with it.

## Acceptance Criteria

- [x] Each AI button screen has error state (`aiError`)
- [x] Error message appears when the fetch throws or returns non-ok status
- [x] Button re-enabled after failure (loading state cleared in finally)
- [x] ErrorBoundary wraps the app router
- [x] Client render tests pass

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: None beyond existing (error boundary tested implicitly)
- **Verification command**: `npm run test:client`
