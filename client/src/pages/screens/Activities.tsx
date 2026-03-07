import { useState } from 'react';
import TagChip from '../../components/TagChip';
import styles from './Activities.module.css';

const INTEREST_TAGS = ['Science', 'Leadership', 'Arts', 'Community', 'Tech'];

const GRADE_COLUMNS = [
  { label: '9th Grade', warn: false },
  { label: '10th Grade', warn: false },
  { label: '11th Grade', warn: true },
  { label: '12th Grade', warn: false },
];

export default function Activities() {
  const [interests, setInterests] = useState<Set<string>>(new Set());
  const [gpa, setGpa] = useState('');
  const [sat, setSat] = useState('');
  const [act, setAct] = useState('');

  function toggleInterest(tag: string) {
    setInterests((prev) => {
      const next = new Set(prev);
      next.has(tag) ? next.delete(tag) : next.add(tag);
      return next;
    });
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Activities &amp; Courses</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Interests Questionnaire</h2>
        <div className={styles.chipRow}>
          {INTEREST_TAGS.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              selected={interests.has(tag)}
              onClick={() => toggleInterest(tag)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Academic Profile</h2>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>GPA</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. 3.8"
              value={gpa}
              onChange={(e) => setGpa(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>SAT Score</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. 1400"
              value={sat}
              onChange={(e) => setSat(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>ACT Score</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. 31"
              value={act}
              onChange={(e) => setAct(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Recommendations</h2>
        <div className={styles.placeholder}>
          Complete the questionnaire above to see personalized recommendations for Extracurriculars and Summer Programs.
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4-Year Course Plan</h2>
        <div className={styles.planGrid}>
          {GRADE_COLUMNS.map(({ label, warn }) => (
            <div key={label} className={warn ? `${styles.planCol} ${styles.planColWarn}` : styles.planCol}>
              <div className={styles.planColHeader}>{label}</div>
              <div className={styles.planColBody}>
                <p className={styles.planPlaceholder}>No courses added yet.</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
