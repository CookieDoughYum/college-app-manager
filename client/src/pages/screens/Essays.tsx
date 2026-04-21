import { useState, useEffect } from 'react';
import TagChip from '../../components/TagChip';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './Essays.module.css';

const TIMELINE = [
  {
    period: 'Late May – June',
    color: 'red' as const,
    description: 'Brainstorm personal statement topics. Read examples. Begin freewriting.',
  },
  {
    period: 'July',
    color: 'amber' as const,
    description: 'Draft and revise personal statement. Start UC PIQs and school-specific supplements.',
  },
  {
    period: 'August',
    color: 'green' as const,
    description: 'Finalize personal statement. Complete all supplements. Get peer and adult feedback.',
  },
];

const DRIVE_FOLDERS = ['UC PIQs', 'Personal Statement', 'Supplementals', 'Honors Essays', 'Scholarships', 'Activities List'];

interface EssaysData {
  driveLink: string | null;
}

const DEFAULT_DATA: EssaysData = { driveLink: null };

export default function Essays() {
  const [data, setData] = useState<EssaysData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  // Brainstormer state
  const [bsPrompt, setBsPrompt] = useState('');
  const [bsResult, setBsResult] = useState('');
  const [bsLoading, setBsLoading] = useState(false);
  const [bsError, setBsError] = useState('');

  // Feedback state
  const [fbEssayText, setFbEssayText] = useState('');
  const [fbPrompt, setFbPrompt] = useState('');
  const [fbResult, setFbResult] = useState('');
  const [fbLoading, setFbLoading] = useState(false);
  const [fbError, setFbError] = useState('');

  useEffect(() => {
    fetch('/api/student/essays', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        setData({ driveLink: d?.driveLink ?? null });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function runBrainstorm() {
    setBsLoading(true);
    setBsError('');
    setBsResult('');
    try {
      const res = await fetch('/api/ai/essays/brainstorm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ theme: bsPrompt }),
      });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setBsResult(result);
    } catch {
      setBsError('Could not generate ideas — please try again.');
    } finally {
      setBsLoading(false);
    }
  }

  async function runFeedback() {
    if (!fbEssayText.trim()) return;
    setFbLoading(true);
    setFbError('');
    setFbResult('');
    try {
      const res = await fetch('/api/ai/essays/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ essayText: fbEssayText, prompt: fbPrompt }),
      });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setFbResult(result);
    } catch {
      setFbError('Could not generate feedback — please try again.');
    } finally {
      setFbLoading(false);
    }
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Essays</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Essay Timeline</h2>
        <div className={styles.timeline}>
          {TIMELINE.map((item) => (
            <div key={item.period} className={`${styles.timelineCard} ${styles[item.color]}`}>
              <div className={styles.timelinePeriod}>{item.period}</div>
              <p className={styles.timelineDesc}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Google Drive Setup</h2>
        <p className={styles.driveNote}>Create these folders in your Drive for organized essay writing:</p>
        <div className={styles.chipRow}>
          {DRIVE_FOLDERS.map((folder) => (
            <TagChip key={folder} label={folder} selected={true} onClick={() => {}} />
          ))}
        </div>
      </section>

      {/* AI Brainstormer */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Essay Brainstormer</h2>
        <p className={styles.aiNote}>Get personalized topic ideas based on your interests and activities.</p>
        <div className={styles.aiRow}>
          <div className={styles.aiField}>
            <label className={styles.aiLabel}>What do you want to write about? (optional)</label>
            <input
              className={styles.aiInput}
              type="text"
              placeholder="e.g. overcoming a challenge, my passion for robotics, a defining moment…"
              value={bsPrompt}
              onChange={(e) => setBsPrompt(e.target.value)}
            />
          </div>
          <button
            className={styles.aiButton}
            onClick={runBrainstorm}
            disabled={bsLoading}
          >
            {bsLoading ? 'Generating…' : 'Generate Ideas'}
          </button>
        </div>
        {bsError && <p className={styles.aiError}>{bsError}</p>}
        {bsResult && <div className={styles.aiOutput}><MarkdownOutput>{bsResult}</MarkdownOutput></div>}
      </section>

      {/* AI Feedback Tool */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Essay Feedback</h2>
        <p className={styles.aiNote}>Paste your draft to get structured feedback on strengths, areas to improve, and line-level edits.</p>
        <div className={styles.fbRow}>
          <div className={styles.aiField}>
            <label className={styles.aiLabel}>Essay prompt or title (optional)</label>
            <input
              className={styles.aiInput}
              type="text"
              placeholder="e.g. Describe a challenge you've faced and how you overcame it"
              value={fbPrompt}
              onChange={(e) => setFbPrompt(e.target.value)}
            />
          </div>
          <div className={styles.aiField}>
            <label className={styles.aiLabel}>Paste your essay draft</label>
            <textarea
              className={styles.aiTextarea}
              placeholder="Paste your essay here…"
              value={fbEssayText}
              onChange={(e) => setFbEssayText(e.target.value)}
            />
          </div>
          <button
            className={styles.aiButton}
            onClick={runFeedback}
            disabled={fbLoading || !fbEssayText.trim()}
          >
            {fbLoading ? 'Analyzing…' : 'Get Feedback'}
          </button>
        </div>
        {fbError && <p className={styles.aiError}>{fbError}</p>}
        {fbResult && <div className={styles.aiOutput}><MarkdownOutput>{fbResult}</MarkdownOutput></div>}
      </section>
    </div>
  );
}
