import { useState, useEffect } from 'react';
import BadgeLabel from '../../components/BadgeLabel';
import styles from './Colleges.module.css';

interface CollegeEntry {
  name: string;
  location: string;
  variant: 'reach' | 'target' | 'safety';
}

interface CollegesData {
  majorAnswers: { salaryGoal: string; interestArea: string };
  collegeList: CollegeEntry[];
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: CollegesData = { majorAnswers: { salaryGoal: '', interestArea: '' }, collegeList: [], aiRecommendations: {} };

export default function Colleges() {
  const [data, setData] = useState<CollegesData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    fetch('/api/student/colleges', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: CollegesData) {
    setData(updated);
    fetch('/api/student/colleges', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function updateMajorAnswers(field: 'salaryGoal' | 'interestArea', value: string) {
    setData(prev => ({ ...prev, majorAnswers: { ...prev.majorAnswers, [field]: value } }));
  }

  function saveMajorAnswers() { save(data); }

  async function getMajorRecommendations() {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/colleges/recommend', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, majors: result } }));
    } catch {
      setAiError('Could not generate recommendations — please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const aiText = data.aiRecommendations?.majors;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>College &amp; Major</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Major Questionnaire</h2>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Salary Goal (annual)</label>
            <input className={styles.input} type="text" placeholder="e.g. $80,000" value={data.majorAnswers.salaryGoal} onChange={(e) => updateMajorAnswers('salaryGoal', e.target.value)} onBlur={saveMajorAnswers} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Professional Interest Area</label>
            <input className={styles.input} type="text" placeholder="e.g. Healthcare, Engineering" value={data.majorAnswers.interestArea} onChange={(e) => updateMajorAnswers('interestArea', e.target.value)} onBlur={saveMajorAnswers} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>Recommended Majors</h2>
          <button onClick={getMajorRecommendations} disabled={aiLoading} style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
            {aiLoading ? 'Generating…' : 'Get Major Recommendations'}
          </button>
        </div>
        {aiError && <p style={{ color: '#e94560' }}>{aiError}</p>}
        {aiText ? (
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', color: '#ccc', lineHeight: 1.6, marginTop: '0.75rem' }}>{aiText}</pre>
        ) : (
          <p style={{ color: '#888' }}>Fill in your salary goal and interest area, then click "Get Major Recommendations".</p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>My College List</h2>
          <span className={styles.goalNote}>Aim for 2–3 reach, 3–4 target, 2–3 safety</span>
        </div>
        <div className={styles.collegeList}>
          {data.collegeList.map((college) => (
            <div key={college.name} className={styles.collegeCard}>
              <div className={styles.collegeName}>{college.name}</div>
              <div className={styles.collegeLocation}>{college.location}</div>
              <BadgeLabel variant={college.variant} label={college.variant.charAt(0).toUpperCase() + college.variant.slice(1)} />
            </div>
          ))}
          <div className={`${styles.collegeCard} ${styles.addCard}`}>
            <span className={styles.addLabel}>+ Add a school</span>
          </div>
        </div>
      </section>
    </div>
  );
}
