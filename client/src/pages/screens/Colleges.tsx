import { useState, useEffect } from 'react';
import MarkdownOutput from '../../components/MarkdownOutput';
import styles from './Colleges.module.css';

// College match quiz
const COLLEGE_MATCH_QUIZ = [
  {
    key: 'size',
    q: 'What size college do you prefer?',
    options: [
      { label: 'Small (under 3,000 students) — tight-knit, everyone knows everyone', value: 'small' },
      { label: 'Medium (3,000–15,000) — balanced community and resources', value: 'medium' },
      { label: 'Large (15,000+) — big campus energy, lots of options', value: 'large' },
    ],
  },
  {
    key: 'setting',
    q: 'What campus setting appeals to you most?',
    options: [
      { label: 'Urban — in or near a major city, easy access to internships and culture', value: 'urban' },
      { label: 'Suburban — mid-sized city with campus feel but city nearby', value: 'suburban' },
      { label: 'Rural — traditional college town, beautiful campus, close community', value: 'rural' },
    ],
  },
  {
    key: 'distance',
    q: 'How far from home do you want to go?',
    options: [
      { label: 'Close — within 2 hours, easy to visit home', value: 'close' },
      { label: 'Moderate — same region or state, occasional trips home', value: 'moderate' },
      { label: 'Far — across the country or out of state, full independence', value: 'far' },
    ],
  },
  {
    key: 'type',
    q: 'Do you prefer public or private?',
    options: [
      { label: 'Public university — larger, lower cost (especially in-state), big sports culture', value: 'public' },
      { label: 'Private university — often smaller, more financial aid, diverse geography', value: 'private' },
      { label: 'No preference — open to either', value: 'either' },
    ],
  },
  {
    key: 'focus',
    q: 'What is your academic focus preference?',
    options: [
      { label: 'Research university — major research programs, graduate school pathway', value: 'research' },
      { label: 'Liberal arts college — broad education, small classes, writing-intensive', value: 'liberalarts' },
      { label: 'Technical / specialized — engineering, arts, business, or STEM focus', value: 'technical' },
    ],
  },
  {
    key: 'social',
    q: 'What campus social life matters most to you?',
    options: [
      { label: 'Greek life — fraternities and sororities are important to me', value: 'greek' },
      { label: 'Club and org culture — lots of student groups and activities', value: 'clubs' },
      { label: 'Athletics — strong sports culture, attending games is a big deal', value: 'sports' },
      { label: 'Laid-back — I prefer a more low-key, study-focused environment', value: 'lowkey' },
    ],
  },
  {
    key: 'selectivity',
    q: 'What selectivity level are you targeting?',
    options: [
      { label: 'Highly selective (under 20% acceptance rate) — Ivies, top-10 schools', value: 'elite' },
      { label: 'Selective (20–40% acceptance rate) — strong regional and national schools', value: 'selective' },
      { label: 'Less selective (40%+) — broad access, good match for my stats', value: 'accessible' },
    ],
  },
  {
    key: 'aid',
    q: 'How important is financial aid or merit scholarships?',
    options: [
      { label: 'Very important — cost is a major factor in my decision', value: 'high' },
      { label: 'Somewhat important — I want options but cost is not the only factor', value: 'medium' },
      { label: 'Not a primary concern — family can handle most costs', value: 'low' },
    ],
  },
] as const;

type InterestArea = 'stem' | 'healthcare' | 'business' | 'arts' | 'social' | 'law' | 'trades';

