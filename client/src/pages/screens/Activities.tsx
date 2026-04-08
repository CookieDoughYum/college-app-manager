import { useState, useEffect } from 'react';
import TagChip from '../../components/TagChip';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './Activities.module.css';

const INTEREST_TAGS = ['Science', 'Leadership', 'Arts', 'Community', 'Tech'];

const GRADE_COLUMNS = [
  { label: '9th Grade', key: '9', warn: false },
  { label: '10th Grade', key: '10', warn: false },
  { label: '11th Grade', key: '11', warn: false },
  { label: '12th Grade', key: '12', warn: false },
];

interface ActivitiesData {
  interests: string[];
  coursePlan: Record<string, string[]>;
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: ActivitiesData = { interests: [], coursePlan: {}, aiRecommendations: {} };

const MAX_AP_HONORS = 3;

function getCourseAlerts(courses: string[]): string[] {
  const alerts: string[] = [];
  const apHonors = courses.filter(c => /\bap\b|honors/i.test(c)).length;
  if (apHonors > MAX_AP_HONORS) {
    alerts.push(`${apHonors} AP/Honors courses may be too demanding at once.`);
  }
  return alerts;
}

export default function Activities() {
  const [data, setData] = useState<ActivitiesData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [gpa, setGpa] = useState('');
  const [sat, setSat] = useState('');
  const [act, setAct] = useState('');
  const [newCourse, setNewCourse] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/student/activities', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: ActivitiesData) {
    setData(updated);
    fetch('/api/student/activities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function toggleInterest(tag: string) {
    const interests = data.interests.includes(tag)
      ? data.interests.filter(t => t !== tag)
      : [...data.interests, tag];
    save({ ...data, interests });
  }

  async function getRecommendations() {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/activities/recommend', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, activities: result } }));
    } catch {
      setAiError('Could not generate recommendations — please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  function addCourse(gradeKey: string) {
    const name = (newCourse[gradeKey] ?? '').trim();
    if (!name) return;
    const existing = data.coursePlan[gradeKey] ?? [];
    save({ ...data, coursePlan: { ...data.coursePlan, [gradeKey]: [...existing, name] } });
    setNewCourse(prev => ({ ...prev, [gradeKey]: '' }));
  }

  function removeCourse(gradeKey: string, index: number) {
    const updated = (data.coursePlan[gradeKey] ?? []).filter((_, i) => i !== index);
    save({ ...data, coursePlan: { ...data.coursePlan, [gradeKey]: updated } });
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const aiText = data.aiRecommendations?.activities;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Activities &amp; Courses</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Interests Questionnaire</h2>
        <div className={styles.chipRow}>
          {INTEREST_TAGS.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              selected={data.interests.includes(tag)}
              onClick={() => toggleInterest(tag)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Academic Profile</h2>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>GPA</label>
            <input className={styles.input} type="text" placeholder="e.g. 3.8" value={gpa} onChange={(e) => setGpa(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>SAT Score</label>
            <input className={styles.input} type="text" placeholder="e.g. 1400" value={sat} onChange={(e) => setSat(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>ACT Score</label>
            <input className={styles.input} type="text" placeholder="e.g. 31" value={act} onChange={(e) => setAct(e.target.value)} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>AI Recommendations</h2>
          <button
            onClick={getRecommendations}
            disabled={aiLoading}
            style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
          >
            {aiLoading ? 'Generating…' : 'Get Recommendations'}
          </button>
        </div>
        {aiError && <p style={{ color: '#e94560' }}>{aiError}</p>}
        {aiText ? (
          <MarkdownOutput>{aiText}</MarkdownOutput>
        ) : (
          <div className={styles.placeholder}>
            Select your interests above and click "Get Recommendations" to see personalized suggestions.
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4-Year Course Plan</h2>
        <div className={styles.planGrid}>
          {GRADE_COLUMNS.map(({ label, key, warn }) => (
            <div key={label} className={warn ? `${styles.planCol} ${styles.planColWarn}` : styles.planCol}>
              <div className={styles.planColHeader}>{label}</div>
              <div className={styles.planColBody}>
                {(data.coursePlan[key] ?? []).length === 0 ? (
                  <p className={styles.planPlaceholder}>No courses added yet.</p>
                ) : (
                  (data.coursePlan[key] ?? []).map((course, i) => (
                    <div key={i} className={styles.planCourseRow}>
                      <span className={styles.planCourse}>{course}</span>
                      <button className={styles.planRemoveBtn} onClick={() => removeCourse(key, i)} title="Remove">×</button>
                    </div>
                  ))
                )}
                {getCourseAlerts(data.coursePlan[key] ?? []).map((msg, i) => (
                  <div key={i} className={styles.planAlert}>⚠ {msg}</div>
                ))}
                <div className={styles.planAddRow}>
                  <input
                    className={styles.planAddInput}
                    placeholder="Add course…"
                    value={newCourse[key] ?? ''}
                    onChange={e => setNewCourse(prev => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addCourse(key)}
                  />
                  <button className={styles.planAddBtn} onClick={() => addCourse(key)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
