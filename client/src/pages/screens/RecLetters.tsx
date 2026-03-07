import { useState } from 'react';
import ChecklistItem from '../../components/ChecklistItem';
import styles from './RecLetters.module.css';

const INITIAL_CHECKLIST = [
  { label: 'Build relationships with teachers', subtext: 'Ask questions, attend office hours — Junior Year (ongoing)', checked: true },
  { label: 'Request rec letter in person (2–3 teachers)', subtext: 'Done by end of Junior Year', checked: true },
  { label: 'Complete brag packet, FERPA & teacher forms', subtext: 'Due: Summer before Senior Year', checked: false },
  { label: 'Give brag packet + FERPA to teachers & counselor', subtext: 'Due: First week of Senior Year', checked: false },
  { label: 'Add teachers & counselor on Common App', subtext: 'Due: First week of Senior Year', checked: false },
  { label: 'Write thank you notes + gift', subtext: 'After submission', checked: false },
];

const TEACHERS = [
  { name: 'Ms. Johnson', subject: 'AP English', status: 'Requested — awaiting confirmation' },
  { name: 'Mr. Patel', subject: 'AP Chemistry', status: 'Confirmed — letter in progress' },
  { name: 'Counselor Ms. Lee', status: 'Scheduled meeting for October' },
];

export default function RecLetters() {
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);

  function toggleItem(index: number, checked: boolean) {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, checked } : item))
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Rec Letters</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Rec Letter Checklist</h2>
        {checklist.map((item, i) => (
          <ChecklistItem
            key={item.label}
            checked={item.checked}
            label={item.label}
            subtext={item.subtext}
            onChange={(checked) => toggleItem(i, checked)}
          />
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Teacher Tracker</h2>
        <div className={styles.teacherList}>
          {TEACHERS.map((t) => (
            <div key={t.name} className={styles.teacherCard}>
              <div className={styles.teacherName}>{t.name}</div>
              {t.subject && <div className={styles.teacherSubject}>{t.subject}</div>}
              <div className={styles.teacherStatus}>{t.status}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
