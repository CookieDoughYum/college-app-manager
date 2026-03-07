import BadgeLabel from '../../components/BadgeLabel';
import styles from './Deadlines.module.css';

// Static November 2025 calendar
const NOVEMBER_START_DOW = 6; // Saturday = 6 (0=Sun)
const NOVEMBER_DAYS = 30;
const HIGHLIGHTED_DAYS = new Set([15, 30]);

const UPCOMING = [
  { school: 'MIT', type: 'Early Action', variant: 'reach' as const, daysUntil: 8 },
  { school: 'UC Application', type: 'Regular Decision', variant: 'target' as const, daysUntil: 23 },
  { school: 'Cal Poly SLO', type: 'Regular Decision', variant: 'safety' as const, daysUntil: 46 },
];

export default function Deadlines() {
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < NOVEMBER_START_DOW; i++) calendarCells.push(null);
  for (let d = 1; d <= NOVEMBER_DAYS; d++) calendarCells.push(d);
  // pad to complete last row
  while (calendarCells.length % 7 !== 0) calendarCells.push(null);

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
        <h2 className={styles.sectionTitle}>Upcoming Deadlines</h2>
        <div className={styles.deadlineList}>
          {UPCOMING.map((item) => (
            <div key={item.school} className={styles.deadlineCard}>
              <div className={styles.deadlineLeft}>
                <div className={styles.deadlineSchool}>{item.school}</div>
                <div className={styles.deadlineType}>{item.type}</div>
              </div>
              <div className={styles.deadlineRight}>
                <BadgeLabel variant={item.variant} label={item.variant.charAt(0).toUpperCase() + item.variant.slice(1)} />
                <div className={styles.daysUntil}>{item.daysUntil} days</div>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.footNote}>
          Deadlines auto-fetched via Browser MCP from each school's admissions page. Last updated: today.
        </p>
      </section>
    </div>
  );
}
