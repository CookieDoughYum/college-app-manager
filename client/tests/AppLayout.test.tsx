import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../src/components/Sidebar';
import { StudentContext } from '../src/contexts/StudentContext';

const mockStudent = {
  id: 1,
  name: 'Test Student',
  email: 'test@example.com',
  highSchool: 'Test High',
  grade: 11,
};

function renderSidebar(path = '/dashboard') {
  return render(
    <StudentContext.Provider value={{ student: mockStudent, setStudent: vi.fn() }}>
      <MemoryRouter initialEntries={[path]}>
        <Sidebar />
      </MemoryRouter>
    </StudentContext.Provider>
  );
}

describe('AppLayout', () => {
  it('renders sidebar with all 10 nav links', () => {
    renderSidebar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Activities & Courses')).toBeInTheDocument();
    expect(screen.getByText('Exam Prep')).toBeInTheDocument();
    expect(screen.getByText('College & Major')).toBeInTheDocument();
    expect(screen.getByText('Essays')).toBeInTheDocument();
    expect(screen.getByText('Rec Letters')).toBeInTheDocument();
    expect(screen.getByText('App Portals')).toBeInTheDocument();
    expect(screen.getByText('Decide')).toBeInTheDocument();
    expect(screen.getByText('Financial Aid')).toBeInTheDocument();
    expect(screen.getByText('Deadlines')).toBeInTheDocument();
  });

  it('renders active state on the current route link', () => {
    renderSidebar('/dashboard');
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink?.className).toContain('active');
  });

  it('renders Log Out button', () => {
    renderSidebar();
    expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
  });
});
