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

function getNextActionKey(grade: number): string {
  const now = new Date();
  const month = now.getMonth(); // 0=Jan, 10=Nov
  if (grade <= 10) return 'build';
  if (grade === 11) return 'request';
  if (grade === 12 && month < 10) return 'commonApp'; // before Nov
  return 'thankYou';
}

export default function RecLetters() {
  const [data, setData] = useState<RecLettersData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [grade, setGrade] = useState<number>(11);

  useEffect(() => {
    fetch('/api/student/recletters', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
    fetch('/api/student/profile', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { if (d?.grade) setGrade(d.grade); })
      .catch(() => {});
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

  const nextActionKey = getNextActionKey(grade);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Rec Letters</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Rec Letter Checklist</h2>
        {CHECKLIST_ITEMS.map((item) => (
          <div key={item.key} style={{ position: 'relative' }}>
            {item.key === nextActionKey && !data.checklist[item.key] && (
              <div data-next-action style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: '#e94560', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', whiteSpace: 'nowrap' }}>
                → Next Step
              </div>
            )}
            <ChecklistItem
              checked={data.checklist[item.key] ?? false}
              label={item.label}
              subtext={item.subtext}
              onChange={(checked) => toggleItem(item.key, checked)}
            />
          </div>
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
