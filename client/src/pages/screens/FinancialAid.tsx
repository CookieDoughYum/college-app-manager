import { useState, useEffect } from 'react';
import ChecklistItem from '../../components/ChecklistItem';
import TagChip from '../../components/TagChip';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './FinancialAid.module.css';

const PROFILE_TAGS = ['First-gen', 'STEM', 'California resident', 'Community service'];

const FAFSA_ITEMS = [
  { key: 'fafsa', label: 'Parents/guardian completed FAFSA', subtext: 'studentaid.gov — opens October 1' },
  { key: 'css', label: 'Parents/guardian completed CSS Profile', subtext: 'cssprofile.collegeboard.org — required by many private colleges' },
];

interface FinancialAidData {
  fafsaChecklist: Record<string, boolean>;
  scholarshipAnswers: Record<string, boolean>;
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: FinancialAidData = { fafsaChecklist: {}, scholarshipAnswers: {}, aiRecommendations: {} };

export default function FinancialAid() {
  const [data, setData] = useState<FinancialAidData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    fetch('/api/student/financialaid', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: FinancialAidData) {
    setData(updated);
    fetch('/api/student/financialaid', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function toggleFafsa(key: string, checked: boolean) {
    save({ ...data, fafsaChecklist: { ...data.fafsaChecklist, [key]: checked } });
  }

  function toggleScholarshipTag(tag: string) {
    const key = tag.toLowerCase().replace(/\s+/g, '_');
    save({ ...data, scholarshipAnswers: { ...data.scholarshipAnswers, [key]: !data.scholarshipAnswers[key] } });
  }

  async function findScholarships() {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/financialaid/scholarships', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, scholarships: result } }));
    } catch {
      setAiError('Could not generate recommendations — please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const aiText = data.aiRecommendations?.scholarships;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Financial Aid</h1>

      <div className={styles.warningBox}>
        ⚠ FAFSA opens October 1. File as early as possible — some aid is first-come, first-served.
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>FAFSA &amp; CSS Checklist</h2>
        {FAFSA_ITEMS.map((item) => (
          <ChecklistItem key={item.key} checked={data.fafsaChecklist[item.key] ?? false} label={item.label} subtext={item.subtext} onChange={(checked) => toggleFafsa(item.key, checked)} />
        ))}
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>Recommended Scholarships</h2>
          <button onClick={findScholarships} disabled={aiLoading} style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
            {aiLoading ? 'Finding…' : 'Find Scholarships'}
          </button>
        </div>
        <p className={styles.profileNote}>Select your profile tags to get matched scholarships:</p>
        <div className={styles.chipRow}>
          {PROFILE_TAGS.map((tag) => {
            const key = tag.toLowerCase().replace(/\s+/g, '_');
            return <TagChip key={tag} label={tag} selected={data.scholarshipAnswers[key] ?? false} onClick={() => toggleScholarshipTag(tag)} />;
          })}
        </div>
        {aiError && <p style={{ color: '#e94560' }}>{aiError}</p>}
        {aiText ? (
          <MarkdownOutput>{aiText}</MarkdownOutput>
        ) : (
          <p style={{ color: '#888', marginTop: '0.75rem' }}>Select your profile tags and click "Find Scholarships" to see AI-matched scholarships.</p>
        )}
      </section>
    </div>
  );
}
