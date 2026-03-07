import { useState } from 'react';
import styles from './Portals.module.css';

interface Portal {
  name: string;
  url: string;
  status: 'In Progress' | 'Not Started' | 'Submitted';
}

const INITIAL_PORTALS: Portal[] = [
  { name: 'Common App', url: 'commonapp.org', status: 'In Progress' },
  { name: 'UC Application', url: 'apply.universityofcalifornia.edu', status: 'Not Started' },
];

const STATUS_STYLE: Record<string, string> = {
  'In Progress': styles.statusInProgress,
  'Not Started': styles.statusNotStarted,
  'Submitted': styles.statusSubmitted,
};

export default function Portals() {
  const [portals] = useState<Portal[]>(INITIAL_PORTALS);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>App Portals</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Dates</h2>
        <div className={styles.dateCards}>
          <div className={`${styles.dateCard} ${styles.dateCardRed}`}>
            <div className={styles.dateCardTitle}>Common App / UC App</div>
            <p className={styles.dateCardBody}>Opens August 1. Regular Decision deadline: January 1. Early Action/Early Decision: November 1–15.</p>
          </div>
          <div className={`${styles.dateCard} ${styles.dateCardAmber}`}>
            <div className={styles.dateCardTitle}>CSU Application</div>
            <p className={styles.dateCardBody}>Opens October 1. Priority filing period: October 1 – November 30.</p>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>My Application Portals</h2>
          <button className={styles.addBtn}>+ Add Portal</button>
        </div>
        {portals.length === 0 ? (
          <p className={styles.emptyState}>No portals added yet. Click "+ Add Portal" to get started.</p>
        ) : (
          <div className={styles.portalList}>
            {portals.map((portal) => (
              <div key={portal.name} className={styles.portalCard}>
                <div className={styles.portalName}>{portal.name}</div>
                <div className={styles.portalUrl}>{portal.url}</div>
                <span className={`${styles.statusTag} ${STATUS_STYLE[portal.status]}`}>
                  {portal.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
