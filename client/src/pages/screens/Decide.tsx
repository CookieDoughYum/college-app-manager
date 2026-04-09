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

const RESULTS: AdmissionResult['result'][] = ['', 'Accepted', 'Waitlisted', 'Not admitted'];

export default function Decide() {
  const [data, setData] = useState<DecideData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [honorsResults, setHonorsResults] = useState<Record<string, string>>({});
  const [honorsLoading, setHonorsLoading] = useState<Record<string, boolean>>({});
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<AdmissionResult | null>(null);
  const [adding, setAdding] = useState(false);
  const [newEntry, setNewEntry] = useState<AdmissionResult>({ school: '', result: '' });

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
    if (!newEntry.school.trim()) return;
    save({ ...data, decisions: [...data.decisions, { ...newEntry }] });
    setAdding(false);
    setNewEntry({ school: '', result: '' });
  }

  function startEdit(i: number) {
    setEditIndex(i);
    setDraft({ ...data.decisions[i] });
    setAdding(false);
  }

  function saveEdit() {
    if (!draft || editIndex === null) return;
    save({ ...data, decisions: data.decisions.map((d, i) => i === editIndex ? draft : d) });
    setEditIndex(null);
    setDraft(null);
  }

  async function fetchHonors(school: string) {
    if (honorsResults[school] || honorsLoading[school]) return;
    setHonorsLoading(prev => ({ ...prev, [school]: true }));
    try {
      const res = await fetch('/api/ai/decide/honors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ school }),
      });
      const { result } = await res.json();
      setHonorsResults(prev => ({ ...prev, [school]: result }));
    } catch {
      setHonorsResults(prev => ({ ...prev, [school]: 'Could not load honors information.' }));
    } finally {
      setHonorsLoading(prev => ({ ...prev, [school]: false }));
    }
  }

  function deleteResult(i: number) {
    save({ ...data, decisions: data.decisions.filter((_, idx) => idx !== i) });
    if (editIndex === i) { setEditIndex(null); setDraft(null); }
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
          {!adding && (
            <button className={styles.addBtn} onClick={() => { setAdding(true); setEditIndex(null); setDraft(null); }}>+ Add Result</button>
          )}
        </div>

        {adding && (
          <div className={styles.inlineForm}>
            <input
              className={styles.formInput}
              placeholder="School name *"
              value={newEntry.school}
              onChange={e => setNewEntry({ ...newEntry, school: e.target.value })}
              autoFocus
            />
            <select
              className={styles.formSelect}
              value={newEntry.result}
              onChange={e => setNewEntry({ ...newEntry, result: e.target.value as AdmissionResult['result'] })}
            >
              <option value="">Pending</option>
              {RESULTS.filter(r => r).map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className={styles.formActions}>
              <button className={styles.saveBtn} onClick={addResult}>Add</button>
              <button className={styles.cancelBtn} onClick={() => { setAdding(false); setNewEntry({ school: '', result: '' }); }}>Cancel</button>
            </div>
          </div>
        )}

        <div className={styles.resultList}>
          {data.decisions.length === 0 && !adding ? (
            <p style={{ color: '#888' }}>No results added yet.</p>
          ) : (
            data.decisions.map((r, i) =>
              editIndex === i && draft ? (
                <div key={i} className={styles.inlineForm}>
                  <input
                    className={styles.formInput}
                    placeholder="School name *"
                    value={draft.school}
                    onChange={e => setDraft({ ...draft, school: e.target.value })}
                    autoFocus
                  />
                  <select
                    className={styles.formSelect}
                    value={draft.result}
                    onChange={e => setDraft({ ...draft, result: e.target.value as AdmissionResult['result'] })}
                  >
                    <option value="">Pending</option>
                    {RESULTS.filter(r => r).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  <div className={styles.formActions}>
                    <button className={styles.saveBtn} onClick={saveEdit}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => { setEditIndex(null); setDraft(null); }}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={() => deleteResult(i)}>Delete</button>
                  </div>
                </div>
              ) : (
                <div key={i} className={`${styles.resultCard} ${r.result ? STATUS_STYLE[r.result] : styles.pending}`}>
                  <div className={styles.schoolName}>{r.school}</div>
                  <div className={styles.cardRight}>
                    <div className={styles.statusText}>
                      {r.result === 'Accepted' ? '✅' : r.result === 'Not admitted' ? '❌' : r.result === 'Waitlisted' ? '⏳' : '—'} {r.result || 'Pending'}
                    </div>
                    <button className={styles.editBtn} onClick={() => startEdit(i)}>Edit</button>
                    <button className={styles.deleteIconBtn} onClick={() => deleteResult(i)} title="Delete">×</button>
                  </div>
                </div>
              )
            )
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
            <p className={styles.helperNote}>Add your accepted schools above, then click "Generate Comparison" for a personalized pros/cons analysis.</p>
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Honors Programs</h2>
        <p className={styles.honorsNote}>Honors programs offer smaller classes, research access, and special advising. Click a school to load its honors info.</p>
        {data.decisions.filter(d => d.result === 'Accepted').length === 0 ? (
          <div className={styles.honorsItem}>Add accepted schools above to see honors program information.</div>
        ) : (
          <div className={styles.honorsList}>
            {data.decisions.filter(d => d.result === 'Accepted').map(d => (
              <div key={d.school} className={styles.honorsCard}>
                <div className={styles.honorsCardHeader}>
                  <span className={styles.honorsSchoolName}>{d.school}</span>
                  {!honorsResults[d.school] && (
                    <button
                      className={styles.honorsBtn}
                      onClick={() => fetchHonors(d.school)}
                      disabled={honorsLoading[d.school]}
                    >
                      {honorsLoading[d.school] ? 'Loading…' : 'Load Honors Info'}
                    </button>
                  )}
                </div>
                {honorsResults[d.school] && (
                  <MarkdownOutput>{honorsResults[d.school]}</MarkdownOutput>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
