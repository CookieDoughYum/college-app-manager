import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Activities from '../src/pages/screens/Activities';

function mockFetch(data: object) {
  global.fetch = vi.fn().mockResolvedValue({
    json: () => Promise.resolve(data),
  } as any);
}

function renderActivities() {
  return render(
    <MemoryRouter>
      <Activities />
    </MemoryRouter>
  );
}

beforeEach(() => {
  mockFetch({ interests: [], coursePlan: {} });
});

describe('Activities', () => {
  it('renders interests questionnaire with tag chips', async () => {
    renderActivities();
    await waitFor(() => expect(screen.getByText('Science')).toBeInTheDocument());
    expect(screen.getByText('Leadership')).toBeInTheDocument();
    expect(screen.getByText('Arts')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  it('renders 4-year course plan grid with 4 columns', async () => {
    renderActivities();
    await waitFor(() => expect(screen.getByText('9th Grade')).toBeInTheDocument());
    expect(screen.getByText('10th Grade')).toBeInTheDocument();
    expect(screen.getByText('11th Grade')).toBeInTheDocument();
    expect(screen.getByText('12th Grade')).toBeInTheDocument();
  });
});
