import { useState } from 'react';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './AppActivities.module.css';

const COMMON_APP_TIPS = [
  {
    title: 'Up to 10 Activities',
    body: 'You can list up to 10 extracurricular activities. Prioritize your most meaningful ones — quality over quantity.',
  },
  {
    title: 'Description: 150 Characters',
    body: 'Each description is capped at 150 characters (~25 words). Lead with your biggest impact and use strong, active verbs.',
  },
  {
    title: 'Role & Organization Fields',
    body: 'Position/leadership title (50 chars) and organization name (100 chars) are separate fields. "Captain" beats "Member."',
  },
  {
    title: 'Hours & Weeks',
    body: 'Report average hours per week and weeks per year honestly. Colleges use these to gauge your level of commitment.',
  },
  {
    title: 'Order Strategically',
    body: 'List activities in order of personal importance — not by prestige or hours. Admissions readers notice what you put first.',
  },
  {
    title: 'Include Uncommon Activities',
    body: 'Paid jobs, family responsibilities, and caregiving count! If you worked to support your family, list it — it tells a powerful story.',
  },
];

const UC_TIPS = [
  {
    title: 'Up to 20 Activities',
    body: 'The UC application allows up to 20 activities across 7 categories: Educational Prep, Work, Volunteering, Sports, Awards, Extracurriculars, and Other.',
  },
  {
    title: 'Description: 350 Characters',
    body: 'Each UC description allows 350 characters (~55 words). Use this extra room to explain your impact, not just what you did.',
  },
  {
    title: '7 Categories Available',
    body: 'Distributing entries across multiple categories shows breadth. Educational Preparation programs (AVID, TRIO) are a unique UC-only category.',
  },
  {
    title: 'Awards & Honors Section',
    body: 'UC has a dedicated Awards section. List academic honors, competitions, and recognition there — separate from your activities.',
  },
  {
    title: 'Quantify Your Impact',
    body: '"Led 12-person team, raised $3,200 over 8 months" is far stronger than "Raised money for charity." Numbers make descriptions memorable.',
  },
  {
    title: 'Educational Prep Programs',
    body: 'If you participated in AVID, MESA, Upward Bound, TRIO, or similar, list them! UC specifically values first-gen and low-income student programs.',
  },
];

const CA_EXAMPLE = 'Led after-school algebra tutoring for 30+ students 2x/week; improved class pass rate by 22% across two semesters.';
const UC_EXAMPLE = 'Served as president of school\'s Environmental Club for 2 years. Organized monthly cleanups, launched campus recycling initiative reducing waste by 40%, and mentored 15 new members on sustainability advocacy.';

