---
id: "002"
title: "First-visit onboarding overlay"
status: todo
use-cases:
  - SUC-002
depends-on:
  - "001"
---

# First-visit onboarding overlay

## Description

Create `client/src/components/OnboardingOverlay.tsx` that shows a welcome
modal on the student's first Dashboard visit.

- Check `localStorage.getItem('collegenav_onboarded')` on mount
- If absent, show the overlay
- Overlay content: welcome message, 3 grade-appropriate tips, two buttons:
  "Start with Activities →" (navigates and dismisses) and "Got it" (dismisses)
- On dismiss: `localStorage.setItem('collegenav_onboarded', '1')`

Mount it in `Dashboard.tsx` above the reminder banners.

Add a CSS module `OnboardingOverlay.module.css` with full-screen overlay
and centered card styling.

## Acceptance Criteria

- [ ] Overlay renders on Dashboard when localStorage flag is absent
- [ ] Overlay does not render when flag is present
- [ ] "Got it" button dismisses overlay and sets flag
- [ ] "Start with Activities →" navigates to /activities and dismisses
- [ ] Client render tests pass

## Testing

- **Existing tests to run**: `npm run test:client`
- **New tests to write**: `tests/client/OnboardingOverlay.test.tsx`
- **Verification command**: `npm run test:client`
