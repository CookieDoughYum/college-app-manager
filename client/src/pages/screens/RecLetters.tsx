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

const STATUS_OPTIONS = [
  'Considering',
  'Asked',
  'Agreed',
  'Brag packet submitted',
  'Letter submitted',
  'Received',
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
const EMPTY_TEACHER: Teacher = { name: '', subject: '', status: 'Considering' };

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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Teacher>(EMPTY_TEACHER);
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState<Teacher>(EMPTY_TEACHER);

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

  function addTeacher() {
    if (!addDraft.name.trim()) return;
    const updated = { ...data, teachers: [...data.teachers, { ...addDraft, subject: addDraft.subject?.trim() || undefined }] };
    save(updated);
    setAdding(false);
    setAddDraft(EMPTY_TEACHER);
  }

  function startEdit(index: number) {
    setEditingIndex(index);
    setEditDraft({ ...data.teachers[index] });
    setAdding(false);
  }

  function saveEdit() {
    if (!editDraft.name.trim() || editingIndex === null) return;
    const teachers = data.teachers.map((t, i) =>
      i === editingIndex ? { ...editDraft, subject: editDraft.subject?.trim() || undefined } : t
    );
    save({ ...data, teachers });
    setEditingIndex(null);
  }

  function deleteTeacher(index: number) {
    save({ ...data, teachers: data.teachers.filter((_, i) => i !== index) });
    if (editingIndex === index) setEditingIndex(null);
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
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Teacher Tracker</h2>
          {!adding && (
            <button className={styles.addBtn} onClick={() => { setAdding(true); setEditingIndex(null); }}>
              + Add Teacher
            </button>
          )}
        </div>

        {adding && (
          <div className={styles.teacherForm}>
            <input
              className={styles.formInput}
              placeholder="Teacher name *"
              value={addDraft.name}
              onChange={(e) => setAddDraft({ ...addDraft, name: e.target.value })}
              autoFocus
            />
            <input
              className={styles.formInput}
              placeholder="Subject (optional)"
              value={addDraft.subject ?? ''}
              onChange={(e) => setAddDraft({ ...addDraft, subject: e.target.value })}
            />
            <select
              className={styles.formSelect}
              value={addDraft.status}
              onChange={(e) => setAddDraft({ ...addDraft, status: e.target.value })}
            >
              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <div className={styles.formActions}>
              <button className={styles.saveBtn} onClick={addTeacher}>Add</button>
              <button className={styles.cancelBtn} onClick={() => { setAdding(false); setAddDraft(EMPTY_TEACHER); }}>Cancel</button>
            </div>
          </div>
        )}

        <div className={styles.teacherList}>
          {data.teachers.length === 0 && !adding ? (
            <p style={{ color: '#888', margin: '8px 0 0' }}>No teachers added yet.</p>
          ) : (
            data.teachers.map((t, i) => (
              editingIndex === i ? (
                <div key={i} className={styles.teacherForm}>
                  <input
                    className={styles.formInput}
                    placeholder="Teacher name *"
                    value={editDraft.name}
                    onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                    autoFocus
                  />
                  <input
                    className={styles.formInput}
                    placeholder="Subject (optional)"
                    value={editDraft.subject ?? ''}
                    onChange={(e) => setEditDraft({ ...editDraft, subject: e.target.value })}
                  />
                  <select
                    className={styles.formSelect}
                    value={editDraft.status}
                    onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value })}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <div className={styles.formActions}>
                    <button className={styles.saveBtn} onClick={saveEdit}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => setEditingIndex(null)}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={() => deleteTeacher(i)}>Delete</button>
                  </div>
                </div>
              ) : (
                <div key={i} className={styles.teacherCard}>
                  <div className={styles.teacherInfo}>
                    <div className={styles.teacherName}>{t.name}</div>
                    {t.subject && <div className={styles.teacherSubject}>{t.subject}</div>}
                    <div className={`${styles.teacherStatus} ${styles['status_' + t.status.replace(/\s+/g, '_')]}`}>
                      {t.status}
                    </div>
                  </div>
                  <button className={styles.editBtn} onClick={() => startEdit(i)}>Edit</button>
                </div>
              )
            ))
          )}
        </div>
      </section>
    </div>
  );
}
