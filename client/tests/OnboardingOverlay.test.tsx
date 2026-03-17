import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import OnboardingOverlay from '../src/components/OnboardingOverlay';

const ONBOARDING_KEY = 'collegenav_onboarded';

function renderOverlay(grade = 10) {
  return render(
    <MemoryRouter>
      <OnboardingOverlay grade={grade} />
    </MemoryRouter>
  );
}

describe('OnboardingOverlay', () => {
  beforeEach(() => {
    localStorage.removeItem(ONBOARDING_KEY);
  });

  it('renders when localStorage flag is absent', () => {
    renderOverlay();
    expect(screen.getByText(/welcome to collegenav/i)).toBeInTheDocument();
  });

  it('does not render when localStorage flag is present', () => {
    localStorage.setItem(ONBOARDING_KEY, '1');
    renderOverlay();
    expect(screen.queryByText(/welcome to collegenav/i)).not.toBeInTheDocument();
  });

  it('shows grade in welcome message', () => {
    renderOverlay(11);
    expect(screen.getByText(/grade 11/i)).toBeInTheDocument();
  });

  it('"Got it" button dismisses overlay and sets flag', () => {
    renderOverlay();
    fireEvent.click(screen.getByRole('button', { name: /got it/i }));
    expect(screen.queryByText(/welcome to collegenav/i)).not.toBeInTheDocument();
    expect(localStorage.getItem(ONBOARDING_KEY)).toBe('1');
  });

  it('"Start with Activities" link sets flag on click', () => {
    renderOverlay();
    fireEvent.click(screen.getByText(/start with activities/i));
    expect(localStorage.getItem(ONBOARDING_KEY)).toBe('1');
  });

  it('"Start with Activities" link points to /activities', () => {
    renderOverlay();
    const link = screen.getByText(/start with activities/i).closest('a');
    expect(link?.getAttribute('href')).toBe('/activities');
  });
});
