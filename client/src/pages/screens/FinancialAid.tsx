import { useState, useEffect } from 'react';
import ChecklistItem from '../../components/ChecklistItem';
import TagChip from '../../components/TagChip';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './FinancialAid.module.css';

const PROFILE_TAGS = ['First-gen', 'STEM', 'California resident', 'Community service'];

const FAFSA_ITEMS = [
  {
    key: 'fafsa',
    label: 'Parents/guardian completed FAFSA',
    subtext: 'Opens October 1 — file as early as possible',
    linkLabel: 'studentaid.gov',
    linkUrl: 'https://studentaid.gov/h/apply-for-aid/fafsa',
  },
  {
    key: 'css',
    label: 'Parents/guardian completed CSS Profile',
    subtext: 'Required by most private colleges for institutional aid',
    linkLabel: 'cssprofile.collegeboard.org',
    linkUrl: 'https://cssprofile.collegeboard.org',
  },
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
          <div key={item.key} className={styles.fafsaRow}>
            <ChecklistItem
              checked={data.fafsaChecklist[item.key] ?? false}
              label={item.label}
              subtext={item.subtext}
              onChange={(checked) => toggleFafsa(item.key, checked)}
            />
            <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className={styles.fafsaLink}>
              {item.linkLabel} ↗
            </a>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Understanding Student Loans</h2>

        <div className={styles.loanGrid}>
          <div className={styles.loanCard}>
            <div className={styles.loanCardTitle}>Should you take loans?</div>
            <p className={styles.loanCardText}>
              Only borrow what you need. Prefer <strong>federal loans</strong> over private — they have fixed rates, flexible repayment, and forgiveness options. Take <strong>subsidized loans first</strong> (government pays interest while you're in school), then unsubsidized. Avoid private loans unless federal limits are exhausted.
            </p>
          </div>

          <div className={styles.loanCard}>
            <div className={styles.loanCardTitle}>How much to borrow</div>
            <p className={styles.loanCardText}>
              Rule of thumb: <strong>total debt ≤ first year's expected salary.</strong> If you expect to earn $50k/year, borrow no more than $50k total. Federal annual limits: $5,500 (freshman) → $6,500 (sophomore) → $7,500 (junior/senior). Graduate students up to $20,500/year.
            </p>
          </div>

          <div className={styles.loanCard}>
            <div className={styles.loanCardTitle}>Repayment schedule</div>
            <p className={styles.loanCardText}>
              <strong>Standard plan:</strong> 10 years, ~$100/month per $10,000 borrowed. Income-driven plans (IBR, SAVE) cap payments at 5–10% of discretionary income. Repayment begins 6 months after graduation or dropping below half-time enrollment.
            </p>
          </div>

          <div className={styles.loanCard}>
            <div className={styles.loanCardTitle}>Forgiveness programs</div>
            <p className={styles.loanCardText}>
              <strong>Public Service Loan Forgiveness (PSLF):</strong> forgives remaining balance after 10 years of payments if you work for a government or nonprofit. <strong>Teacher Loan Forgiveness:</strong> up to $17,500 after 5 years in a low-income school. Income-driven plans forgive after 20–25 years.
            </p>
          </div>
        </div>

        <div className={styles.loanLinks}>
          <a href="https://studentaid.gov/understand-aid/types/loans" target="_blank" rel="noopener noreferrer" className={styles.loanLink}>
            Federal loan types ↗
          </a>
          <a href="https://studentaid.gov/aid-estimator/" target="_blank" rel="noopener noreferrer" className={styles.loanLink}>
            Aid estimator ↗
          </a>
          <a href="https://studentaid.gov/repay-loans/understand/plans" target="_blank" rel="noopener noreferrer" className={styles.loanLink}>
            Repayment plans ↗
          </a>
          <a href="https://studentaid.gov/manage-loans/forgiveness-cancellation/public-service" target="_blank" rel="noopener noreferrer" className={styles.loanLink}>
            PSLF ↗
          </a>
        </div>
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
