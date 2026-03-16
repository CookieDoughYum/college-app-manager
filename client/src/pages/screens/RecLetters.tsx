import { useState, useEffect } from 'react';
import ChecklistItem from '../../components/ChecklistItem';
import styles from './RecLetters.module.css';

const CHECKLIST_ITEMS = [
  { key: 'build', label: 'Build relationships with teachers', subtext: 'Ask questions, attend office hours — Junior Year (ongoing)' },
  { key: 'request', label: 'Request rec letter in person (2–3 teachers)', subtext: 'Done by end of Junior Year' },
  { key: 'bragPacket', label: 'Complete brag packet, FERPA & teacher forms', subtext: 'Due: Summer before Senior Year' },
  { key: 'giveBrag', label: 'Give brag packet + FERPA to teachers & counselor', subtext: 'Due: First week of Senior Year' },
  { key: 'commonApp', label: 'Add teachers & counselor on Common App', subtext: 'Due: First week of Senior Year' },
  { key: 'thankYou', label: 'Write thank you notes + gift', subtext: 'After submission' },
];

interface Teacher {
  name: string;
  subject?: string;
  status: string;
}

interface RecLettersData {
  checklist: Record<string, boolean>;
  teachers: Teacher[];
}

const DEFAULT_DATA: RecLettersData = { checklist: {}, teachers: [] };

export default function RecLetters() {
  const [data, setData] = useState<RecLettersData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/recletters', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: RecLettersData) {
    setData(updated);
    fetch('/api/student/recletters', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function toggleItem(key: string, checked: boolean) {
    save({ ...data, checklist: { ...data.checklist, [key]: checked } });
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Rec Letters</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Rec Letter Checklist</h2>
        {CHECKLIST_ITEMS.map((item) => (
          <ChecklistItem
            key={item.key}
            checked={data.checklist[item.key] ?? false}
            label={item.label}
            subtext={item.subtext}
            onChange={(checked) => toggleItem(item.key, checked)}
          />
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Teacher Tracker</h2>
        <div className={styles.teacherList}>
          {data.teachers.length === 0 ? (
            <p style={{ color: '#888' }}>No teachers added yet.</p>
          ) : (
            data.teachers.map((t) => (
              <div key={t.name} className={styles.teacherCard}>
                <div className={styles.teacherName}>{t.name}</div>
                {t.subject && <div className={styles.teacherSubject}>{t.subject}</div>}
                <div className={styles.teacherStatus}>{t.status}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
