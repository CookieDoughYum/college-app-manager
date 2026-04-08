import { useState, useEffect } from 'react';
import TagChip from '../../components/TagChip';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './Exams.module.css';

const QUIZ_QUESTIONS = [
  {
    q: 'How would you describe your test-taking pace?',
    options: [
      { label: 'I work fast and can handle a high volume of questions', value: 'act' as const },
      { label: 'I prefer fewer, more carefully constructed questions', value: 'sat' as const },
    ],
  },
  {
    q: 'How do you feel about a dedicated Science section?',
    options: [
      { label: 'I enjoy analyzing graphs, charts, and scientific data', value: 'act' as const },
      { label: "I'd rather not have a separate science section", value: 'sat' as const },
    ],
  },
  {
    q: 'What is your preference for the math section?',
    options: [
      { label: 'Calculator allowed throughout the entire math section', value: 'act' as const },
      { label: "I'm comfortable doing some math without a calculator", value: 'sat' as const },
    ],
  },
  {
    q: 'How do you approach reading comprehension questions?',
    options: [
      { label: 'I find answers quickly by scanning the passage directly', value: 'act' as const },
      { label: 'I prefer questions that require deeper inference and analysis', value: 'sat' as const },
    ],
  },
  {
    q: 'Which best describes your strongest academic area?',
    options: [
      { label: 'Science and reasoning across multiple subjects', value: 'act' as const },
      { label: 'Math and evidence-based reading & writing', value: 'sat' as const },
    ],
  },
] as const;

const QUIZ_RESULTS = {
  sat: {
    label: 'SAT',
    summary: 'The SAT may be a better fit for you.',
    detail: 'You tend to prefer fewer, more analytical questions and are comfortable with some calculator-free math. The SAT rewards careful readers and strong math reasoning — with no separate science section to worry about.',
  },
  act: {
    label: 'ACT',
    summary: 'The ACT may be a better fit for you.',
    detail: 'You work at a quick pace, enjoy data and science reasoning, and prefer having a calculator throughout the math section. The ACT rewards broad, multi-subject thinkers and test-takers who can move efficiently.',
  },
};

interface ExamsData {
  testPreference: string | null;
  apCourses: string[];
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: ExamsData = { testPreference: null, apCourses: [], aiRecommendations: {} };

export default function Exams() {
  const [data, setData] = useState<ExamsData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, 'sat' | 'act'>>({});
  const [quizResult, setQuizResult] = useState<'sat' | 'act' | null>(null);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleError, setScheduleError] = useState('');
  const [addingAp, setAddingAp] = useState(false);
  const [apInput, setApInput] = useState('');

