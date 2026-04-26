import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import ProgressCard from '../components/ProgressCard';
import OnboardingOverlay from '../components/OnboardingOverlay';
import MarkdownOutput from '../components/MarkdownOutput';
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

const CARD_ROUTES: Record<string, string> = {
  'Activities & Courses': '/activities',
  'Exam Prep': '/exams',
  'Colleges': '/colleges',
  'Essays': '/essays',
  'Rec Letters': '/recs',
  'App Portals': '/portals',
  'Decide': '/decide',
  'Financial Aid': '/aid',
  'Deadlines': '/deadlines',
};

export default function Dashboard() {
  const { student } = useStudent();
  const navigate = useNavigate();
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

  function nav(title: string) {
    const route = CARD_ROUTES[title];
    if (route) navigate(route);
  }

  return (
    <div className={styles.page}>
      <OnboardingOverlay grade={student?.grade ?? 9} />
      <div className={styles.header}>
        <h1 className={styles.welcome}>Welcome back, {student?.name ?? 'Student'} 👋</h1>
        <p className={styles.subtitle}>{student?.highSchool}</p>
        {student?.grade && (
          <span className={styles.gradePill}>Grade {student.grade}</span>
        )}
      </div>

      <p className={styles.sectionLabel}>Your Progress</p>
      <div className={styles.cards}>
        <ProgressCard
          title="Activities & Courses"
          percent={progress.activities}
          subtitle={progress.activities === 0 ? 'Start planning your activities' : `${progress.activities}% complete`}
          onClick={() => nav('Activities & Courses')}
        />
        <ProgressCard
          title="Exam Prep"
          percent={progress.exams}
          subtitle={progress.exams === 0 ? 'Plan your SAT, ACT & APs' : `${progress.exams}% complete`}
          onClick={() => nav('Exam Prep')}
        />
        <ProgressCard
          title="Colleges"
          percent={progress.colleges}
          subtitle={progress.colleges === 0 ? 'Build your college list' : `${progress.colleges}% complete`}
          onClick={() => nav('Colleges')}
        />
        <ProgressCard
          title="Essays"
          percent={progress.essays}
          subtitle={`${progress.essays}% complete`}
          onClick={() => nav('Essays')}
        />
        <ProgressCard
          title="Rec Letters"
          percent={progress.recletters}
          subtitle={`${progress.recletters}% complete`}
          onClick={() => nav('Rec Letters')}
        />
        <ProgressCard
          title="App Portals"
          percent={progress.portals}
          subtitle={`${progress.portals}% complete`}
          onClick={() => nav('App Portals')}
        />
        <ProgressCard
          title="Decide"
          percent={progress.decide}
          subtitle={`${progress.decide}% complete`}
          onClick={() => nav('Decide')}
        />
        <ProgressCard
          title="Financial Aid"
          percent={progress.financialaid}
          subtitle={`${progress.financialaid}% complete`}
          onClick={() => nav('Financial Aid')}
        />
        <ProgressCard
          title="Deadlines"
          percent={progress.deadlines}
          subtitle={`${progress.deadlines}% complete`}
          onClick={() => nav('Deadlines')}
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
                background: '#f9fafb',
                padding: '0.6rem 1rem',
                marginBottom: '0.5rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
              }}
            >
              <MarkdownOutput>{r.message}</MarkdownOutput>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
