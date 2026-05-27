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

// UC PIQ prompts
const UC_PIQ_PROMPTS = [
  { num: 1, text: 'Describe an example of your leadership experience in which you have positively influenced others, helped resolve disputes, or contributed to group efforts over time.' },
  { num: 2, text: 'Every person has a creative side, and it can be expressed in many ways: problem solving, original and innovative thinking, and creating. Describe how you express your creative side.' },
  { num: 3, text: 'What would you say is your greatest talent or skill? How have you developed and demonstrated that talent over time?' },
  { num: 4, text: 'Describe how you have taken advantage of a significant educational opportunity or worked to overcome an educational barrier you have faced.' },
  { num: 5, text: 'Describe the most significant challenge you have faced and the steps you have taken to overcome this challenge. How has this challenge affected your academic achievement?' },
  { num: 6, text: 'Think about an academic subject that inspires you. Describe how you have furthered this interest inside and/or outside of the classroom.' },
  { num: 7, text: 'What have you done to make your school or your community a better place?' },
  { num: 8, text: 'Beyond what has already been shared in your application, what do you believe makes you stand out as a strong candidate for admissions to the University of California?' },
];

// Common App personal statement prompts
const COMMON_APP_PROMPTS = [
  { num: 1, text: 'Some students have a background, identity, interest, or talent that is so meaningful they believe their application would be incomplete without it. If this sounds like you, then please share your story.' },
  { num: 2, text: 'The lessons we take from obstacles we encounter can be fundamental to our success and happiness. Recount a time when you faced a challenge, setback, or failure. How did it affect you, and what did you learn from the experience?' },
  { num: 3, text: 'Reflect on a time when you questioned or challenged a belief or idea. What prompted your thinking? What was the outcome?' },
  { num: 4, text: 'Reflect on something that someone has done for you that has made you happy or thankful in a surprising way. How has this gratitude affected or motivated you?' },
  { num: 5, text: 'Discuss an accomplishment, event, or realization that sparked a period of personal growth and a new understanding of yourself or others.' },
  { num: 6, text: 'Describe a topic, idea, or concept you find so engaging that it makes you lose all track of time. Why does it captivate you? What or who do you turn to when you want to learn more?' },
  { num: 7, text: 'Share an essay on any topic of your choice. It can be one you\'ve already written, one that responds to a different prompt, or one of your own design.' },
];

// Profile quiz questions for essay brainstormer
const PROFILE_QUESTIONS = [
  { key: 'challenge', label: 'What is a defining challenge or obstacle you have faced and overcome?' },
  { key: 'passion', label: 'What activity, cause, or passion takes up most of your free time?' },
  { key: 'quality', label: 'Describe a personal quality or value that defines who you are.' },
  { key: 'goal', label: 'What do you want to study in college and why?' },
  { key: 'unique', label: 'Is there anything unique about your background or story you want colleges to know?' },
];

function detectPromptType(school: string): 'uc' | 'commonapp' | null {
  const lower = school.toLowerCase();
  if (/\buc\b|university of california/.test(lower)) return 'uc';
  if (/common app/.test(lower)) return 'commonapp';
  return null;
}

interface EssaysData {
  driveLink: string | null;
}

const DEFAULT_DATA: EssaysData = { driveLink: null };