  useEffect(() => {
    fetch('/api/student/exams', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: ExamsData) {
    setData(updated);
    fetch('/api/student/exams', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function addApCourse() {
    const trimmed = apInput.trim();
    if (trimmed) save({ ...data, apCourses: [...data.apCourses, trimmed] });
    setApInput('');
    setAddingAp(false);
  }

  function removeApCourse(course: string) {
    save({ ...data, apCourses: data.apCourses.filter(c => c !== course) });
  }

  function scoreQuiz() {
    const sat = Object.values(quizAnswers).filter(a => a === 'sat').length;
    const act = Object.values(quizAnswers).filter(a => a === 'act').length;
    setQuizResult(sat >= act ? 'sat' : 'act');
  }

  async function generateSchedule() {
    setScheduleLoading(true);
    setScheduleError('');
    try {
      const res = await fetch('/api/ai/exams/schedule', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, schedule: result } }));
    } catch {
      setScheduleError('Could not generate schedule — please try again.');
    } finally {
      setScheduleLoading(false);
    }
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const scheduleText = data.aiRecommendations?.schedule;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Exam Prep</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>About the PSAT</h2>
        <p className={styles.psatBody}>
          The <strong>PSAT/NMSQT</strong> (Preliminary SAT / National Merit Scholarship Qualifying Test) is taken in October,
          typically in 10th or 11th grade. It's offered through your school — check with your counselor to register.
        </p>
        <ul className={styles.psatList}>
          <li><strong>Practice for the SAT</strong> — same format and question style, shorter and lower stakes.</li>
          <li><strong>National Merit</strong> — 11th grade scores qualify you for the National Merit Scholarship Program. Top scorers advance to Semifinalist and beyond.</li>
          <li><strong>Score reports</strong> — you'll get detailed feedback on math, reading, and writing skills to guide your SAT prep.</li>
          <li><strong>No registration required from you</strong> — your school handles sign-up. Confirm the date with your counselor each fall.</li>
        </ul>
      </section>

      <section className={styles.section}>
        <div className={styles.quizHeader}>
          <h2 className={styles.sectionTitle}>SAT or ACT?</h2>
          {!quizOpen && !quizResult && (
            <button className={styles.quizToggle} onClick={() => setQuizOpen(true)}>Take the Quiz</button>
          )}
          {(quizOpen || quizResult) && (
            <button className={styles.quizToggle} onClick={() => { setQuizOpen(false); setQuizAnswers({}); setQuizResult(null); }}>Reset</button>
          )}
        </div>
        {quizResult ? (
          <div className={styles.quizResult}>
            <div className={styles.quizResultLabel}>{QUIZ_RESULTS[quizResult].label} recommended</div>
            <p className={styles.quizResultSummary}>{QUIZ_RESULTS[quizResult].summary}</p>
            <p className={styles.quizResultDetail}>{QUIZ_RESULTS[quizResult].detail}</p>
          </div>
        ) : quizOpen ? (
          <div className={styles.quizBody}>
            {QUIZ_QUESTIONS.map((q, qi) => (
              <div key={qi} className={styles.quizQuestion}>
                <p className={styles.quizQ}>{qi + 1}. {q.q}</p>
                <div className={styles.quizOptions}>
                  {q.options.map(opt => (
                    <label key={opt.value} className={`${styles.quizOption} ${quizAnswers[qi] === opt.value ? styles.quizOptionSelected : ''}`}>
                      <input
                        type="radio"
                        name={`q${qi}`}
                        value={opt.value}
                        checked={quizAnswers[qi] === opt.value}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, [qi]: opt.value }))}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <button
              className={styles.quizSubmit}
              disabled={Object.keys(quizAnswers).length < QUIZ_QUESTIONS.length}
              onClick={scoreQuiz}
            >
              See My Result
            </button>
          </div>
        ) : (
          <p className={styles.placeholder}>Answer 5 quick questions to find out whether SAT or ACT suits your style.</p>
        )}
      </section>

      <div className={styles.cardRow}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>SAT Prep</div>
          <p className={styles.cardBody}>Khan Academy offers free, official SAT prep.</p>
          <a className={styles.cardLink} href="https://satsuite.collegeboard.org/sat/registration" target="_blank" rel="noreferrer">Register for SAT →</a>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>ACT Prep</div>
          <p className={styles.cardBody}>The ACT website offers free practice tests and prep resources.</p>
          <a className={styles.cardLink} href="https://www.act.org/content/act/en/products-and-services/the-act/registration.html" target="_blank" rel="noreferrer">Register for ACT →</a>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Test Day Reminders</div>
          <p className={styles.cardBody}>Bring photo ID, pencils, and your admission ticket. Arrive 30 minutes early.</p>
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>AP Exam Tracker</h2>
        <div className={styles.chipRow}>
          {data.apCourses.map((course) => (
            <TagChip key={course} label={course} selected={true} onClick={() => removeApCourse(course)} />
          ))}
          {addingAp ? (
            <span className={styles.apInputWrap}>
              <input autoFocus className={styles.apInput} value={apInput} onChange={(e) => setApInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addApCourse()} placeholder="Course name" />
              <button className={styles.apAddBtn} onClick={addApCourse}>Add</button>
            </span>
          ) : (
            <button className={styles.addChip} onClick={() => setAddingAp(true)}>+ Add</button>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>AP Study Schedule</h2>
          <button
            onClick={generateSchedule}
            disabled={scheduleLoading}
            style={{ background: '#0f3460', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
          >
            {scheduleLoading ? 'Generating…' : 'Generate Study Schedule'}
          </button>
        </div>
        {scheduleError && <p style={{ color: '#e94560' }}>{scheduleError}</p>}
        {scheduleText ? (
          <MarkdownOutput>{scheduleText}</MarkdownOutput>
        ) : (
          <p style={{ color: '#888', marginTop: '0.5rem' }}>Add AP courses above, then click "Generate Study Schedule" for a week-by-week plan.</p>
        )}
      </section>

      <div className={styles.warningBox}>
        ⚠ AP exam registration typically opens in the fall. Check with your school's AP coordinator early.
      </div>
    </div>
  );
}
