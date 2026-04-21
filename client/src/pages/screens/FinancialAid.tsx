import { useState, useEffect } from 'react';
import ChecklistItem from '../../components/ChecklistItem';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './FinancialAid.module.css';

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

const GPA_OPTIONS = ['4.0+', '3.5–3.99', '3.0–3.49', '2.5–2.99', 'Below 2.5'];
const FIELD_OPTIONS = ['STEM', 'Arts / Humanities', 'Business', 'Health / Medicine', 'Social Sciences', 'Education', 'Trade / Technical', 'Undecided'];
const ACTIVITY_OPTIONS = ['Community service', 'Sports / Athletics', 'Student government', 'Arts / Music / Theater', 'Debate / Speech', 'STEM club / Robotics', 'Religious / Faith', 'Part-time work'];

interface QuizAnswers {
  firstGen?: string;
  major?: string;
  state?: string;
  gpa?: string;
  field?: string;
  financialNeed?: string;
  activities?: string[];
  background?: string;
}

interface FinancialAidData {
  fafsaChecklist: Record<string, boolean>;
  scholarshipAnswers: QuizAnswers;
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: FinancialAidData = {
  fafsaChecklist: {},
  scholarshipAnswers: {},
  aiRecommendations: {},
};

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

  function setQuiz(patch: Partial<QuizAnswers>) {
    const updated = { ...data, scholarshipAnswers: { ...data.scholarshipAnswers, ...patch } };
    save(updated);
  }

  function toggleActivity(activity: string) {
    const current = data.scholarshipAnswers?.activities ?? [];
    const next = current.includes(activity)
      ? current.filter(a => a !== activity)
      : [...current, activity];
    setQuiz({ activities: next });
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

  const quiz = data.scholarshipAnswers ?? {};
  const aiText = data.aiRecommendations?.scholarships;
  const activities = quiz.activities ?? [];

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

      {/* Scholarship Quiz */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Scholarship Matcher</h2>
        <p className={styles.quizIntro}>Answer a few questions so we can match you with scholarships that fit your profile.</p>

        <div className={styles.quizGrid}>
          {/* First-gen */}
          <div className={styles.quizQuestion}>
            <div className={styles.quizLabel}>Are you a first-generation college student?</div>
            <div className={styles.quizOptions}>
              {['Yes', 'No'].map(opt => (
                <button
                  key={opt}
                  className={`${styles.quizOption} ${quiz.firstGen === opt.toLowerCase() ? styles.quizOptionSelected : ''}`}
                  onClick={() => setQuiz({ firstGen: opt.toLowerCase() })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Financial need */}
          <div className={styles.quizQuestion}>
            <div className={styles.quizLabel}>Do you have demonstrated financial need?</div>
            <div className={styles.quizOptions}>
              {['Yes', 'No', 'Not sure'].map(opt => (
                <button
                  key={opt}
                  className={`${styles.quizOption} ${quiz.financialNeed === opt.toLowerCase() ? styles.quizOptionSelected : ''}`}
                  onClick={() => setQuiz({ financialNeed: opt.toLowerCase() })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* GPA */}
          <div className={styles.quizQuestion}>
            <div className={styles.quizLabel}>GPA range</div>
            <div className={styles.quizOptions}>
              {GPA_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`${styles.quizOption} ${quiz.gpa === opt ? styles.quizOptionSelected : ''}`}
                  onClick={() => setQuiz({ gpa: opt })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Field of interest */}
          <div className={styles.quizQuestion}>
            <div className={styles.quizLabel}>Intended field of study</div>
            <div className={styles.quizOptions}>
              {FIELD_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`${styles.quizOption} ${quiz.field === opt ? styles.quizOptionSelected : ''}`}
                  onClick={() => setQuiz({ field: opt })}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Major (text) */}
          <div className={`${styles.quizQuestion} ${styles.quizQuestionWide}`}>
            <div className={styles.quizLabel}>Specific major or career goal (optional)</div>
            <input
              className={styles.quizInput}
              type="text"
              placeholder="e.g. Nursing, Computer Engineering, Undecided"
              value={quiz.major ?? ''}
              onChange={(e) => setQuiz({ major: e.target.value })}
              onBlur={() => setQuiz({ major: quiz.major })}
            />
          </div>

          {/* State */}
          <div className={`${styles.quizQuestion} ${styles.quizQuestionWide}`}>
            <div className={styles.quizLabel}>State of residence</div>
            <input
              className={styles.quizInput}
              type="text"
              placeholder="e.g. California"
              value={quiz.state ?? ''}
              onChange={(e) => setQuiz({ state: e.target.value })}
              onBlur={() => setQuiz({ state: quiz.state })}
            />
          </div>

          {/* Activities */}
          <div className={`${styles.quizQuestion} ${styles.quizQuestionWide}`}>
            <div className={styles.quizLabel}>Key activities (select all that apply)</div>
            <div className={styles.quizOptions}>
              {ACTIVITY_OPTIONS.map(opt => (
                <button
                  key={opt}
                  className={`${styles.quizOption} ${activities.includes(opt) ? styles.quizOptionSelected : ''}`}
                  onClick={() => toggleActivity(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div className={`${styles.quizQuestion} ${styles.quizQuestionWide}`}>
            <div className={styles.quizLabel}>Any special background or identity? (optional)</div>
            <input
              className={styles.quizInput}
              type="text"
              placeholder="e.g. military family, disability, LGBTQ+, immigrant, religious affiliation"
              value={quiz.background ?? ''}
              onChange={(e) => setQuiz({ background: e.target.value })}
              onBlur={() => setQuiz({ background: quiz.background })}
            />
          </div>
        </div>

        <div className={styles.quizActions}>
          <button className={styles.findButton} onClick={findScholarships} disabled={aiLoading}>
            {aiLoading ? 'Finding…' : 'Find Matching Scholarships'}
          </button>
        </div>

        {aiError && <p className={styles.aiError}>{aiError}</p>}
        {aiText ? (
          <div className={styles.aiOutput}><MarkdownOutput>{aiText}</MarkdownOutput></div>
        ) : (
          <p className={styles.aiPlaceholder}>Complete the quiz above and click "Find Matching Scholarships" to see AI-matched results.</p>
        )}
      </section>
    </div>
  );
}
