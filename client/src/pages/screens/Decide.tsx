import { useState } from 'react';
import styles from './Decide.module.css';

interface AdmissionResult {
  school: string;
  status: 'Accepted' | 'Not admitted' | 'Waitlisted';
}

const INITIAL_RESULTS: AdmissionResult[] = [
  { school: 'UCLA', status: 'Accepted' },
  { school: 'UC San Diego', status: 'Accepted' },
  { school: 'MIT', status: 'Not admitted' },
];

const STATUS_STYLE: Record<string, string> = {
  Accepted: styles.accepted,
  'Not admitted': styles.notAdmitted,
  Waitlisted: styles.waitlisted,
};

export default function Decide() {
  const [results] = useState<AdmissionResult[]>(INITIAL_RESULTS);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Decide</h1>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>Acceptances</h2>
          <button className={styles.addBtn}>+ Add Result</button>
        </div>
        <div className={styles.resultList}>
          {results.map((r) => (
            <div key={r.school} className={`${styles.resultCard} ${STATUS_STYLE[r.status]}`}>
              <div className={styles.schoolName}>{r.school}</div>
              <div className={styles.statusText}>
                {r.status === 'Accepted' ? '✅' : r.status === 'Not admitted' ? '❌' : '⏳'} {r.status}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Decision Helper</h2>
        <div className={styles.helperBox}>
          <div className={styles.helperSchool}>UCLA vs. UC San Diego</div>
          <div className={styles.prosConsList}>
            <div>
              <div className={styles.prosConsLabel}>UCLA Pros</div>
              <ul className={styles.list}>
                <li>Top-ranked program in your major</li>
                <li>Strong alumni network in LA</li>
                <li>More campus resources</li>
              </ul>
            </div>
            <div>
              <div className={styles.prosConsLabel}>UCSD Pros</div>
              <ul className={styles.list}>
                <li>Better financial aid package</li>
                <li>Smaller class sizes</li>
                <li>Research opportunities in biotech</li>
              </ul>
            </div>
          </div>
          <p className={styles.helperNote}>Complete your profile to generate a personalized comparison.</p>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Honors Programs</h2>
        <p className={styles.honorsNote}>Check these honors programs at your accepted schools — they offer smaller classes and special advising.</p>
        <div className={styles.honorsList}>
          <div className={styles.honorsItem}>UCLA Honors Program — application due May 1</div>
          <div className={styles.honorsItem}>UCSD Regents Scholars — automatically considered</div>
        </div>
      </section>
    </div>
  );
}
