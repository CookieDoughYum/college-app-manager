import { useState, useEffect } from 'react';
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

interface EssaysData {
  driveLink: string | null;
  notes: string | null;
}

const DEFAULT_DATA: EssaysData = { driveLink: null, notes: null };

export default function Essays() {
  const [data, setData] = useState<EssaysData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [schoolName, setSchoolName] = useState('');

  useEffect(() => {
    fetch('/api/student/essays', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: EssaysData) {
    setData(updated);
    fetch('/api/student/essays', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

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
        <div style={{ marginTop: '0.75rem' }}>
          <input
            className={styles.input}
            type="text"
            placeholder="Paste your Google Drive folder link"
            value={data.driveLink ?? ''}
            onChange={(e) => setData({ ...data, driveLink: e.target.value })}
            onBlur={() => save(data)}
          />
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

      {/* Notes */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Notes</h2>
        <textarea
          style={{ width: '100%', minHeight: '80px', padding: '0.5rem', borderRadius: '6px', border: '1px solid #333', background: '#16213e', color: '#fff', resize: 'vertical' }}
          placeholder="Essay notes, ideas, or reminders…"
          value={data.notes ?? ''}
          onChange={(e) => setData({ ...data, notes: e.target.value })}
          onBlur={() => save(data)}
        />
      </section>
    </div>
  );
}
