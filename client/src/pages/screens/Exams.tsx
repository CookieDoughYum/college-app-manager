import { useState, useEffect } from 'react';
import TagChip from '../../components/TagChip';
import styles from './Exams.module.css';

interface ExamsData {
  testPreference: string | null;
  apCourses: string[];
}

const DEFAULT_DATA: ExamsData = { testPreference: null, apCourses: [] };

export default function Exams() {
  const [data, setData] = useState<ExamsData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [addingAp, setAddingAp] = useState(false);
  const [apInput, setApInput] = useState('');

  useEffect(() => {
    fetch('/api/student/exams', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: ExamsData) {
    setData(updated);
    fetch('/api/student/exams', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function addApCourse() {
    const trimmed = apInput.trim();
    if (trimmed) save({ ...data, apCourses: [...data.apCourses, trimmed] });
    setApInput('');
    setAddingAp(false);
  }

  function removeApCourse(course: string) {
    save({ ...data, apCourses: data.apCourses.filter(c => c !== course) });
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Exam Prep</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>SAT or ACT?</h2>
        <div className={styles.satActBox}>
          <p className={styles.satActPrompt}>Answer 5 quick questions to find out which test is right for you.</p>
          <p className={styles.satActResult}>— Complete the questionnaire to see your recommendation —</p>
        </div>
      </section>

      <div className={styles.cardRow}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>SAT Prep</div>
          <p className={styles.cardBody}>Khan Academy offers free, official SAT prep.</p>
          <a className={styles.cardLink} href="#sat-prep">Register for SAT →</a>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Test Day Reminders</div>
          <p className={styles.cardBody}>Bring photo ID, pencils, and your admission ticket. Arrive 30 minutes early.</p>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AP Exam Tracker</h2>
        <div className={styles.chipRow}>
          {data.apCourses.map((course) => (
            <TagChip
              key={course}
              label={course}
              selected={true}
              onClick={() => removeApCourse(course)}
            />
          ))}
          {addingAp ? (
            <span className={styles.apInputWrap}>
              <input
                autoFocus
                className={styles.apInput}
                value={apInput}
                onChange={(e) => setApInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addApCourse()}
                placeholder="Course name"
              />
              <button className={styles.apAddBtn} onClick={addApCourse}>Add</button>
            </span>
          ) : (
            <button className={styles.addChip} onClick={() => setAddingAp(true)}>+ Add</button>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Suggested Study Schedule</h2>
        <p className={styles.placeholder}>Complete your profile to see a personalized study schedule.</p>
      </section>

      <div className={styles.warningBox}>
        ⚠ AP exam registration typically opens in the fall. Check with your school's AP coordinator early.
      </div>
    </div>
  );
}