export default function AppActivities() {
  const [caText, setCaText] = useState('');
  const [caResult, setCaResult] = useState('');
  const [caLoading, setCaLoading] = useState(false);
  const [caError, setCaError] = useState('');

  const [ucText, setUcText] = useState('');
  const [ucResult, setUcResult] = useState('');
  const [ucLoading, setUcLoading] = useState(false);
  const [ucError, setUcError] = useState('');

  async function runCaFeedback() {
    if (!caText.trim()) return;
    setCaLoading(true);
    setCaError('');
    setCaResult('');
    try {
      const res = await fetch('/api/ai/activities/actdescfeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ activityText: caText, appType: 'commonapp' }),
      });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setCaResult(result);
    } catch {
      setCaError('Could not generate feedback — please try again.');
    } finally {
      setCaLoading(false);
    }
  }

  async function runUcFeedback() {
    if (!ucText.trim()) return;
    setUcLoading(true);
    setUcError('');
    setUcResult('');
    try {
      const res = await fetch('/api/ai/activities/actdescfeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ activityText: ucText, appType: 'uc' }),
      });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setUcResult(result);
    } catch {
      setUcError('Could not generate feedback — please try again.');
    } finally {
      setUcLoading(false);
    }
  }

  const caChars = caText.length;
  const ucChars = ucText.length;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Writing Activities</h1>

      {/* Platform comparison */}
      <div className={styles.compareRow}>
        <div className={styles.compareCard}>
          <div className={styles.compareBadgeOrange}>Common App</div>
          <ul className={styles.compareList}>
            <li><strong>10</strong> activities max</li>
            <li><strong>150 chars</strong> per description</li>
            <li><strong>~25 words</strong> — be ultra-concise</li>
            <li>Separate role + org fields</li>
            <li>Hours/week + weeks/year</li>
          </ul>
        </div>
        <div className={styles.compareDivider}>vs</div>
        <div className={styles.compareCard}>
          <div className={styles.compareBadgePurple}>UC Application</div>
          <ul className={styles.compareList}>
            <li><strong>20</strong> activities max</li>
            <li><strong>350 chars</strong> per description</li>
            <li><strong>~55 words</strong> — explain impact</li>
            <li>7 activity categories</li>
            <li>Separate Awards section</li>
          </ul>
        </div>
      </div>

      {/* Common App tips */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderOrange}>
          <h2 className={styles.sectionTitleOrange}>Common App Activities Tips</h2>
          <span className={styles.badgeOrange}>150 chars per description</span>
        </div>
        <div className={styles.tipsGrid}>
          {COMMON_APP_TIPS.map(tip => (
            <div key={tip.title} className={`${styles.tipCard} ${styles.tipCardOrange}`}>
              <div className={styles.tipTitle}>{tip.title}</div>
              <div className={styles.tipBody}>{tip.body}</div>
            </div>
          ))}
        </div>
        <div className={styles.exampleBox}>
          <span className={styles.exampleLabel}>Strong 150-char example:</span>
          <span className={styles.exampleText}>{CA_EXAMPLE}</span>
          <span className={styles.exampleCount}>{CA_EXAMPLE.length} chars</span>
        </div>
      </section>

      {/* UC tips */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderPurple}>
          <h2 className={styles.sectionTitlePurple}>UC Application Activities Tips</h2>
          <span className={styles.badgePurple}>350 chars per description</span>
        </div>
        <div className={styles.tipsGrid}>
          {UC_TIPS.map(tip => (
            <div key={tip.title} className={`${styles.tipCard} ${styles.tipCardPurple}`}>
              <div className={styles.tipTitle}>{tip.title}</div>
              <div className={styles.tipBody}>{tip.body}</div>
            </div>
          ))}
        </div>
        <div className={`${styles.exampleBox} ${styles.exampleBoxPurple}`}>
          <span className={styles.exampleLabel}>Strong 350-char example:</span>
          <span className={styles.exampleText}>{UC_EXAMPLE}</span>
          <span className={`${styles.exampleCount} ${styles.exampleCountPurple}`}>{UC_EXAMPLE.length} chars</span>
        </div>
      </section>

      {/* Common App feedback */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderOrange}>
          <h2 className={styles.sectionTitleOrange}>Common App Activity Feedback</h2>
          <span className={styles.badgeOrange}>AI-powered</span>
        </div>
        <p className={styles.aiNote}>
          Paste your activity description to get feedback on impact, clarity, and a condensed rewrite that fits the 150-character limit.
        </p>
        <div className={styles.fbRow}>
          <label className={styles.aiLabel}>Your activity description</label>
          <textarea
            className={styles.aiTextarea}
            placeholder="e.g. Tutored students in algebra twice a week after school for two years, helping over 30 students pass their midterms and improve confidence in math..."
            value={caText}
            onChange={e => { setCaText(e.target.value); setCaResult(''); }}
          />
          <div className={styles.charRow}>
            <span className={caChars > 150 ? styles.charOver : caChars > 120 ? styles.charWarn : styles.charOk}>
              {caChars} / 150 chars
              {caChars > 150 && ` — ${caChars - 150} over limit`}
              {caChars <= 150 && caChars > 0 && ` — ${150 - caChars} remaining`}
            </span>
            <button
              className={styles.orangeBtn}
              onClick={runCaFeedback}
              disabled={caLoading || !caText.trim()}
            >
              {caLoading ? 'Analyzing…' : 'Get Common App Feedback'}
            </button>
          </div>
        </div>
        {caError && <p className={styles.aiError}>{caError}</p>}
        {caResult && (
          <div className={styles.aiOutputOrange}>
            <MarkdownOutput>{caResult}</MarkdownOutput>
          </div>
        )}
      </section>

      {/* UC feedback */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderPurple}>
          <h2 className={styles.sectionTitlePurple}>UC Activity Feedback</h2>
          <span className={styles.badgePurple}>AI-powered</span>
        </div>
        <p className={styles.aiNote}>
          Paste your UC activity description to get feedback on impact, specificity, and a condensed rewrite that fits the 350-character limit.
        </p>
        <div className={styles.fbRow}>
          <label className={styles.aiLabel}>Your UC activity description</label>
          <textarea
            className={styles.aiTextareaPurple}
            placeholder="e.g. Served as president of school's environmental club for two years, organizing monthly cleanups and launching a campus recycling initiative that reduced waste by 40%..."
            value={ucText}
            onChange={e => { setUcText(e.target.value); setUcResult(''); }}
          />
          <div className={styles.charRow}>
            <span className={ucChars > 350 ? styles.charOver : ucChars > 310 ? styles.charWarn : styles.charOk}>
              {ucChars} / 350 chars
              {ucChars > 350 && ` — ${ucChars - 350} over limit`}
              {ucChars <= 350 && ucChars > 0 && ` — ${350 - ucChars} remaining`}
            </span>
            <button
              className={styles.purpleBtn}
              onClick={runUcFeedback}
              disabled={ucLoading || !ucText.trim()}
            >
              {ucLoading ? 'Analyzing…' : 'Get UC Feedback'}
            </button>
          </div>
        </div>
        {ucError && <p className={styles.aiError}>{ucError}</p>}
        {ucResult && (
          <div className={styles.aiOutputPurple}>
            <MarkdownOutput>{ucResult}</MarkdownOutput>
          </div>
        )}
      </section>
    </div>
  );
}
