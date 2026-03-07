import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Activities from '../src/pages/screens/Activities';

function renderActivities() {
  return render(
    <MemoryRouter>
      <Activities />
    </MemoryRouter>
  );
}

describe('Activities', () => {
  it('renders interests questionnaire with tag chips', () => {
    renderActivities();
    expect(screen.getByText('Science')).toBeInTheDocument();
    expect(screen.getByText('Leadership')).toBeInTheDocument();
    expect(screen.getByText('Arts')).toBeInTheDocument();
    expect(screen.getByText('Community')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  it('renders 4-year course plan grid with 4 columns', () => {
    renderActivities();
    expect(screen.getByText('9th Grade')).toBeInTheDocument();
    expect(screen.getByText('10th Grade')).toBeInTheDocument();
    expect(screen.getByText('11th Grade')).toBeInTheDocument();
    expect(screen.getByText('12th Grade')).toBeInTheDocument();
  });
});