const INTEREST_QUIZ = [
  {
    q: 'Which school subject do you enjoy most?',
    options: [
      { label: 'Math or Computer Science', value: 'stem' as InterestArea },
      { label: 'Biology or Chemistry', value: 'healthcare' as InterestArea },
      { label: 'Economics or Business', value: 'business' as InterestArea },
      { label: 'Art, Music, or Creative Writing', value: 'arts' as InterestArea },
      { label: 'History, Psychology, or Sociology', value: 'social' as InterestArea },
      { label: 'Government, Law, or Debate', value: 'law' as InterestArea },
      { label: 'Physics, Engineering Tech, or Shop', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'What kind of impact do you most want to have?',
    options: [
      { label: 'Build technology that changes how people live', value: 'stem' as InterestArea },
      { label: "Improve people's health and wellbeing", value: 'healthcare' as InterestArea },
      { label: 'Create businesses or drive economic growth', value: 'business' as InterestArea },
      { label: 'Inspire or move people through creative work', value: 'arts' as InterestArea },
      { label: 'Strengthen communities and support others', value: 'social' as InterestArea },
      { label: 'Shape laws, policy, or justice', value: 'law' as InterestArea },
      { label: 'Design and build physical things that last', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which work environment sounds most appealing?',
    options: [
      { label: 'Lab, research facility, or tech office', value: 'stem' as InterestArea },
      { label: 'Hospital, clinic, or wellness center', value: 'healthcare' as InterestArea },
      { label: 'Corporate office, startup, or trading floor', value: 'business' as InterestArea },
      { label: 'Studio, stage, gallery, or newsroom', value: 'arts' as InterestArea },
      { label: 'Classroom, nonprofit, or community org', value: 'social' as InterestArea },
      { label: 'Courtroom, government agency, or think tank', value: 'law' as InterestArea },
      { label: 'Workshop, construction site, or factory floor', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'How do you prefer to solve problems?',
    options: [
      { label: 'Analyze data and write code or formulas', value: 'stem' as InterestArea },
      { label: 'Research symptoms, causes, and treatments', value: 'healthcare' as InterestArea },
      { label: 'Model the financial or strategic trade-offs', value: 'business' as InterestArea },
      { label: 'Brainstorm and sketch out creative ideas', value: 'arts' as InterestArea },
      { label: 'Talk it through and build consensus', value: 'social' as InterestArea },
      { label: 'Research precedents and build an argument', value: 'law' as InterestArea },
      { label: 'Prototype, test, and iterate hands-on', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which describes your dream accomplishment?',
    options: [
      { label: 'Launch a product used by millions of people', value: 'stem' as InterestArea },
      { label: 'Develop a treatment that saves lives', value: 'healthcare' as InterestArea },
      { label: 'Build a company from scratch or lead a major org', value: 'business' as InterestArea },
      { label: 'Create a work of art, film, or design that endures', value: 'arts' as InterestArea },
      { label: 'Make a measurable difference in an underserved community', value: 'social' as InterestArea },
      { label: 'Argue a landmark case or write influential policy', value: 'law' as InterestArea },
      { label: 'Engineer a structure or system that stands for decades', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'On a free afternoon you would most likely...',
    options: [
      { label: 'Tinker with a coding project or learn a new tool', value: 'stem' as InterestArea },
      { label: 'Read about medicine, nutrition, or health topics', value: 'healthcare' as InterestArea },
      { label: 'Follow markets, start a side hustle, or read business news', value: 'business' as InterestArea },
      { label: 'Draw, write, play music, or watch films', value: 'arts' as InterestArea },
      { label: 'Volunteer, hang out with friends, or catch up on current events', value: 'social' as InterestArea },
      { label: 'Debate politics, research a legal issue, or read history', value: 'law' as InterestArea },
      { label: 'Build or fix something around the house', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which role would you most naturally take on in a group project?',
    options: [
      { label: 'The researcher who digs into data and figures out what works', value: 'stem' as InterestArea },
      { label: 'The caregiver who makes sure everyone is okay and supported', value: 'healthcare' as InterestArea },
      { label: 'The organizer who manages the timeline and resources', value: 'business' as InterestArea },
      { label: 'The designer who makes it look and feel compelling', value: 'arts' as InterestArea },
      { label: 'The mediator who keeps the team communicating well', value: 'social' as InterestArea },
      { label: 'The advocate who makes sure the right decision gets made', value: 'law' as InterestArea },
      { label: 'The builder who turns ideas into a working prototype', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which high school club or activity would you most likely join?',
    options: [
      { label: 'Robotics, coding club, or math team', value: 'stem' as InterestArea },
      { label: 'Health occupations, first aid, or biology club', value: 'healthcare' as InterestArea },
      { label: 'DECA, FBLA, or student-run business', value: 'business' as InterestArea },
      { label: 'Drama, yearbook, band, or art club', value: 'arts' as InterestArea },
      { label: 'Community service, peer counseling, or Key Club', value: 'social' as InterestArea },
      { label: 'Mock trial, student government, or Model UN', value: 'law' as InterestArea },
      { label: 'Engineering club, woodshop, or automotive tech', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'When you read the news, which stories grab your attention?',
    options: [
      { label: 'New tech breakthroughs, AI, or space exploration', value: 'stem' as InterestArea },
      { label: 'Medical discoveries, mental health, or public health crises', value: 'healthcare' as InterestArea },
      { label: 'The economy, startups, or corporate news', value: 'business' as InterestArea },
      { label: 'Culture, film, music, or social trends', value: 'arts' as InterestArea },
      { label: 'Education, poverty, or social justice', value: 'social' as InterestArea },
      { label: 'Crime, court decisions, or political scandals', value: 'law' as InterestArea },
      { label: 'Infrastructure, climate tech, or construction projects', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which skill do you most want to develop in college?',
    options: [
      { label: 'Advanced math, programming, or scientific reasoning', value: 'stem' as InterestArea },
      { label: 'Anatomy, pharmacology, or patient care', value: 'healthcare' as InterestArea },
      { label: 'Finance, strategy, or entrepreneurship', value: 'business' as InterestArea },
      { label: 'Storytelling, visual communication, or performance', value: 'arts' as InterestArea },
      { label: 'Research methods, counseling, or community organizing', value: 'social' as InterestArea },
      { label: 'Legal reasoning, rhetoric, or policy analysis', value: 'law' as InterestArea },
      { label: 'CAD, fabrication, or systems engineering', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'What does "meaningful work" mean to you?',
    options: [
      { label: 'Solving hard technical problems that push human knowledge forward', value: 'stem' as InterestArea },
      { label: 'Directly improving someone\'s physical or mental health', value: 'healthcare' as InterestArea },
      { label: 'Creating value, building something profitable, or leading a team', value: 'business' as InterestArea },
      { label: 'Expressing yourself and connecting with an audience', value: 'arts' as InterestArea },
      { label: 'Helping people navigate difficult life circumstances', value: 'social' as InterestArea },
      { label: 'Fighting for fairness and holding power accountable', value: 'law' as InterestArea },
      { label: 'Making things that are reliable, efficient, and well-built', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which of these challenges sounds most compelling to you?',
    options: [
      { label: 'Making AI smarter or renewable energy more efficient', value: 'stem' as InterestArea },
      { label: 'Reducing health disparities or finding a cure for a disease', value: 'healthcare' as InterestArea },
      { label: 'Scaling a startup to its first million customers', value: 'business' as InterestArea },
      { label: 'Creating a film, album, or novel that resonates with millions', value: 'arts' as InterestArea },
      { label: 'Designing a program that breaks a cycle of poverty', value: 'social' as InterestArea },
      { label: 'Reforming a law that causes real harm', value: 'law' as InterestArea },
      { label: 'Designing a bridge, factory, or power grid from scratch', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'What conversations energize you?',
    options: [
      { label: "How things work — algorithms, experiments, systems", value: 'stem' as InterestArea },
      { label: 'The human body, mental health, and wellness habits', value: 'healthcare' as InterestArea },
      { label: 'Money, startups, strategy, and what makes companies succeed', value: 'business' as InterestArea },
      { label: 'Movies, music, trends, and what makes something beautiful', value: 'arts' as InterestArea },
      { label: 'Social issues, relationships, and how people grow', value: 'social' as InterestArea },
      { label: 'Current events, ethics, who has power, and what\'s fair', value: 'law' as InterestArea },
      { label: 'How buildings are made, how machines work, or green tech', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'When a friend needs help, what do you most naturally offer?',
    options: [
      { label: 'Help troubleshooting their computer, phone, or a math problem', value: 'stem' as InterestArea },
      { label: 'Advice on symptoms, medications, or healthy habits', value: 'healthcare' as InterestArea },
      { label: 'A plan, spreadsheet, or strategy to fix their situation', value: 'business' as InterestArea },
      { label: 'A playlist, movie, or creative outlet to help them decompress', value: 'arts' as InterestArea },
      { label: 'A listening ear and emotional support', value: 'social' as InterestArea },
      { label: 'Help understanding their rights or thinking through a dispute', value: 'law' as InterestArea },
      { label: 'Physical help — fixing something, building something, moving', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'How do you feel about working with numbers?',
    options: [
      { label: "I love it — numbers are how I understand the world", value: 'stem' as InterestArea },
      { label: "I use them when I need to, like reading lab values or dosages", value: 'healthcare' as InterestArea },
      { label: "I'm comfortable with financial data and business metrics", value: 'business' as InterestArea },
      { label: "I prefer color, proportion, and rhythm to formulas", value: 'arts' as InterestArea },
      { label: "I use statistics to understand people and society", value: 'social' as InterestArea },
      { label: "I'd rather work with words and arguments than numbers", value: 'law' as InterestArea },
      { label: "I work with measurements, tolerances, and physical specs", value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which best describes how you like to spend your mental energy?',
    options: [
      { label: 'Abstract thinking — proofs, models, algorithms', value: 'stem' as InterestArea },
      { label: 'Understanding living systems — cells, bodies, behavior', value: 'healthcare' as InterestArea },
      { label: 'Strategic thinking — planning, persuading, optimizing', value: 'business' as InterestArea },
      { label: 'Imaginative thinking — inventing, expressing, reimagining', value: 'arts' as InterestArea },
      { label: 'Empathic thinking — understanding perspectives and dynamics', value: 'social' as InterestArea },
      { label: 'Critical thinking — questioning assumptions and finding flaws', value: 'law' as InterestArea },
      { label: 'Practical thinking — figuring out how to make things work', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Where do you see yourself at 35?',
    options: [
      { label: 'Leading an R&D team, running a tech company, or doing research', value: 'stem' as InterestArea },
      { label: 'Practicing medicine, running a clinic, or working in public health', value: 'healthcare' as InterestArea },
      { label: 'Managing a business, leading a finance team, or founding a startup', value: 'business' as InterestArea },
      { label: 'Working as an artist, designer, writer, or creative director', value: 'arts' as InterestArea },
      { label: 'Directing a nonprofit, teaching, or working as a counselor', value: 'social' as InterestArea },
      { label: 'Practicing law, working in government, or shaping policy', value: 'law' as InterestArea },
      { label: 'Leading engineering projects, contracting, or in skilled trades', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which best describes your relationship with rules and systems?',
    options: [
      { label: 'I enjoy understanding systems well enough to improve or automate them', value: 'stem' as InterestArea },
      { label: 'I follow protocols carefully because people\'s health depends on it', value: 'healthcare' as InterestArea },
      { label: 'I use rules strategically — knowing the game helps me win it', value: 'business' as InterestArea },
      { label: 'I sometimes break the rules to make something more authentic', value: 'arts' as InterestArea },
      { label: 'I think about whether rules are fair and who they affect', value: 'social' as InterestArea },
      { label: 'I study rules closely so I can challenge or apply them precisely', value: 'law' as InterestArea },
      { label: 'I follow specs and codes because precision is non-negotiable', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which phrase resonates with you most?',
    options: [
      { label: '"If you can measure it, you can improve it."', value: 'stem' as InterestArea },
      { label: '"First, do no harm."', value: 'healthcare' as InterestArea },
      { label: '"Think big, move fast, create value."', value: 'business' as InterestArea },
      { label: '"Make something that didn\'t exist before."', value: 'arts' as InterestArea },
      { label: '"No one should be left behind."', value: 'social' as InterestArea },
      { label: '"Equal justice under law."', value: 'law' as InterestArea },
      { label: '"Build it right the first time."', value: 'trades' as InterestArea },
    ],
  },
  {
    q: 'Which type of college course would you most enjoy?',
    options: [
      { label: 'Algorithms, physics, or organic chemistry', value: 'stem' as InterestArea },
      { label: 'Anatomy, microbiology, or abnormal psychology', value: 'healthcare' as InterestArea },
      { label: 'Marketing, accounting, or entrepreneurship', value: 'business' as InterestArea },
      { label: 'Film theory, studio art, or creative writing workshop', value: 'arts' as InterestArea },
      { label: 'Sociology, developmental psychology, or urban studies', value: 'social' as InterestArea },
      { label: 'Constitutional law, political philosophy, or ethics', value: 'law' as InterestArea },
      { label: 'Statics, thermodynamics, or manufacturing processes', value: 'trades' as InterestArea },
    ],
  },
] as const;

const INTEREST_LABELS: Record<InterestArea, string> = {
  stem: 'STEM (Science, Technology, Engineering & Math)',
  healthcare: 'Healthcare & Medicine',
  business: 'Business & Finance',
  arts: 'Arts, Design & Media',
  social: 'Social Sciences & Education',
  law: 'Law, Policy & Government',
  trades: 'Engineering & Skilled Trades',
};

function scoreInterestQuiz(answers: Record<number, InterestArea>): { area: InterestArea; count: number }[] {
  const counts: Record<InterestArea, number> = { stem: 0, healthcare: 0, business: 0, arts: 0, social: 0, law: 0, trades: 0 };
  Object.values(answers).forEach(a => counts[a]++);
  return (Object.keys(counts) as InterestArea[])
    .map(k => ({ area: k, count: counts[k] }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
}

interface CollegeEntry {
  name: string;
  location: string;
  variant: 'reach' | 'target' | 'safety';
}

interface CollegesData {
  majorAnswers: { salaryGoal: string; interestArea: string };
  collegeList: CollegeEntry[];
  aiRecommendations: Record<string, string>;
}

const DEFAULT_DATA: CollegesData = { majorAnswers: { salaryGoal: '', interestArea: '' }, collegeList: [], aiRecommendations: {} };

export default function Colleges() {
  const [data, setData] = useState<CollegesData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [addingCollege, setAddingCollege] = useState(false);
  const [newCollege, setNewCollege] = useState({ name: '', location: '', variant: 'target' as CollegeEntry['variant'] });
  const [whyUsLoading, setWhyUsLoading] = useState<Record<number, boolean>>({});
  const [whyUsText, setWhyUsText] = useState<Record<number, string>>({});
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, InterestArea>>({});
  const [quizResult, setQuizResult] = useState<{ area: InterestArea; count: number }[] | null>(null);
  const [collegeRecLoading, setCollegeRecLoading] = useState(false);
  const [collegeRecText, setCollegeRecText] = useState('');
  const [collegeRecError, setCollegeRecError] = useState('');

  // College match quiz
  const [matchQuizOpen, setMatchQuizOpen] = useState(false);
  const [matchQuizAnswers, setMatchQuizAnswers] = useState<Record<string, string>>({});
  const [matchLocation, setMatchLocation] = useState('');
  const [matchQuizDone, setMatchQuizDone] = useState(false);
  const [actGpa, setActGpa] = useState('');
  const [actSat, setActSat] = useState('');
  const [actAct, setActAct] = useState('');
  const [matchRecLoading, setMatchRecLoading] = useState(false);
  const [matchRecText, setMatchRecText] = useState('');
  const [matchRecError, setMatchRecError] = useState('');

  useEffect(() => {
    fetch('/api/student/colleges', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
    // Load academic stats from Activities & Courses
    fetch('/api/student/activities', { credentials: 'include' })
      .then(r => r.json())
      .then(d => {
        const raw = d?.interests;
        if (raw && typeof raw === 'object') {
          if (raw.gpa) setActGpa(raw.gpa);
          if (raw.sat) setActSat(raw.sat);
          if (raw.act) setActAct(raw.act);
        }
      })
      .catch(() => {});
  }, []);

  function save(updated: CollegesData) {
    setData(updated);
    fetch('/api/student/colleges', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  function updateMajorAnswers(field: 'salaryGoal' | 'interestArea', value: string) {
    setData(prev => ({ ...prev, majorAnswers: { ...prev.majorAnswers, [field]: value } }));
  }

  function saveMajorAnswers() { save(data); }

  function addCollege() {
    const name = newCollege.name.trim();
    if (!name) return;
    save({ ...data, collegeList: [...data.collegeList, { ...newCollege, name }] });
    setNewCollege({ name: '', location: '', variant: 'target' });
    setAddingCollege(false);
  }

  async function getWhyUs(index: number, collegeName: string) {
    setWhyUsLoading(prev => ({ ...prev, [index]: true }));
    try {
      const res = await fetch('/api/ai/colleges/whyus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ college: collegeName }),
      });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setWhyUsText(prev => ({ ...prev, [index]: result }));
    } catch {
      setWhyUsText(prev => ({ ...prev, [index]: 'Could not generate content — please try again.' }));
    } finally {
      setWhyUsLoading(prev => ({ ...prev, [index]: false }));
    }
  }

  function removeCollege(index: number) {
    save({ ...data, collegeList: data.collegeList.filter((_, i) => i !== index) });
  }

  function submitQuiz() {
    const results = scoreInterestQuiz(quizAnswers);
    setQuizResult(results);
    const label = results.map(r => INTEREST_LABELS[r.area]).join(', ');
    save({ ...data, majorAnswers: { ...data.majorAnswers, interestArea: label } });
  }

  function resetQuiz() {
    setQuizOpen(false);
    setQuizAnswers({});
    setQuizResult(null);
  }

  async function getMatchRecommendations() {
    setMatchRecLoading(true);
    setMatchRecError('');
    try {
      const res = await fetch('/api/ai/colleges/recommendcolleges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ matchQuizAnswers, location: matchLocation }),
      });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setMatchRecText(result);
    } catch {
      setMatchRecError('Could not generate recommendations — please try again.');
    } finally {
      setMatchRecLoading(false);
    }
  }

  async function getCollegeRecommendations() {
    setCollegeRecLoading(true);
    setCollegeRecError('');
    try {
      const res = await fetch('/api/ai/colleges/recommendcolleges', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setCollegeRecText(result);
    } catch {
      setCollegeRecError('Could not generate recommendations — please try again.');
    } finally {
      setCollegeRecLoading(false);
    }
  }

  async function getMajorRecommendations() {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/ai/colleges/recommend', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error('Server error');
      const { result } = await res.json();
      setData(prev => ({ ...prev, aiRecommendations: { ...prev.aiRecommendations, majors: result } }));
    } catch {
      setAiError('Could not generate recommendations — please try again.');
    } finally {
      setAiLoading(false);
    }
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const aiText = data.aiRecommendations?.majors;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>College &amp; Major</h1>

      <section className={styles.section}>
        <div className={styles.quizHeader}>
          <h2 className={styles.sectionTitle}>Professional Interest Quiz</h2>
          {!quizOpen && !quizResult && (
            <button className={styles.quizToggle} onClick={() => setQuizOpen(true)}>Take the Quiz</button>
          )}
          {(quizOpen || quizResult) && (
            <button className={styles.quizToggle} onClick={resetQuiz}>Reset</button>
          )}
        </div>
        {quizResult ? (
          <div className={styles.quizResult}>
            <div className={styles.quizResultLabel}>Your top interest areas</div>
            {quizResult.map((r, i) => (
              <div key={r.area} className={styles.quizResultRow}>
                <span className={styles.quizResultRank}>#{i + 1}</span>
                <div className={styles.quizResultBarWrap}>
                  <div className={styles.quizResultBarLabel}>{INTEREST_LABELS[r.area]}</div>
                  <div className={styles.quizResultBar}>
                    <div className={styles.quizResultBarFill} style={{ width: `${Math.round((r.count / INTEREST_QUIZ.length) * 100)}%` }} />
                  </div>
                </div>
                <span className={styles.quizResultPct}>{Math.round((r.count / INTEREST_QUIZ.length) * 100)}%</span>
              </div>
            ))}
            <p className={styles.quizResultDetail}>Results saved — use "Get Major Recommendations" below to see specific majors matched to your profile.</p>
          </div>
        ) : quizOpen ? (
          <div className={styles.quizBody}>
            {INTEREST_QUIZ.map((q, qi) => (
              <div key={qi} className={styles.quizQuestion}>
                <p className={styles.quizQ}>{qi + 1}. {q.q}</p>
                <div className={styles.quizOptions}>
                  {q.options.map(opt => (
                    <label key={opt.value} className={`${styles.quizOption} ${quizAnswers[qi] === opt.value ? styles.quizOptionSelected : ''}`}>
                      <input
                        type="radio"
                        name={`iq${qi}`}
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
              disabled={Object.keys(quizAnswers).length < INTEREST_QUIZ.length}
              onClick={submitQuiz}
            >
              See My Results
            </button>
          </div>
        ) : (
          <p className={styles.placeholder}>Answer 20 questions to discover your top professional interest areas. Your results will be used to generate specific major recommendations.</p>
        )}
      </section>

      {/* College Match Quiz */}
      <section className={styles.section}>
        <div className={styles.quizHeader}>
          <h2 className={styles.sectionTitle}>College Match Quiz</h2>
          {!matchQuizOpen && !matchQuizDone && (
            <button className={styles.quizToggle} onClick={() => setMatchQuizOpen(true)}>Take the Quiz</button>
          )}
          {(matchQuizOpen || matchQuizDone) && (
            <button className={styles.quizToggle} onClick={() => { setMatchQuizOpen(false); setMatchQuizAnswers({}); setMatchQuizDone(false); setMatchRecText(''); }}>Reset</button>
          )}
        </div>
        <p style={{ fontSize: '15px', color: '#374151', margin: '0 0 12px', fontWeight: 700 }}>Answer 8 questions about your preferences and share your location to get college recommendations tailored to you.</p>
        {matchQuizDone ? (
          <div className={styles.quizResult}>
            <div className={styles.quizResultLabel}>Preferences saved</div>
            {(actGpa || actSat || actAct) && (
              <p style={{ fontSize: '15px', color: '#374151', margin: '0 0 10px', fontWeight: 700 }}>
                Academic stats from Activities &amp; Courses: {[actGpa && `GPA ${actGpa}`, actSat && `SAT ${actSat}`, actAct && `ACT ${actAct}`].filter(Boolean).join(' · ')}
              </p>
            )}
            {matchLocation && (
              <p style={{ fontSize: '15px', color: '#374151', margin: '0 0 14px', fontWeight: 700 }}>
                Location: {matchLocation}
              </p>
            )}
            <button
              className={styles.matchRecBtn}
              onClick={getMatchRecommendations}
              disabled={matchRecLoading}
            >
              {matchRecLoading ? 'Generating…' : 'Get My Matched Colleges'}
            </button>
            {matchRecError && <p style={{ color: '#c62828', fontSize: '15px', marginTop: '8px', fontWeight: 700 }}>{matchRecError}</p>}
            {matchRecText && <div style={{ marginTop: '14px' }}><MarkdownOutput>{matchRecText}</MarkdownOutput></div>}
          </div>
        ) : matchQuizOpen ? (
          <div className={styles.quizBody}>
            {COLLEGE_MATCH_QUIZ.map((q) => (
              <div key={q.key} className={styles.quizQuestion}>
                <p className={styles.quizQ}>{q.q}</p>
                <div className={styles.quizOptions}>
                  {q.options.map(opt => (
                    <label key={opt.value} className={`${styles.quizOption} ${matchQuizAnswers[q.key] === opt.value ? styles.quizOptionSelected : ''}`}>
                      <input
                        type="radio"
                        name={`mq_${q.key}`}
                        value={opt.value}
                        checked={matchQuizAnswers[q.key] === opt.value}
                        onChange={() => setMatchQuizAnswers(prev => ({ ...prev, [q.key]: opt.value }))}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <div className={styles.quizQuestion}>
              <p className={styles.quizQ}>Where are you located? (e.g. "California" or "Chicago, IL")</p>
              <input
                className={styles.matchStatInput}
                type="text"
                placeholder="Your city or state"
                value={matchLocation}
                onChange={e => setMatchLocation(e.target.value)}
                style={{ width: '280px' }}
              />
            </div>
            <button
              className={styles.quizSubmit}
              disabled={Object.keys(matchQuizAnswers).length < COLLEGE_MATCH_QUIZ.length}
              onClick={() => { setMatchQuizDone(true); setMatchQuizOpen(false); }}
            >
              Save My Preferences ({Object.keys(matchQuizAnswers).length}/{COLLEGE_MATCH_QUIZ.length} answered)
            </button>
          </div>
        ) : (
          <p className={styles.placeholder}>Answer 8 questions about your college preferences plus your location, and get colleges matched specifically to you.</p>
        )}
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className={styles.sectionTitle}>Recommended Majors</h2>
          <button onClick={getMajorRecommendations} disabled={aiLoading} style={{ background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
            {aiLoading ? 'Generating…' : 'Get Major Recommendations'}
          </button>
        </div>
        <div className={styles.salaryRow}>
          <label className={styles.label}>Salary Goal (annual)</label>
          <input className={styles.salaryInput} type="text" placeholder="e.g. $80,000" value={data.majorAnswers.salaryGoal} onChange={(e) => updateMajorAnswers('salaryGoal', e.target.value)} onBlur={saveMajorAnswers} />
        </div>
        {aiError && <p style={{ color: '#e94560' }}>{aiError}</p>}
        {aiText ? (
          <MarkdownOutput>{aiText}</MarkdownOutput>
        ) : (
          <p style={{ color: '#374151', marginTop: '0.5rem', fontWeight: 700 }}>Complete the interest quiz above and enter a salary goal, then click "Get Major Recommendations" for specific majors matched to your profile.</p>
        )}
      </section>

      <section className={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Recommended Colleges</h2>
          <button
            onClick={getCollegeRecommendations}
            disabled={collegeRecLoading}
            style={{ background: 'linear-gradient(135deg, #0f3460, #1a56db)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.55rem 1.2rem', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(15,52,96,0.3)' }}
          >
            {collegeRecLoading ? 'Generating…' : 'Recommend Colleges For Me'}
          </button>
        </div>
        {collegeRecError && <p style={{ color: '#e94560', fontSize: '13px' }}>{collegeRecError}</p>}
        {collegeRecText ? (
          <MarkdownOutput>{collegeRecText}</MarkdownOutput>
        ) : (
          <p style={{ color: '#374151', fontSize: '15px', background: '#f0f4ff', borderRadius: '6px', padding: '14px 16px', margin: 0, fontWeight: 700 }}>
            Complete the Professional Interest Quiz and enter your salary goal, then click the button to get college recommendations matched to your profile.
          </p>
        )}
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>My College List</h2>
          <span className={styles.goalNote}>Aim for 2–3 reach, 3–4 target, 2–3 safety</span>
        </div>
        <div className={styles.collegeList}>
          {data.collegeList.map((college, i) => (
            <div key={i} className={`${styles.collegeCard} ${whyUsText[i] ? styles.collegeCardExpanded : ''}`}>
              <button className={styles.removeBtn} onClick={() => removeCollege(i)} title="Remove">×</button>
              <div className={styles.collegeName}>{college.name}</div>
              <div className={styles.collegeLocation}>{college.location}</div>
              <div className={styles.variantPicker}>
                {(['reach', 'target', 'safety'] as const).map(v => (
                  <button
                    key={v}
                    className={`${styles.variantBtn} ${styles[`variantBtn_${v}`]} ${college.variant === v ? styles[`variantBtn_${v}_active`] : ''}`}
                    onClick={() => {
                      const updated = data.collegeList.map((c, j) => j === i ? { ...c, variant: v } : c);
                      save({ ...data, collegeList: updated });
                    }}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
              <button
                className={styles.whyUsBtn}
                onClick={() => whyUsText[i] ? setWhyUsText(prev => { const n = { ...prev }; delete n[i]; return n; }) : getWhyUs(i, college.name)}
                disabled={whyUsLoading[i]}
              >
                {whyUsLoading[i] ? 'Loading…' : whyUsText[i] ? 'Hide' : 'Why Us?'}
              </button>
              {whyUsText[i] && (
                <div className={styles.whyUsOutput}>
                  <MarkdownOutput>{whyUsText[i]}</MarkdownOutput>
                </div>
              )}
            </div>
          ))}
          {addingCollege ? (
            <div className={`${styles.collegeCard} ${styles.addFormCard}`}>
              <input
                autoFocus
                className={styles.addInput}
                placeholder="School name"
                value={newCollege.name}
                onChange={e => setNewCollege(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addCollege()}
              />
              <input
                className={styles.addInput}
                placeholder="Location (optional)"
                value={newCollege.location}
                onChange={e => setNewCollege(prev => ({ ...prev, location: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addCollege()}
              />
              <div className={styles.variantPicker}>
                {(['reach', 'target', 'safety'] as const).map(v => (
                  <button
                    key={v}
                    className={`${styles.variantBtn} ${styles[`variantBtn_${v}`]} ${newCollege.variant === v ? styles[`variantBtn_${v}_active`] : ''}`}
                    onClick={() => setNewCollege(prev => ({ ...prev, variant: v }))}
                  >
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
              <div className={styles.addActions}>
                <button className={styles.addConfirmBtn} onClick={addCollege}>Add</button>
                <button className={styles.addCancelBtn} onClick={() => { setAddingCollege(false); setNewCollege({ name: '', location: '', variant: 'target' }); }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className={`${styles.collegeCard} ${styles.addCard}`} onClick={() => setAddingCollege(true)}>
              <span className={styles.addLabel}>+ Add a school</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
