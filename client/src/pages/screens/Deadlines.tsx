import { useState, useEffect } from 'react';
import BadgeLabel from '../../components/BadgeLabel';
import styles from './Deadlines.module.css';

interface Deadline {
  school: string;
  label: string;
  date: string;
  variant: 'reach' | 'target' | 'safety';
}

interface DeadlinesData {
  manualDeadlines: Deadline[];
}

const DEFAULT_DATA: DeadlinesData = { manualDeadlines: [] };

// Static November 2025 calendar
const NOVEMBER_START_DOW = 6; // Saturday = 6 (0=Sun)
const NOVEMBER_DAYS = 30;
const HIGHLIGHTED_DAYS = new Set([15, 30]);

export default function Deadlines() {
  const [data, setData] = useState<DeadlinesData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/deadlines', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: DeadlinesData) {
    setData(updated);
    fetch('/api/student/deadlines', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < NOVEMBER_START_DOW; i++) calendarCells.push(null);
  for (let d = 1; d <= NOVEMBER_DAYS; d++) calendarCells.push(d);
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Deadlines</h1>

      <section className={styles.section}>
        <div className={styles.calHeader}>
          <h2 className={styles.sectionTitle}>November 2025</h2>
          <span className={styles.calNote}>(auto-populated from your college list)</span>
        </div>
        <div className={styles.calGrid}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className={styles.calDow}>{d}</div>
          ))}
          {calendarCells.map((day, i) => (
            <div
              key={i}
              className={
                day === null
                  ? styles.calEmpty
                  : HIGHLIGHTED_DAYS.has(day)
                  ? `${styles.calDay} ${styles.calDayHighlight}`
                  : styles.calDay
              }
            >
              {day}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>Upcoming Deadlines</h2>
          <button
            style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
            onClick={() => save({ manualDeadlines: [...data.manualDeadlines, { school: 'School Name', label: 'Regular Decision', date: '', variant: 'target' }] })}
          >
            + Add Deadline
          </button>
        </div>
        <div className={styles.deadlineList}>
          {data.manualDeadlines.length === 0 ? (
            <p style={{ color: '#888' }}>No deadlines added yet.</p>
          ) : (
            data.manualDeadlines.map((item, i) => (
              <div key={i} className={styles.deadlineCard}>
                <div className={styles.deadlineLeft}>
                  <div className={styles.deadlineSchool}>{item.school}</div>
                  <div className={styles.deadlineType}>{item.label}</div>
                </div>
                <div className={styles.deadlineRight}>
                  <BadgeLabel variant={item.variant} label={item.variant.charAt(0).toUpperCase() + item.variant.slice(1)} />
                  <div className={styles.daysUntil}>{item.date || '—'}</div>
                </div>
              </div>
            ))
          )}
        </div>
        <p className={styles.footNote}>
          Deadlines auto-fetched via Browser MCP from each school's admissions page. Last updated: today.
        </p>
      </section>
    </div>
  );
}
