import { useState, useEffect } from 'react';
import styles from './Portals.module.css';

interface Portal {
  name: string;
  url: string;
  status: 'In Progress' | 'Not Started' | 'Submitted';
}

interface PortalsData {
  portals: Portal[];
}

const DEFAULT_DATA: PortalsData = { portals: [] };

const STATUS_STYLE: Record<string, string> = {
  'In Progress': styles.statusInProgress,
  'Not Started': styles.statusNotStarted,
  'Submitted': styles.statusSubmitted,
};

export default function Portals() {
  const [data, setData] = useState<PortalsData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/portals', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: PortalsData) {
    setData(updated);
    fetch('/api/student/portals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function cycleStatus(index: number) {
    const statuses: Portal['status'][] = ['Not Started', 'In Progress', 'Submitted'];
    const current = data.portals[index].status;
    const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
    const updated = data.portals.map((p, i) => i === index ? { ...p, status: next } : p);
    save({ portals: updated });
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

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
          <button className={styles.addBtn} onClick={() => save({ portals: [...data.portals, { name: 'New Portal', url: '', status: 'Not Started' }] })}>+ Add Portal</button>
        </div>
        {data.portals.length === 0 ? (
          <p className={styles.emptyState}>No portals added yet. Click "+ Add Portal" to get started.</p>
        ) : (
          <div className={styles.portalList}>
            {data.portals.map((portal, i) => (
              <div key={i} className={styles.portalCard}>
                <div className={styles.portalName}>{portal.name}</div>
                <div className={styles.portalUrl}>{portal.url}</div>
                <span
                  className={`${styles.statusTag} ${STATUS_STYLE[portal.status]}`}
                  onClick={() => cycleStatus(i)}
                  style={{ cursor: 'pointer' }}
                >
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