export default function Essays() {
  const [_data, setData] = useState<EssaysData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  // Profile quiz state
  const [profileAnswers, setProfileAnswers] = useState<Record<string, string>>({});
  const [profileSaved, setProfileSaved] = useState(false);

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

  // University prompt lookup
  const [promptSchool, setPromptSchool] = useState('');
  const [promptResult, setPromptResult] = useState<{ type: 'uc' | 'commonapp'; prompts: { num: number; text: string }[] } | null>(null);

  // Why Us tool
  const [whyUsSchool, setWhyUsSchool] = useState('');
  const [whyUsResult, setWhyUsResult] = useState('');
  const [whyUsLoading, setWhyUsLoading] = useState(false);
  const [whyUsError, setWhyUsError] = useState('');

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
        body: JSON.stringify({ theme: bsPrompt, profileAnswers }),
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

  function lookupPrompts() {
    const trimmed = promptSchool.trim();
    if (!trimmed) return;
    const type = detectPromptType(trimmed);
    if (type === 'uc') {
      setPromptResult({ type: 'uc', prompts: UC_PIQ_PROMPTS });
    } else if (type === 'commonapp') {
      setPromptResult({ type: 'commonapp', prompts: COMMON_APP_PROMPTS });
    } else {
      setPromptResult(null);
    }
  }

  async function runWhyUs() {
    if (!whyUsSchool.trim()) return;
    setWhyUsLoading(true);
    setWhyUsError('');
    setWhyUsResult('');
    try {
      const res = await fetch('/api/ai/colleges/whyus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ college: whyUsSchool.trim() }),
      });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setWhyUsResult(result);
    } catch {
      setWhyUsError('Could not generate content — please try again.');
    } finally {
      setWhyUsLoading(false);
    }
  }

  const profileComplete = PROFILE_QUESTIONS.every(q => (profileAnswers[q.key] ?? '').trim().length > 0);

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

      {/* Essay Profile Quiz */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Essay Profile — 5 Questions</h2>
        <p className={styles.aiNote}>Answer these questions so the AI Brainstormer can generate ideas matched to your real story, courses, and activities.</p>
        <div className={styles.profileQuiz}>
          {PROFILE_QUESTIONS.map(q => (
            <div key={q.key} className={styles.profileField}>
              <label className={styles.aiLabel}>{q.label}</label>
              <textarea
                className={styles.profileTextarea}
                placeholder="Write a few sentences…"
                value={profileAnswers[q.key] ?? ''}
                onChange={e => {
                  setProfileSaved(false);
                  setProfileAnswers(prev => ({ ...prev, [q.key]: e.target.value }));
                }}
              />
            </div>
          ))}
          <button
            className={styles.profileSaveBtn}
            onClick={() => setProfileSaved(true)}
            disabled={!profileComplete}
          >
            {profileSaved ? '✓ Saved' : 'Save Profile'}
          </button>
          {!profileComplete && <p className={styles.profileHint}>Complete all 5 questions to save and use in the brainstormer.</p>}
        </div>
      </section>

      {/* AI Brainstormer */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Essay Brainstormer</h2>
        <p className={styles.aiNote}>Get personalized topic ideas matched to your profile, courses, and activities. {profileComplete ? '✓ Your profile answers are included.' : 'Complete the Essay Profile above for the best results.'}</p>
        <div className={styles.aiRow}>
          <div className={styles.aiField}>
            <label className={styles.aiLabel}>Essay prompt (optional)</label>
            <input
              className={styles.aiInput}
              type="text"
              placeholder="e.g. Describe a challenge you've faced, my passion for robotics…"
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

      {/* Essay Prompts by University */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Essay Prompts by University</h2>
        <div className={styles.promptNote}>
          <p><strong>How this works:</strong> Enter a university name to see its essay prompts.</p>
          <ul className={styles.promptNoteList}>
            <li>Type <strong>UC</strong> or any <strong>University of California</strong> campus → UC Personal Insight Questions (PIQs)</li>
            <li>Type <strong>Common App</strong> → Common App Personal Statement prompts</li>
            <li>For all other schools, search the school's admissions website directly or ask <strong>ChatGPT</strong> — for example: <em>"What are the supplemental essay prompts for [School Name] for 2025–2026?"</em></li>
          </ul>
          <p className={styles.promptDisclaimer}>Note: Essay prompts may change slightly from year to year. Always verify the current prompts on the school's official admissions page before submitting — but don't wait to start writing. Getting a strong draft down early gives you time to refine it once the final prompts are confirmed.</p>
        </div>
        <div className={styles.promptRow}>
          <input
            className={styles.promptInput}
            type="text"
            placeholder="e.g. UC Berkeley, Common App"
            value={promptSchool}
            onChange={e => { setPromptSchool(e.target.value); setPromptResult(null); }}
          />
          <button className={styles.promptBtn} onClick={lookupPrompts} disabled={!promptSchool.trim()}>
            Get Prompts
          </button>
        </div>

        {promptResult && (
          <div className={styles.promptResult}>
            {promptResult.type === 'uc' && (
              <>
                <div className={styles.promptResultTitle}>UC Personal Insight Questions (PIQs)</div>
                <p className={styles.promptResultNote}>Choose <strong>4 of the 8</strong> prompts below. Each answer is 350 words max. Answer whichever 4 best showcase your strengths.</p>
              </>
            )}
            {promptResult.type === 'commonapp' && (
              <>
                <div className={styles.promptResultTitle}>Common App Personal Statement Prompts</div>
                <p className={styles.promptResultNote}>Choose <strong>1 prompt</strong>. Essay is 250–650 words. This essay goes to all Common App schools you apply to.</p>
              </>
            )}
            <ol className={styles.promptList}>
              {promptResult.prompts.map(p => (
                <li key={p.num} className={styles.promptItem}>{p.text}</li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* Why Us Tool */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI "Why Us?" Generator</h2>
        <p className={styles.aiNote}>Type a school name to generate talking points about what makes that college unique — helpful for writing your "Why Us?" supplemental essay.</p>
        <div className={styles.aiRow}>
          <div className={styles.aiField}>
            <label className={styles.aiLabel}>School name</label>
            <input
              className={styles.aiInput}
              type="text"
              placeholder="e.g. University of Michigan, Vanderbilt, Georgetown"
              value={whyUsSchool}
              onChange={e => { setWhyUsSchool(e.target.value); setWhyUsResult(''); setWhyUsError(''); }}
              onKeyDown={e => e.key === 'Enter' && runWhyUs()}
            />
          </div>
          <button
            className={styles.aiButton}
            onClick={runWhyUs}
            disabled={whyUsLoading || !whyUsSchool.trim()}
          >
            {whyUsLoading ? 'Generating…' : 'Generate'}
          </button>
        </div>
        {whyUsError && <p className={styles.aiError}>{whyUsError}</p>}
        {whyUsResult && <div className={styles.aiOutput}><MarkdownOutput>{whyUsResult}</MarkdownOutput></div>}
      </section>

      {/* AI Feedback Tool */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AI Essay Feedback</h2>
        <p className={styles.aiNote}>Paste your draft to get structured feedback on strengths, areas to improve, and line-level edits.</p>
        <div className={styles.fbRow}>
          <div className={styles.aiField}>
            <label className={styles.aiLabel}>Essay prompt (optional)</label>
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
            {(() => {
              const count = fbEssayText.trim() ? fbEssayText.trim().split(/\s+/).length : 0;
              const status = count === 0 ? 'empty' : count < 250 ? 'short' : count <= 650 ? 'good' : count <= 700 ? 'warn' : 'over';
              return (
                <div className={`${styles.wordCount} ${styles[`wordCount_${status}`]}`}>
                  {count === 0
                    ? 'Common App: 250–650 words · UC PIQs: 350 words each'
                    : `${count} word${count === 1 ? '' : 's'}${status === 'short' ? ' — below 250 (Common App min)' : status === 'good' ? ' — within Common App range' : status === 'warn' ? ' — approaching 650 limit' : ' — over 650 (Common App max)'}`}
                </div>
              );
            })()}
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
