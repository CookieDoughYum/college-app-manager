import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Dashboard from '../src/pages/Dashboard';
import { StudentContext } from '../src/contexts/StudentContext';

const mockStudent = {
  id: 1,
  name: 'Jane Smith',
  email: 'jane@example.com',
  highSchool: 'Lincoln High',
  grade: 11,
};

function renderDashboard() {
  return render(
    <StudentContext.Provider value={{ student: mockStudent, setStudent: () => {} }}>
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    </StudentContext.Provider>
  );
}

describe('Dashboard', () => {
  it('renders welcome message with student name from context', () => {
    renderDashboard();
    expect(screen.getByText(/welcome back, jane smith/i)).toBeInTheDocument();
  });

  it('renders grade and school name', () => {
    renderDashboard();
    expect(screen.getByText('Lincoln High')).toBeInTheDocument();
    expect(screen.getByText(/grade 11/i)).toBeInTheDocument();
  });

  it('renders three progress cards', () => {
    renderDashboard();
    expect(screen.getByText('Activities & Courses')).toBeInTheDocument();
    expect(screen.getByText('Exam Prep')).toBeInTheDocument();
    expect(screen.getByText('Colleges')).toBeInTheDocument();
  });
});
