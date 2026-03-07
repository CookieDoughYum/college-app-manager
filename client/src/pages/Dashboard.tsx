import { useStudent } from '../contexts/StudentContext';
import ProgressCard from '../components/ProgressCard';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { student } = useStudent();

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
          percent={0}
          subtitle="No activities recorded yet"
        />
        <ProgressCard
          title="Exam Prep"
          percent={0}
          subtitle="No exams scheduled yet"
        />
        <ProgressCard
          title="Colleges"
          percent={0}
          subtitle="No colleges added yet"
        />
      </div>

      <div className={styles.actionItems}>
        <h2 className={styles.sectionTitle}>Action Items</h2>
        <p className={styles.placeholder}>
          Complete your profile to see personalized action items.
        </p>
      </div>
    </div>
  );
}
