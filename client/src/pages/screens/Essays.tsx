import { useState } from 'react';
import TagChip from '../../components/TagChip';
import styles from './Essays.module.css';

const TIMELINE = [
  {
    period: 'Late May – June',
    color: 'red' as const,
    description: 'Brainstorm personal statement topics. Read examples. Begin freewriting.',
  },
  {
    period: 'July',
    color: 'amber' as const,
    description: 'Draft and revise personal statement. Start UC PIQs and school-specific supplements.',
  },
  {
    period: 'August',
    color: 'green' as const,
    description: 'Finalize personal statement. Complete all supplements. Get peer and adult feedback.',
  },
];

const DRIVE_FOLDERS = ['UC PIQs', 'Personal Statement', 'Supplementals', 'Honors Essays', 'Scholarships', 'Activities List'];

export default function Essays() {
  const [schoolName, setSchoolName] = useState('');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Essays</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Essay Timeline</h2>
        <div className={styles.timeline}>
          {TIMELINE.map((item) => (
            <div key={item.period} className={`${styles.timelineCard} ${styles[item.color]}`}>
              <div className={styles.timelinePeriod}>{item.period}</div>
              <p className={styles.timelineDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Google Drive Setup</h2>
        <p className={styles.driveNote}>Create these folders in your Drive for organized essay writing:</p>
        <div className={styles.chipRow}>
          {DRIVE_FOLDERS.map((folder) => (
            <TagChip key={folder} label={folder} selected={true} onClick={() => {}} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>"Why Us?" Assistant</h2>
        <div className={styles.whyUsRow}>
          <input
            className={styles.input}
            type="text"
            placeholder="School name (e.g. Stanford)"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
          />
          <button className={styles.researchBtn}>Research →</button>
        </div>
        <div className={styles.outputArea}>
          Enter a school name and click Research to generate talking points for your "Why Us?" essay.
        </div>
      </section>
    </div>
  );
}
