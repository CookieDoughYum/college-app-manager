import { useState, useEffect } from 'react';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './Activities.module.css';

type ActivityCategory = 'stem' | 'arts' | 'sports' | 'leadership' | 'service' | 'academic';

interface ActivityQuestion {
  q: string;
  options: { label: string; value: ActivityCategory }[];
}

const ACTIVITY_QUIZ: ActivityQuestion[] = [
  {
    q: 'What is your favorite way to spend a free afternoon?',
    options: [
      { label: 'Working on a coding project, experiment, or tech build', value: 'stem' },
      { label: 'Drawing, playing music, writing, or making something creative', value: 'arts' },
      { label: 'Playing, training, or watching sports', value: 'sports' },
      { label: 'Planning or organizing an event or group', value: 'leadership' },
      { label: 'Volunteering or helping out in my community', value: 'service' },
      { label: 'Reading, researching a topic, or debating ideas', value: 'academic' },
    ],
  },
  {
    q: 'Which after-school club sounds most appealing to you?',
    options: [
      { label: 'Robotics, science olympiad, or coding club', value: 'stem' },
      { label: 'Drama, band, art club, or creative writing', value: 'arts' },
      { label: 'A varsity sport or intramural team', value: 'sports' },
      { label: 'Student council or class officer', value: 'leadership' },
      { label: 'Key Club, NHS, or community service group', value: 'service' },
      { label: 'Debate team, Model UN, or academic bowl', value: 'academic' },
    ],
  },
  {
    q: 'What type of project sounds most exciting to you?',
    options: [
      { label: 'Building an app, robot, or science fair entry', value: 'stem' },
      { label: 'Producing a short film, album, or art show', value: 'arts' },
      { label: 'Training for a competition or regional championship', value: 'sports' },
      { label: 'Running a fundraiser or student-led initiative', value: 'leadership' },
      { label: 'Starting a tutoring program or local service campaign', value: 'service' },
      { label: 'Writing a research paper or competing in debate', value: 'academic' },
    ],
  },
  {
    q: 'What role do you naturally take in a group project?',
    options: [
      { label: 'The analyst or builder who figures out how things work', value: 'stem' },
      { label: 'The designer or storyteller who makes it compelling', value: 'arts' },
      { label: 'The energizer who keeps the team competitive and motivated', value: 'sports' },
      { label: 'The organizer who delegates and keeps things on track', value: 'leadership' },
      { label: 'The supporter who makes sure everyone is included', value: 'service' },
      { label: 'The researcher who backs every argument with facts', value: 'academic' },
    ],
  },
  {
    q: 'What are you most proud of accomplishing?',
    options: [
      { label: 'Building or programming something that actually works', value: 'stem' },
      { label: 'Performing, exhibiting, or sharing something I created', value: 'arts' },
      { label: 'Winning a game or achieving a personal athletic record', value: 'sports' },
      { label: 'Organizing something that brought a group together', value: 'leadership' },
      { label: 'Making a real difference for someone or a community', value: 'service' },
      { label: 'Winning a competition based on knowledge or reasoning', value: 'academic' },
    ],
  },
  {
    q: 'Which type of recognition would mean the most to you?',
    options: [
      { label: 'A science, math, or engineering award', value: 'stem' },
      { label: 'A performance or creative achievement award', value: 'arts' },
      { label: 'An athletic award or team championship', value: 'sports' },
      { label: 'Being elected or named to a leadership role', value: 'leadership' },
      { label: 'A service award or community impact recognition', value: 'service' },
      { label: 'An academic scholarship or competition award', value: 'academic' },
    ],
  },
  {
    q: 'How do you prefer to express yourself?',
    options: [
      { label: 'Through data, diagrams, or working code', value: 'stem' },
      { label: 'Through writing, art, music, or performance', value: 'arts' },
      { label: 'Through physical action and competing', value: 'sports' },
      { label: 'Through speeches, planning, and rallying people', value: 'leadership' },
      { label: 'Through acts of kindness, mentorship, or generosity', value: 'service' },
      { label: 'Through arguments, essays, and logical reasoning', value: 'academic' },
    ],
  },
  {
    q: 'What content do you most enjoy watching or reading online?',
    options: [
      { label: 'Tech tutorials, science docs, or engineering videos', value: 'stem' },
      { label: 'Art, music, film, or creative content', value: 'arts' },
      { label: 'Sports highlights, fitness, or athlete stories', value: 'sports' },
      { label: 'Business, leadership, or entrepreneur content', value: 'leadership' },
      { label: 'Social issues, advocacy, or inspiring community stories', value: 'service' },
      { label: 'News, history, philosophy, or opinion/debate content', value: 'academic' },
    ],
  },
  {
    q: 'Which cause do you care most about?',
    options: [
      { label: 'Advancing technology, AI, or scientific discovery', value: 'stem' },
      { label: 'Supporting arts and creative expression in schools', value: 'arts' },
      { label: 'Youth fitness, mental health through sport, or team culture', value: 'sports' },
      { label: 'Student representation and school-wide policy change', value: 'leadership' },
      { label: 'Reducing inequality, hunger, poverty, or injustice', value: 'service' },
      { label: 'Improving access to quality education and knowledge', value: 'academic' },
    ],
  },
  {
    q: 'If you could teach a class to your peers, what would it be about?',
    options: [
      { label: 'How to code, use AI tools, or design a circuit', value: 'stem' },
      { label: 'How to draw, write creatively, or play an instrument', value: 'arts' },
      { label: 'A sport, fitness routine, or training strategy', value: 'sports' },
      { label: 'How to run a project, manage a team, or lead a club', value: 'leadership' },
      { label: 'How to make a real impact in your community', value: 'service' },
      { label: 'A history topic, current event, or philosophical debate', value: 'academic' },
    ],
  },
  {
    q: 'Which competition would you most want to enter?',
    options: [
      { label: 'Science fair, hackathon, or math olympiad', value: 'stem' },
      { label: 'Art contest, film festival, writing competition, or talent show', value: 'arts' },
      { label: 'Athletic tournament or a regional championship', value: 'sports' },
      { label: 'Business plan competition or student leadership conference', value: 'leadership' },
      { label: 'A social impact challenge or service-learning grant', value: 'service' },
      { label: 'Debate tournament, Model UN, or academic decathlon', value: 'academic' },
    ],
  },
  {
    q: 'Which would be your ideal summer experience?',
    options: [
      { label: 'A STEM research program, coding bootcamp, or engineering camp', value: 'stem' },
      { label: 'An arts intensive, theater program, or creative writing workshop', value: 'arts' },
      { label: 'A sports camp, travel team, or fitness challenge', value: 'sports' },
      { label: 'A leadership institute or student government conference', value: 'leadership' },
      { label: 'An international service trip or local nonprofit internship', value: 'service' },
      { label: 'A pre-college academic program or summer research fellowship', value: 'academic' },
    ],
  },
  {
    q: 'What does "success at the end of high school" look like to you?',
    options: [
      { label: 'I built something impressive — an app, a device, or a published project', value: 'stem' },
      { label: 'I performed on a big stage or had my work shown or published', value: 'arts' },
      { label: 'I earned a varsity letter, won a title, or set a school record', value: 'sports' },
      { label: 'I led an organization and left it better than I found it', value: 'leadership' },
      { label: 'I made a lasting, positive difference in people\'s lives', value: 'service' },
      { label: 'I won a major academic competition or earned advanced credentials', value: 'academic' },
    ],
  },
  {
    q: 'Which school subject energizes you most?',
    options: [
      { label: 'Math, physics, computer science, or chemistry', value: 'stem' },
      { label: 'English, art, music, or theater', value: 'arts' },
      { label: 'Physical education, anatomy, or health sciences', value: 'sports' },
      { label: 'Economics, social studies, or government', value: 'leadership' },
      { label: 'Sociology, psychology, or community-based courses', value: 'service' },
      { label: 'History, philosophy, or advanced English/writing', value: 'academic' },
    ],
  },
  {
    q: 'Which type of book or show do you most enjoy?',
    options: [
      { label: 'Sci-fi, space, technology, or science documentaries', value: 'stem' },
      { label: 'Drama, musicals, art films, or literary fiction', value: 'arts' },
      { label: 'Sports stories, underdog narratives, or sports documentaries', value: 'sports' },
      { label: 'Business biopics, political dramas, or leadership stories', value: 'leadership' },
      { label: 'Human interest stories, social justice narratives, or memoirs', value: 'service' },
      { label: 'Historical fiction, true crime, mysteries, or debates', value: 'academic' },
    ],
  },
  {
    q: 'If you started a club at your school, what would it do?',
    options: [
      { label: 'Build tech projects or compete in STEM challenges', value: 'stem' },
      { label: 'Create art, music, or produce a school publication', value: 'arts' },
      { label: 'Organize sports events, a fitness challenge, or a rec league', value: 'sports' },
      { label: 'Plan school-wide events and represent student voices', value: 'leadership' },
      { label: 'Connect students with volunteer and service opportunities', value: 'service' },
      { label: 'Hold debates, host speakers, or publish student research', value: 'academic' },
    ],
  },
  {
    q: 'How do you best recharge after a stressful week?',
    options: [
      { label: 'Tinkering on a personal project or learning something new', value: 'stem' },
      { label: 'Creating art, listening to music, or watching a film', value: 'arts' },
      { label: 'Working out, playing a pickup game, or going for a run', value: 'sports' },
      { label: 'Planning something fun or social with a group of friends', value: 'leadership' },
      { label: 'Doing something kind — helping someone or volunteering', value: 'service' },
      { label: 'Reading a book, writing in a journal, or listening to a podcast', value: 'academic' },
    ],
  },
  {
    q: 'Which phrase best describes your personal brand?',
    options: [
      { label: '"I build things that work."', value: 'stem' },
      { label: '"I make things beautiful and meaningful."', value: 'arts' },
      { label: '"I compete and push myself to excel."', value: 'sports' },
      { label: '"I rally people and make things happen."', value: 'leadership' },
      { label: '"I show up for others and make a difference."', value: 'service' },
      { label: '"I think deeply and argue well."', value: 'academic' },
    ],
  },
  {
    q: 'What do you most want colleges to see about you?',
    options: [
      { label: 'A student with real technical skill and intellectual curiosity', value: 'stem' },
      { label: 'A creative voice with a unique artistic perspective', value: 'arts' },
      { label: 'A disciplined, competitive athlete or performer', value: 'sports' },
      { label: 'A leader who takes initiative and builds community', value: 'leadership' },
      { label: 'A compassionate person who consistently gives back', value: 'service' },
      { label: 'An intellectual who loves to learn and challenge ideas', value: 'academic' },
    ],
  },
  {
    q: 'Which of these high school memories sounds most appealing?',
    options: [
      { label: 'Staying up late debugging code until it finally works', value: 'stem' },
      { label: 'The rush of performing in front of a crowd', value: 'arts' },
      { label: 'Scoring the winning point or lifting a trophy with teammates', value: 'sports' },
      { label: 'Pulling off a massive school event you organized', value: 'leadership' },
      { label: 'Hearing that your service project truly helped someone', value: 'service' },
      { label: 'Winning a debate or acing a major academic competition', value: 'academic' },
    ],
  },
];

