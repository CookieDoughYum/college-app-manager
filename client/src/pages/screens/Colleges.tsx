import { useState } from 'react';
import TagChip from '../../components/TagChip';
import BadgeLabel from '../../components/BadgeLabel';
import styles from './Colleges.module.css';

interface College {
  name: string;
  location: string;
  variant: 'reach' | 'target' | 'safety';
}

const DEFAULT_COLLEGES: College[] = [
  { name: 'MIT', location: 'Cambridge, MA', variant: 'reach' },
  { name: 'UCLA', location: 'Los Angeles, CA', variant: 'target' },
  { name: 'Cal Poly SLO', location: 'San Luis Obispo, CA', variant: 'safety' },
];

const RECOMMENDED_MAJORS = ['Computer Science', 'Biomedical Eng.', 'Data Science'];

export default function Colleges() {
  const [salaryGoal, setSalaryGoal] = useState('');
  const [interestArea, setInterestArea] = useState('');
  const [colleges] = useState<College[]>(DEFAULT_COLLEGES);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>College &amp; Major</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Major Questionnaire</h2>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Salary Goal (annual)</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. $80,000"
              value={salaryGoal}
              onChange={(e) => setSalaryGoal(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Professional Interest Area</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Healthcare, Engineering"
              value={interestArea}
              onChange={(e) => setInterestArea(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recommended Majors</h2>
        <div className={styles.chipRow}>
          {RECOMMENDED_MAJORS.map((major) => (
            <TagChip key={major} label={major} selected={false} onClick={() => {}} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>My College List</h2>
          <span className={styles.goalNote}>Aim for 2–3 reach, 3–4 target, 2–3 safety</span>
        </div>
        <div className={styles.collegeList}>
          {colleges.map((college) => (
            <div key={college.name} className={styles.collegeCard}>
              <div className={styles.collegeName}>{college.name}</div>
              <div className={styles.collegeLocation}>{college.location}</div>
              <BadgeLabel variant={college.variant} label={college.variant.charAt(0).toUpperCase() + college.variant.slice(1)} />
            </div>
          ))}
          <div className={`${styles.collegeCard} ${styles.addCard}`}>
            <span className={styles.addLabel}>+ Add a school</span>
          </div>
        </div>
      </section>
    </div>
  );
}
