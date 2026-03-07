import { useState } from 'react';
import TagChip from '../../components/TagChip';
import styles from './Exams.module.css';

export default function Exams() {
  const [apCourses, setApCourses] = useState<string[]>(['AP Calculus', 'AP Biology']);
  const [addingAp, setAddingAp] = useState(false);
  const [apInput, setApInput] = useState('');

  function addApCourse() {
    const trimmed = apInput.trim();
    if (trimmed) {
      setApCourses((prev) => [...prev, trimmed]);
    }
    setApInput('');
    setAddingAp(false);
  }

  function removeApCourse(course: string) {
    setApCourses((prev) => prev.filter((c) => c !== course));
  }

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
          {apCourses.map((course) => (
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