const ACTIVITY_LABELS: Record<ActivityCategory, string> = {
  stem: 'STEM & Technology',
  arts: 'Arts, Music & Creative',
  sports: 'Sports & Athletics',
  leadership: 'Leadership & Organizing',
  service: 'Community Service & Advocacy',
  academic: 'Academic Competitions & Debate',
};

function scoreActivityQuiz(answers: Record<number, ActivityCategory[]>): { area: ActivityCategory; count: number }[] {
  const counts: Record<ActivityCategory, number> = { stem: 0, arts: 0, sports: 0, leadership: 0, service: 0, academic: 0 };
  Object.values(answers).forEach(selected => {
    selected.forEach(a => counts[a]++);
  });
  const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1;
  return (Object.keys(counts) as ActivityCategory[])
    .map(k => ({ area: k, count: counts[k] }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(x => ({ ...x, total }));
}

const GRADE_COLUMNS = [
  { label: '9th Grade', key: '9' },
  { label: '10th Grade', key: '10' },
  { label: '11th Grade', key: '11' },
  { label: '12th Grade', key: '12' },
];

interface ActivitiesData {
  interests: any;
  coursePlan: Record<string, string[]>;
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: ActivitiesData = { interests: {}, coursePlan: {}, aiRecommendations: {} };

const MAX_AP_HONORS = 3;

function getCourseAlerts(courses: string[]): string[] {
  const apHonors = courses.filter(c => /\bap\b|honors/i.test(c)).length;
  if (apHonors > MAX_AP_HONORS) return [`${apHonors} AP/Honors courses may be too demanding at once.`];
  return [];
}

function toggleAnswer(prev: Record<number, ActivityCategory[]>, qi: number, value: ActivityCategory): Record<number, ActivityCategory[]> {
  const current = prev[qi] ?? [];
  const has = current.includes(value);
  return { ...prev, [qi]: has ? current.filter(v => v !== value) : [...current, value] };
}

export default function Activities() {
  const [data, setData] = useState<ActivitiesData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [gpa, setGpa] = useState('');
  const [sat, setSat] = useState('');
  const [act, setAct] = useState('');
  const [newCourse, setNewCourse] = useState<Record<string, string>>({});

  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, ActivityCategory[]>>({});
  const [quizResult, setQuizResult] = useState<{ area: ActivityCategory; count: number }[] | null>(null);

  const [extracurricularPlan, setExtracurricularPlan] = useState<Record<string, string[]>>({});
  const [newActivity, setNewActivity] = useState<Record<string, string>>({});

  const [extracurricularLoading, setExtracurricularLoading] = useState(false);
  const [courseRecLoading, setCourseRecLoading] = useState(false);
  const [courseFeedbackLoading, setCourseFeedbackLoading] = useState(false);
  const [extracurricularFeedbackLoading, setExtracurricularFeedbackLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [targetUniversity, setTargetUniversity] = useState('');
  const [courseFeedbackText, setCourseFeedbackText] = useState('');
  const [targetSchoolForActivities, setTargetSchoolForActivities] = useState('');
  const [extracurricularFeedbackText, setExtracurricularFeedbackText] = useState('');

  const [extracurricularSuggestions, setExtracurricularSuggestions] = useState<string[]>([]);
  const [courseSuggestions, setCourseSuggestions] = useState<string[]>([]);
  const [extracurricularFeedbackToAdd, setExtracurricularFeedbackToAdd] = useState<string[]>([]);
  const [extracurricularFeedbackToRemove, setExtracurricularFeedbackToRemove] = useState<string[]>([]);
  const [courseFeedbackToAdd, setCourseFeedbackToAdd] = useState<string[]>([]);
  const [courseFeedbackToRemove, setCourseFeedbackToRemove] = useState<string[]>([]);

  const [openPicker, setOpenPicker] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/student/activities', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        if (d) {
          setData(d);
          const raw = d.interests;
          if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
            if (raw.quizAnswers) {
              const qa = raw.quizAnswers;
              // Migrate old single-value format to array format
              const migrated: Record<number, ActivityCategory[]> = {};
              for (const k of Object.keys(qa)) {
                const v = qa[k];
                migrated[Number(k)] = Array.isArray(v) ? v : [v];
              }
              setQuizAnswers(migrated);
              const result = scoreActivityQuiz(migrated);
              if (result.length > 0) setQuizResult(result);
            }
            if (raw.extracurricularPlan) setExtracurricularPlan(raw.extracurricularPlan);
            if (raw.gpa) setGpa(raw.gpa);
            if (raw.sat) setSat(raw.sat);
            if (raw.act) setAct(raw.act);
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: ActivitiesData) {
    setData(updated);
    fetch('/api/student/activities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function saveAcademicStats(field: 'gpa' | 'sat' | 'act', value: string) {
    const interests = {
      quizAnswers,
      extracurricularPlan,
      gpa: field === 'gpa' ? value : gpa,
      sat: field === 'sat' ? value : sat,
      act: field === 'act' ? value : act,
    };
    fetch('/api/student/activities', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ interests }),
    });
  }

  function submitQuiz() {
    const result = scoreActivityQuiz(quizAnswers);
    setQuizResult(result);
    setQuizOpen(false);
    save({ ...data, interests: { quizAnswers, extracurricularPlan } });
  }

  function resetQuiz() {
    setQuizOpen(false);
    setQuizAnswers({});
    setQuizResult(null);
    save({ ...data, interests: { quizAnswers: {}, extracurricularPlan } });
  }

  const allAnswered = ACTIVITY_QUIZ.every((_, qi) => (quizAnswers[qi] ?? []).length > 0);

  async function getExtracurriculars() {
    setExtracurricularLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/activities/extracurriculars', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error();
      const { result, suggestions } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, extracurriculars: result } }));
      setExtracurricularSuggestions(suggestions ?? []);
    } catch {
      setAiError('Could not generate recommendations — please try again.');
    } finally {
      setExtracurricularLoading(false);
    }
  }

  async function getCourseRecommendations() {
    setCourseRecLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/activities/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ gpa, sat, act }),
      });
      if (!res.ok) throw new Error();
      const { result, suggestions } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, courses: result } }));
      setCourseSuggestions(suggestions ?? []);
    } catch {
      setAiError('Could not generate recommendations — please try again.');
    } finally {
      setCourseRecLoading(false);
    }
  }

  async function getCourseFeedback() {
    setCourseFeedbackLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/activities/coursefeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetUniversity }),
      });
      if (!res.ok) throw new Error();
      const { result, toAdd, toRemove } = await res.json();
      setCourseFeedbackText(result);
      setCourseFeedbackToAdd(toAdd ?? []);
      setCourseFeedbackToRemove(toRemove ?? []);
    } catch {
      setAiError('Could not generate feedback — please try again.');
    } finally {
      setCourseFeedbackLoading(false);
    }
  }

  async function getExtracurricularFeedback() {
    setExtracurricularFeedbackLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/activities/extracurricularfeedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ targetSchool: targetSchoolForActivities }),
      });
      if (!res.ok) throw new Error();
      const { result, toAdd, toRemove } = await res.json();
      setExtracurricularFeedbackText(result);
      setExtracurricularFeedbackToAdd(toAdd ?? []);
      setExtracurricularFeedbackToRemove(toRemove ?? []);
    } catch {
      setAiError('Could not generate feedback — please try again.');
    } finally {
      setExtracurricularFeedbackLoading(false);
    }
  }

  function addCourse(gradeKey: string) {
    const name = (newCourse[gradeKey] ?? '').trim();
    if (!name) return;
    const existing = data.coursePlan[gradeKey] ?? [];
    save({ ...data, coursePlan: { ...data.coursePlan, [gradeKey]: [...existing, name] } });
    setNewCourse(prev => ({ ...prev, [gradeKey]: '' }));
  }

  function removeCourse(gradeKey: string, index: number) {
    const updated = (data.coursePlan[gradeKey] ?? []).filter((_, i) => i !== index);
    save({ ...data, coursePlan: { ...data.coursePlan, [gradeKey]: updated } });
  }

  function addActivity(gradeKey: string) {
    const name = (newActivity[gradeKey] ?? '').trim();
    if (!name) return;
    const existing = extracurricularPlan[gradeKey] ?? [];
    const newPlan = { ...extracurricularPlan, [gradeKey]: [...existing, name] };
    setExtracurricularPlan(newPlan);
    save({ ...data, interests: { quizAnswers, extracurricularPlan: newPlan } });
    setNewActivity(prev => ({ ...prev, [gradeKey]: '' }));
  }

  function removeActivity(gradeKey: string, index: number) {
    const updated = (extracurricularPlan[gradeKey] ?? []).filter((_, i) => i !== index);
    const newPlan = { ...extracurricularPlan, [gradeKey]: updated };
    setExtracurricularPlan(newPlan);
    save({ ...data, interests: { quizAnswers, extracurricularPlan: newPlan } });
  }

  function isActivityInPlan(name: string): boolean {
    return Object.values(extracurricularPlan).some(arr => arr.includes(name));
  }

  function isCourseInPlan(name: string): boolean {
    return Object.values(data.coursePlan).some(arr => arr.includes(name));
  }

  function addActivityToGrade(gradeKey: string, activityName: string) {
    const existing = extracurricularPlan[gradeKey] ?? [];
    const newPlan = existing.includes(activityName)
      ? extracurricularPlan
      : { ...extracurricularPlan, [gradeKey]: [...existing, activityName] };
    setExtracurricularPlan(newPlan);
    save({ ...data, interests: { quizAnswers, extracurricularPlan: newPlan } });
    setOpenPicker(null);
  }

  function removeActivityFromPlan(activityName: string) {
    const newPlan: Record<string, string[]> = {};
    for (const gk of Object.keys(extracurricularPlan)) {
      newPlan[gk] = (extracurricularPlan[gk] ?? []).filter(a => a !== activityName);
    }
    setExtracurricularPlan(newPlan);
    save({ ...data, interests: { quizAnswers, extracurricularPlan: newPlan } });
  }

  function addCourseToGrade(gradeKey: string, courseName: string) {
    const existing = data.coursePlan[gradeKey] ?? [];
    if (existing.includes(courseName)) { setOpenPicker(null); return; }
    save({ ...data, coursePlan: { ...data.coursePlan, [gradeKey]: [...existing, courseName] } });
    setOpenPicker(null);
  }

  function removeCourseFromPlan(courseName: string) {
    const newPlan: Record<string, string[]> = {};
    for (const gk of Object.keys(data.coursePlan)) {
      newPlan[gk] = (data.coursePlan[gk] ?? []).filter(c => c !== courseName);
    }
    save({ ...data, coursePlan: newPlan });
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const extracurricularRecs = data.aiRecommendations?.extracurriculars;
  const courseRecs = data.aiRecommendations?.courses;

  function GradePicker({ pickerKey, onAdd }: { pickerKey: string; onAdd: (gradeKey: string) => void }) {
    return (
      <div className={styles.gradePicker}>
        <span className={styles.gradePickerLabel}>Add to:</span>
        {GRADE_COLUMNS.map(({ label, key }) => (
          <button key={key} className={styles.gradePickerBtn} onClick={() => onAdd(key)}>{label}</button>
        ))}
        <button className={styles.gradePickerCancel} onClick={() => setOpenPicker(null)}>Cancel</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Activities &amp; Courses</h1>

      {/* Activities Questionnaire */}
      <section className={styles.section}>
        <div className={styles.quizHeader}>
          <h2 className={styles.sectionTitle}>Activities Questionnaire</h2>
          {!quizOpen && !quizResult && (
            <button className={styles.quizToggle} onClick={() => setQuizOpen(true)}>Take the Quiz (20 questions)</button>
          )}
          {(quizOpen || quizResult) && (
            <button className={styles.quizToggle} onClick={resetQuiz}>Reset</button>
          )}
        </div>
        <p className={styles.quizNote}>Select all options that apply to you for each question.</p>
        {quizResult ? (
          <div className={styles.quizResult}>
            <div className={styles.quizResultLabel}>Your top activity areas</div>
            {quizResult.map((r, i) => (
              <div key={r.area} className={styles.quizResultRow}>
                <span className={styles.quizResultRank}>#{i + 1}</span>
                <div className={styles.quizResultBarWrap}>
                  <div className={styles.quizResultBarLabel}>{ACTIVITY_LABELS[r.area]}</div>
                  <div className={styles.quizResultBar}>
                    <div className={styles.quizResultBarFill} style={{ width: `${Math.round((r.count / (Object.values(quizAnswers).reduce((s, a) => s + a.length, 0) || 1)) * 100)}%` }} />
                  </div>
                </div>
                <span className={styles.quizResultPct}>{Math.round((r.count / (Object.values(quizAnswers).reduce((s, a) => s + a.length, 0) || 1)) * 100)}%</span>
              </div>
            ))}
            <p className={styles.quizResultDetail}>Results saved — use the buttons below to get personalized recommendations.</p>
          </div>
        ) : quizOpen ? (
          <div className={styles.quizBody}>
            {ACTIVITY_QUIZ.map((q, qi) => (
              <div key={qi} className={styles.quizQuestion}>
                <p className={styles.quizQ}>{qi + 1}. {q.q}</p>
                <div className={styles.quizOptions}>
                  {q.options.map(opt => {
                    const selected = (quizAnswers[qi] ?? []).includes(opt.value);
                    return (
                      <label key={opt.value} className={`${styles.quizOption} ${selected ? styles.quizOptionSelected : ''}`}>
                        <input
                          type="checkbox"
                          name={`aq${qi}`}
                          value={opt.value}
                          checked={selected}
                          onChange={() => setQuizAnswers(prev => toggleAnswer(prev, qi, opt.value))}
                        />
                        {opt.label}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <button
              className={styles.quizSubmit}
              disabled={!allAnswered}
              onClick={submitQuiz}
            >
              See My Results ({Object.values(quizAnswers).filter(a => a.length > 0).length}/{ACTIVITY_QUIZ.length} answered)
            </button>
          </div>
        ) : (
          <p className={styles.placeholder}>Answer 20 questions to discover your top activity areas. You can select multiple options per question. Your results drive the recommendations below.</p>
        )}
      </section>

      {/* Academic Profile */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Academic Profile</h2>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>GPA</label>
            <input className={styles.input} type="text" placeholder="e.g. 3.8" value={gpa} onChange={e => setGpa(e.target.value)} onBlur={e => saveAcademicStats('gpa', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>SAT Score</label>
            <input className={styles.input} type="text" placeholder="e.g. 1400" value={sat} onChange={e => setSat(e.target.value)} onBlur={e => saveAcademicStats('sat', e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>ACT Score</label>
            <input className={styles.input} type="text" placeholder="e.g. 31" value={act} onChange={e => setAct(e.target.value)} onBlur={e => saveAcademicStats('act', e.target.value)} />
          </div>
        </div>
      </section>

      {/* Course Recommendations */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <h2 className={styles.sectionTitle}>Course Recommendations</h2>
          <button className={styles.aiBtn} onClick={getCourseRecommendations} disabled={courseRecLoading}>
            {courseRecLoading ? 'Generating…' : 'Get Course Recommendations'}
          </button>
        </div>
        {aiError && <p className={styles.errorText}>{aiError}</p>}
        {courseRecs ? (
          <>
            <MarkdownOutput>{courseRecs}</MarkdownOutput>
            {courseSuggestions.length > 0 && (
              <div className={styles.actionableSection}>
                <div className={styles.actionableSectionTitle}>Add to your 4-Year Course Plan:</div>
                {courseSuggestions.filter(item => !isCourseInPlan(item)).map((item, i) => (
                  <div key={i} className={styles.actionableItem}>
                    <span className={styles.actionableItemName}>{item}</span>
                    {openPicker === `courseRec:${item}` ? (
                      <GradePicker pickerKey={`courseRec:${item}`} onAdd={gk => addCourseToGrade(gk, item)} />
                    ) : (
                      <button className={styles.actionableAddBtn} onClick={() => setOpenPicker(`courseRec:${item}`)}>+ Add to Plan</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className={styles.placeholder}>Enter your stats in Academic Profile and complete the questionnaire, then click the button for course suggestions tailored to your goals.</p>
        )}
      </section>

      {/* Extracurricular Recommendations */}
      <section className={styles.section}>
        <div className={styles.sectionHeaderRow}>
          <h2 className={styles.sectionTitle}>Extracurricular Recommendations</h2>
          <button className={styles.aiBtn} onClick={getExtracurriculars} disabled={extracurricularLoading}>
            {extracurricularLoading ? 'Generating…' : 'Get Extracurricular Recommendations'}
          </button>
        </div>
        {extracurricularRecs ? (
          <>
            <MarkdownOutput>{extracurricularRecs}</MarkdownOutput>
            {extracurricularSuggestions.length > 0 && (
              <div className={styles.actionableSection}>
                <div className={styles.actionableSectionTitle}>Add to your 4-Year Extracurricular Plan:</div>
                {extracurricularSuggestions.filter(item => !isActivityInPlan(item)).map((item, i) => (
                  <div key={i} className={styles.actionableItem}>
                    <span className={styles.actionableItemName}>{item}</span>
                    {openPicker === `extRec:${item}` ? (
                      <GradePicker pickerKey={`extRec:${item}`} onAdd={gk => addActivityToGrade(gk, item)} />
                    ) : (
                      <button className={styles.actionableAddBtn} onClick={() => setOpenPicker(`extRec:${item}`)}>+ Add to Plan</button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className={styles.placeholder}>Complete the questionnaire above, then click the button for personalized extracurricular suggestions.</p>
        )}
      </section>

      {/* 4-Year Course Plan */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4-Year Course Plan</h2>
        <div className={styles.planGrid}>
          {GRADE_COLUMNS.map(({ label, key }) => (
            <div key={label} className={styles.planCol}>
              <div className={styles.planColHeader}>{label}</div>
              <div className={styles.planColBody}>
                {(data.coursePlan[key] ?? []).length === 0 ? (
                  <p className={styles.planPlaceholder}>No courses added yet.</p>
                ) : (
                  (data.coursePlan[key] ?? []).map((course, i) => (
                    <div key={i} className={styles.planCourseRow}>
                      <span className={styles.planCourse}>{course}</span>
                      <button className={styles.planRemoveBtn} onClick={() => removeCourse(key, i)} title="Remove">×</button>
                    </div>
                  ))
                )}
                {getCourseAlerts(data.coursePlan[key] ?? []).map((msg, i) => (
                  <div key={i} className={styles.planAlert}>⚠ {msg}</div>
                ))}
                <div className={styles.planAddRow}>
                  <input
                    className={styles.planAddInput}
                    placeholder="Add course…"
                    value={newCourse[key] ?? ''}
                    onChange={e => setNewCourse(prev => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addCourse(key)}
                  />
                  <button className={styles.planAddBtn} onClick={() => addCourse(key)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Course Rigor Feedback */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Course Rigor Feedback</h2>
        <div className={styles.feedbackRow}>
          <div className={styles.feedbackInputWrap}>
            <label className={styles.label}>Target University (optional)</label>
            <input
              className={styles.feedbackInput}
              type="text"
              placeholder="e.g. University of Michigan"
              value={targetUniversity}
              onChange={e => setTargetUniversity(e.target.value)}
            />
          </div>
          <button className={`${styles.aiBtn} ${styles.feedbackBtn}`} onClick={getCourseFeedback} disabled={courseFeedbackLoading}>
            {courseFeedbackLoading ? 'Analyzing…' : 'Get Course Feedback'}
          </button>
        </div>
        {courseFeedbackText ? (
          <>
            <MarkdownOutput>{courseFeedbackText}</MarkdownOutput>
            {(courseFeedbackToAdd.length > 0 || courseFeedbackToRemove.length > 0) && (
              <div className={styles.actionableSection}>
                {courseFeedbackToAdd.length > 0 && (
                  <>
                    <div className={styles.actionableSectionTitle}>Courses to add to your plan:</div>
                    {courseFeedbackToAdd.filter(item => !isCourseInPlan(item)).map((item, i) => (
                      <div key={i} className={styles.actionableItem}>
                        <span className={styles.actionableItemName}>{item}</span>
                        {openPicker === `courseFeedAdd:${item}` ? (
                          <GradePicker pickerKey={`courseFeedAdd:${item}`} onAdd={gk => addCourseToGrade(gk, item)} />
                        ) : (
                          <button className={styles.actionableAddBtn} onClick={() => setOpenPicker(`courseFeedAdd:${item}`)}>+ Add to Plan</button>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {courseFeedbackToRemove.filter(item => isCourseInPlan(item)).length > 0 && (
                  <>
                    <div className={`${styles.actionableSectionTitle} ${styles.actionableSectionTitleRemove}`}>Courses to reconsider:</div>
                    {courseFeedbackToRemove.filter(item => isCourseInPlan(item)).map((item, i) => (
                      <div key={i} className={styles.actionableItem}>
                        <span className={styles.actionableItemName}>{item}</span>
                        <button className={styles.actionableRemoveBtn} onClick={() => removeCourseFromPlan(item)}>Remove from Plan</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <p className={styles.placeholder}>
            Add courses to your 4-year plan above, then click "Get Course Feedback" for rigor analysis.
            Enter a target university to see if your course load matches their expectations.
          </p>
        )}
      </section>

      {/* 4-Year Extracurricular Plan */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>4-Year Extracurricular Plan</h2>
        <div className={styles.planGrid}>
          {GRADE_COLUMNS.map(({ label, key }) => (
            <div key={label} className={styles.planCol}>
              <div className={styles.planColHeader}>{label}</div>
              <div className={styles.planColBody}>
                {(extracurricularPlan[key] ?? []).length === 0 ? (
                  <p className={styles.planPlaceholder}>No activities added yet.</p>
                ) : (
                  (extracurricularPlan[key] ?? []).map((activity, i) => (
                    <div key={i} className={styles.planCourseRow}>
                      <span className={styles.planCourse}>{activity}</span>
                      <button className={styles.planRemoveBtn} onClick={() => removeActivity(key, i)} title="Remove">×</button>
                    </div>
                  ))
                )}
                <div className={styles.planAddRow}>
                  <input
                    className={styles.planAddInput}
                    placeholder="Add activity…"
                    value={newActivity[key] ?? ''}
                    onChange={e => setNewActivity(prev => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addActivity(key)}
                  />
                  <button className={styles.planAddBtn} onClick={() => addActivity(key)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Extracurricular Feedback */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Extracurricular Feedback</h2>
        <div className={styles.feedbackRow}>
          <div className={styles.feedbackInputWrap}>
            <label className={styles.label}>Target School (optional)</label>
            <input
              className={styles.feedbackInput}
              type="text"
              placeholder="e.g. Stanford, UCLA, Ohio State"
              value={targetSchoolForActivities}
              onChange={e => setTargetSchoolForActivities(e.target.value)}
            />
          </div>
          <button className={`${styles.aiBtn} ${styles.feedbackBtn}`} onClick={getExtracurricularFeedback} disabled={extracurricularFeedbackLoading}>
            {extracurricularFeedbackLoading ? 'Analyzing…' : 'Get Extracurricular Feedback'}
          </button>
        </div>
        {extracurricularFeedbackText ? (
          <>
            <MarkdownOutput>{extracurricularFeedbackText}</MarkdownOutput>
            {(extracurricularFeedbackToAdd.length > 0 || extracurricularFeedbackToRemove.length > 0) && (
              <div className={styles.actionableSection}>
                {extracurricularFeedbackToAdd.length > 0 && (
                  <>
                    <div className={styles.actionableSectionTitle}>Activities to add to your plan:</div>
                    {extracurricularFeedbackToAdd.filter(item => !isActivityInPlan(item)).map((item, i) => (
                      <div key={i} className={styles.actionableItem}>
                        <span className={styles.actionableItemName}>{item}</span>
                        {openPicker === `extFeedAdd:${item}` ? (
                          <GradePicker pickerKey={`extFeedAdd:${item}`} onAdd={gk => addActivityToGrade(gk, item)} />
                        ) : (
                          <button className={styles.actionableAddBtn} onClick={() => setOpenPicker(`extFeedAdd:${item}`)}>+ Add to Plan</button>
                        )}
                      </div>
                    ))}
                  </>
                )}
                {extracurricularFeedbackToRemove.filter(item => isActivityInPlan(item)).length > 0 && (
                  <>
                    <div className={`${styles.actionableSectionTitle} ${styles.actionableSectionTitleRemove}`}>Activities to reconsider:</div>
                    {extracurricularFeedbackToRemove.filter(item => isActivityInPlan(item)).map((item, i) => (
                      <div key={i} className={styles.actionableItem}>
                        <span className={styles.actionableItemName}>{item}</span>
                        <button className={styles.actionableRemoveBtn} onClick={() => removeActivityFromPlan(item)}>Remove from Plan</button>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <p className={styles.placeholder}>
            Add activities to your 4-year plan above, then click "Get Extracurricular Feedback" to find out if your list is too thin, too scattered, or just right.
            Enter a target school to get school-specific guidance.
          </p>
        )}
      </section>
    </div>
  );
}
