import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import type { Student } from '../contexts/StudentContext';

export default function ProtectedRoute() {
  const { student, setStudent } = useStudent();
  const [loading, setLoading] = useState(!student);

  useEffect(() => {
    if (student) return;
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then((data: Student) => {
        setStudent(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return null;
  if (!student) return <Navigate to="/login" replace />;
  return <Outlet />;
}
