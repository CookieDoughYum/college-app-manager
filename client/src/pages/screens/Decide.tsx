import { useState, useEffect } from 'react';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './Decide.module.css';

interface AdmissionResult {
  school: string;
  result: 'Accepted' | 'Not admitted' | 'Waitlisted' | '';
}

interface DecideData {
  decisions: AdmissionResult[];
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: DecideData = { decisions: [], aiRecommendations: {} };

const STATUS_STYLE: Record<string, string> = {
  Accepted: styles.accepted,
  'Not admitted': styles.notAdmitted,
  Waitlisted: styles.waitlisted,
};

export default function Decide() {
  const [data, setData] = useState<DecideData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    fetch('/api/student/decide', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: DecideData) {
    setData(updated);
    fetch('/api/student/decide', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function addResult() {
    save({ ...data, decisions: [...data.decisions, { school: 'School Name', result: '' }] });
  }

  async function getComparison() {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/decide/compare', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, comparison: result } }));
    } catch {
      setAiError('Could not generate recommendations — please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const aiText = data.aiRecommendations?.comparison;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Decide</h1>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>Acceptances</h2>
          <button className={styles.addBtn} onClick={addResult}>+ Add Result</button>
        </div>
        <div className={styles.resultList}>
          {data.decisions.length === 0 ? (
            <p style={{ color: '#888' }}>No results added yet.</p>
          ) : (
            data.decisions.map((r, i) => (
              <div key={i} className={`${styles.resultCard} ${r.result ? STATUS_STYLE[r.result] : ''}`}>
                <div className={styles.schoolName}>{r.school}</div>
                <div className={styles.statusText}>
                  {r.result === 'Accepted' ? '✅' : r.result === 'Not admitted' ? '❌' : r.result === 'Waitlisted' ? '⏳' : '—'} {r.result || 'Pending'}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>AI Decision Helper</h2>
          <button onClick={getComparison} disabled={aiLoading} style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
            {aiLoading ? 'Generating…' : 'Generate Comparison'}
          </button>
        </div>
        {aiError && <p style={{ color: '#e94560' }}>{aiError}</p>}
        {aiText ? (
          <MarkdownOutput>{aiText}</MarkdownOutput>
        ) : (
          <div className={styles.helperBox}>
            <p className={styles.helperNote}>Add at least 2 accepted schools above, then click "Generate Comparison" for a personalized pros/cons analysis.</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Honors Programs</h2>
        <p className={styles.honorsNote}>Check these honors programs at your accepted schools — they offer smaller classes and special advising.</p>
        <div className={styles.honorsList}>
          <div className={styles.honorsItem}>Add accepted schools above to see honors program information.</div>
        </div>
      </section>
    </div>
  );
}
