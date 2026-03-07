import { createContext, useContext, useState, ReactNode } from 'react';

export interface Student {
  id: number;
  name: string;
  email: string;
  highSchool: string;
  grade: number;
}

interface StudentContextValue {
  student: Student | null;
  setStudent: (s: Student | null) => void;
}

export const StudentContext = createContext<StudentContextValue>({
  student: null,
  setStudent: () => {},
});

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null);
  return (
    <StudentContext.Provider value={{ student, setStudent }}>
      {children}
    </StudentContext.Provider>
  );
}

export function useStudent() {
  return useContext(StudentContext);
}
