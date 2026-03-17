import { useState, useEffect } from 'react';
import { useStudent } from '../contexts/StudentContext';
import ProgressCard from '../components/ProgressCard';
import styles from './Dashboard.module.css';

interface Progress {
  activities: number;
  exams: number;
  colleges: number;
  essays: number;
  recletters: number;
  portals: number;
  decide: number;
  financialaid: number;
  deadlines: number;
}

interface Reminder {
  type: string;
  urgency: 'red' | 'amber' | 'green';
  message: string;
}

const DEFAULT_PROGRESS: Progress = {
  activities: 0, exams: 0, colleges: 0, essays: 0, recletters: 0,
  portals: 0, decide: 0, financialaid: 0, deadlines: 0,
};

const URGENCY_COLORS: Record<string, string> = {
  red: '#e94560',
  amber: '#f59e0b',
  green: '#22c55e',
};

export default function Dashboard() {
  const { student } = useStudent();
  const [progress, setProgress] = useState<Progress>(DEFAULT_PROGRESS);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    fetch('/api/student/progress', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setProgress(d ?? DEFAULT_PROGRESS))
      .catch(() => {});
    fetch('/api/student/reminders', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setReminders(d?.reminders ?? []))
      .catch(() => {});
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.welcome}>Welcome back, {student?.name ?? 'Student'}</h1>
        <p className={styles.subtitle}>{student?.highSchool}</p>
        {student?.grade && (
          <span className={styles.gradePill}>Grade {student.grade}</span>
        )}
      </div>

      <div className={styles.cards}>
        <ProgressCard
          title="Activities & Courses"
          percent={progress.activities}
          subtitle={progress.activities === 0 ? 'No activities recorded yet' : `${progress.activities}% complete`}
        />
        <ProgressCard
          title="Exam Prep"
          percent={progress.exams}
          subtitle={progress.exams === 0 ? 'No exams scheduled yet' : `${progress.exams}% complete`}
        />
        <ProgressCard
          title="Colleges"
          percent={progress.colleges}
          subtitle={progress.colleges === 0 ? 'No colleges added yet' : `${progress.colleges}% complete`}
        />
        <ProgressCard
          title="Essays"
          percent={progress.essays}
          subtitle={`${progress.essays}% complete`}
        />
        <ProgressCard
          title="Rec Letters"
          percent={progress.recletters}
          subtitle={`${progress.recletters}% complete`}
        />
        <ProgressCard
          title="App Portals"
          percent={progress.portals}
          subtitle={`${progress.portals}% complete`}
        />
        <ProgressCard
          title="Decide"
          percent={progress.decide}
          subtitle={`${progress.decide}% complete`}
        />
        <ProgressCard
          title="Financial Aid"
          percent={progress.financialaid}
          subtitle={`${progress.financialaid}% complete`}
        />
        <ProgressCard
          title="Deadlines"
          percent={progress.deadlines}
          subtitle={`${progress.deadlines}% complete`}
        />
      </div>

      {reminders.length > 0 && (
        <div className={styles.actionItems}>
          <h2 className={styles.sectionTitle}>Action Items</h2>
          {reminders.map((r, i) => (
            <div
              key={i}
              style={{
                borderLeft: `4px solid ${URGENCY_COLORS[r.urgency] ?? '#888'}`,
                background: '#16213e',
                padding: '0.6rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              {r.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
