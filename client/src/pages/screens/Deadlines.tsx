import { useState, useEffect } from 'react';
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

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const VARIANT_COLOR: Record<string, string> = {
  reach: '#e94560',
  target: '#e65100',
  safety: '#2e7d32',
};

/** Parse "November 1" or "January 15, 2026" → { month: 0-11, day: 1-31 } or null */
function parseDeadlineDate(dateStr: string): { month: number; day: number } | null {
  if (!dateStr) return null;
  for (let m = 0; m < MONTHS.length; m++) {
    if (dateStr.toLowerCase().includes(MONTHS[m].toLowerCase())) {
      const match = dateStr.match(/\d+/g);
      const day = match ? parseInt(match[0]) : null;
      if (day && day >= 1 && day <= 31) return { month: m, day };
    }
  }
  return null;
}

export default function Deadlines() {
  const today = new Date();
  const [data, setData] = useState<DeadlinesData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

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

  async function fetchDeadlines() {
    setFetchLoading(true);
    setFetchError('');
    try {
      const res = await fetch('/api/ai/deadlines/scrape', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Server error');
      const { deadlines, result } = await res.json();
      if (!deadlines || deadlines.length === 0) {
        setFetchError(result || 'No deadlines returned.');
        return;
      }
      save({ manualDeadlines: deadlines as Deadline[] });
    } catch {
      setFetchError('Could not fetch deadlines — please try again.');
    } finally {
      setFetchLoading(false);
    }
  }

  function removeDeadline(index: number) {
    save({ manualDeadlines: data.manualDeadlines.filter((_, i) => i !== index) });
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  }

  // Build calendar grid
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // Map day → deadlines for this month
  const deadlinesByDay = new Map<number, Deadline[]>();
  for (const d of data.manualDeadlines) {
    const parsed = parseDeadlineDate(d.date);
    if (parsed && parsed.month === viewMonth) {
      const list = deadlinesByDay.get(parsed.day) ?? [];
      list.push(d);
      deadlinesByDay.set(parsed.day, list);
    }
  }

  // Deadlines for selected day or all in this month sorted by day
  const selectedDeadlines = selectedDay
    ? (deadlinesByDay.get(selectedDay) ?? [])
    : [];

  const monthDeadlines = data.manualDeadlines
    .map(d => ({ deadline: d, parsed: parseDeadlineDate(d.date) }))
    .filter(x => x.parsed && x.parsed.month === viewMonth)
    .sort((a, b) => a.parsed!.day - b.parsed!.day);

  const isToday = (day: number) =>
    day === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Deadlines</h1>

      <section className={styles.section}>
        <div className={styles.calHeader}>
          <button className={styles.navBtn} onClick={prevMonth}>‹</button>
          <h2 className={styles.calTitle}>{MONTHS[viewMonth]} {viewYear}</h2>
          <button className={styles.navBtn} onClick={nextMonth}>›</button>
          <button
            className={styles.fetchBtn}
            onClick={fetchDeadlines}
            disabled={fetchLoading}
          >
            {fetchLoading ? 'Fetching…' : 'Fetch from College List'}
          </button>
        </div>
        {fetchError && <p className={styles.fetchError}>{fetchError}</p>}

        <div className={styles.calGrid}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className={styles.calDow}>{d}</div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={i} className={styles.calEmpty} />;
            const dots = deadlinesByDay.get(day) ?? [];
            const selected = selectedDay === day;
            return (
              <div
                key={i}
                className={`${styles.calDay} ${isToday(day) ? styles.calToday : ''} ${selected ? styles.calSelected : ''}`}
                onClick={() => setSelectedDay(selected ? null : day)}
              >
                <span className={styles.calDayNum}>{day}</span>
                {dots.length > 0 && (
                  <div className={styles.dotRow}>
                    {dots.slice(0, 3).map((d, j) => (
                      <span key={j} className={styles.dot} style={{ background: VARIANT_COLOR[d.variant] }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {selectedDay && selectedDeadlines.length > 0 && (
          <div className={styles.dayDetail}>
            <div className={styles.dayDetailTitle}>{MONTHS[viewMonth]} {selectedDay}</div>
            {selectedDeadlines.map((d, i) => (
              <div key={i} className={styles.dayDetailItem}>
                <span className={styles.dayDetailDot} style={{ background: VARIANT_COLOR[d.variant] }} />
                <span className={styles.dayDetailSchool}>{d.school}</span>
                <span className={styles.dayDetailLabel}>{d.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>
            {monthDeadlines.length > 0 ? `${MONTHS[viewMonth]} Deadlines` : 'All Deadlines'}
          </h2>
          <button
            className={styles.addBtn}
            onClick={() => save({
              manualDeadlines: [...data.manualDeadlines, { school: '', label: 'Regular Decision', date: '', variant: 'target' }],
            })}
          >
            + Add
          </button>
        </div>
        <div className={styles.deadlineList}>
          {data.manualDeadlines.length === 0 ? (
            <p className={styles.emptyNote}>No deadlines yet — click "Fetch from College List" to import them automatically.</p>
          ) : (
            data.manualDeadlines.map((item, i) => {
              const parsed = parseDeadlineDate(item.date);
              const inView = parsed && parsed.month === viewMonth;
              return (
                <div key={i} className={`${styles.deadlineCard} ${inView ? styles.deadlineCardActive : ''}`}>
                  <div className={styles.dlDot} style={{ background: VARIANT_COLOR[item.variant] }} />
                  <div className={styles.dlBody}>
                    <input
                      className={styles.dlInput}
                      value={item.school}
                      placeholder="School"
                      onChange={e => {
                        const updated = data.manualDeadlines.map((d, j) => j === i ? { ...d, school: e.target.value } : d);
                        setData({ manualDeadlines: updated });
                      }}
                      onBlur={() => save(data)}
                    />
                    <div className={styles.dlMeta}>
                      <input
                        className={styles.dlInputSm}
                        value={item.label}
                        placeholder="Type (e.g. Early Decision)"
                        onChange={e => {
                          const updated = data.manualDeadlines.map((d, j) => j === i ? { ...d, label: e.target.value } : d);
                          setData({ manualDeadlines: updated });
                        }}
                        onBlur={() => save(data)}
                      />
                      <input
                        className={styles.dlInputSm}
                        value={item.date}
                        placeholder="Date (e.g. November 1)"
                        onChange={e => {
                          const updated = data.manualDeadlines.map((d, j) => j === i ? { ...d, date: e.target.value } : d);
                          setData({ manualDeadlines: updated });
                        }}
                        onBlur={() => save(data)}
                      />
                      <select
                        className={styles.dlSelect}
                        value={item.variant}
                        onChange={e => {
                          const updated = data.manualDeadlines.map((d, j) => j === i ? { ...d, variant: e.target.value as Deadline['variant'] } : d);
                          save({ manualDeadlines: updated });
                        }}
                      >
                        <option value="reach">Reach</option>
                        <option value="target">Target</option>
                        <option value="safety">Safety</option>
                      </select>
                    </div>
                  </div>
                  <button className={styles.dlRemove} onClick={() => removeDeadline(i)} title="Remove">×</button>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
