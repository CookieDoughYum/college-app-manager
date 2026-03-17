import { useState, useEffect } from 'react';
import TagChip from '../../components/TagChip';
import styles from './Exams.module.css';

interface ExamsData {
  testPreference: string | null;
  apCourses: string[];
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: ExamsData = { testPreference: null, apCourses: [], aiRecommendations: {} };

export default function Exams() {
  const [data, setData] = useState<ExamsData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [addingAp, setAddingAp] = useState(false);
  const [apInput, setApInput] = useState('');

  useEffect(() => {
    fetch('/api/student/exams', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: ExamsData) {
    setData(updated);
    fetch('/api/student/exams', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function addApCourse() {
    const trimmed = apInput.trim();
    if (trimmed) save({ ...data, apCourses: [...data.apCourses, trimmed] });
    setApInput('');
    setAddingAp(false);
  }

  function removeApCourse(course: string) {
    save({ ...data, apCourses: data.apCourses.filter(c => c !== course) });
  }

  async function getRecommendation() {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/exams/recommend', { method: 'POST', credentials: 'include' });
      const { result } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, exam: result } }));
    } finally {
      setAiLoading(false);
    }
  }

  async function generateSchedule() {
    setScheduleLoading(true);
    try {
      const res = await fetch('/api/ai/exams/schedule', { method: 'POST', credentials: 'include' });
      const { result } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, schedule: result } }));
    } finally {
      setScheduleLoading(false);
    }
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const aiText = data.aiRecommendations?.exam;
  const scheduleText = data.aiRecommendations?.schedule;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Exam Prep</h1>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>SAT or ACT?</h2>
          <button
            onClick={getRecommendation}
            disabled={aiLoading}
            style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
          >
            {aiLoading ? 'Generating…' : 'Get Recommendation'}
          </button>
        </div>
        {aiText ? (
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#ccc', lineHeight: 1.6, marginTop: '0.75rem' }}>{aiText}</pre>
        ) : (
          <div className={styles.satActBox}>
            <p className={styles.satActPrompt}>Click "Get Recommendation" for a personalized SAT vs ACT recommendation.</p>
          </div>
        )}
      </section>

      <div className={styles.cardRow}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>SAT Prep</div>
          <p className={styles.cardBody}>Khan Academy offers free, official SAT prep.</p>
          <a className={styles.cardLink} href="#sat-prep">Register for SAT →</a>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Test Day Reminders</div>
          <p className={styles.cardBody}>Bring photo ID, pencils, and your admission ticket. Arrive 30 minutes early.</p>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AP Exam Tracker</h2>
        <div className={styles.chipRow}>
          {data.apCourses.map((course) => (
            <TagChip key={course} label={course} selected={true} onClick={() => removeApCourse(course)} />
          ))}
          {addingAp ? (
            <span className={styles.apInputWrap}>
              <input autoFocus className={styles.apInput} value={apInput} onChange={(e) => setApInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addApCourse()} placeholder="Course name" />
              <button className={styles.apAddBtn} onClick={addApCourse}>Add</button>
            </span>
          ) : (
            <button className={styles.addChip} onClick={() => setAddingAp(true)}>+ Add</button>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>AP Study Schedule</h2>
          <button
            onClick={generateSchedule}
            disabled={scheduleLoading}
            style={{ background: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
          >
            {scheduleLoading ? 'Generating…' : 'Generate Study Schedule'}
          </button>
        </div>
        {scheduleText ? (
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#ccc', lineHeight: 1.6, marginTop: '0.75rem' }}>{scheduleText}</pre>
        ) : (
          <p style={{ color: '#888', marginTop: '0.5rem' }}>Add AP courses above, then click "Generate Study Schedule" for a week-by-week plan.</p>
        )}
      </section>

      <div className={styles.warningBox}>
        ⚠ AP exam registration typically opens in the fall. Check with your school's AP coordinator early.
      </div>
    </div>
  );
}
