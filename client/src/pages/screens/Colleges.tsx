import { useState, useEffect } from 'react';
import TagChip from '../../components/TagChip';
import BadgeLabel from '../../components/BadgeLabel';
import styles from './Colleges.module.css';

interface CollegeEntry {
  name: string;
  location: string;
  variant: 'reach' | 'target' | 'safety';
}

interface CollegesData {
  majorAnswers: { salaryGoal: string; interestArea: string };
  collegeList: CollegeEntry[];
}

const DEFAULT_DATA: CollegesData = { majorAnswers: { salaryGoal: '', interestArea: '' }, collegeList: [] };

const RECOMMENDED_MAJORS = ['Computer Science', 'Biomedical Eng.', 'Data Science'];

export default function Colleges() {
  const [data, setData] = useState<CollegesData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/student/colleges', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(d ?? DEFAULT_DATA); setLoading(false); })
      .catch(() => setLoading(false));
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
    const updated = { ...data, majorAnswers: { ...data.majorAnswers, [field]: value } };
    setData(updated);
  }

  function saveMajorAnswers() {
    save(data);
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>College &amp; Major</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Major Questionnaire</h2>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label className={styles.label}>Salary Goal (annual)</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. $80,000"
              value={data.majorAnswers.salaryGoal}
              onChange={(e) => updateMajorAnswers('salaryGoal', e.target.value)}
              onBlur={saveMajorAnswers}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Professional Interest Area</label>
            <input
              className={styles.input}
              type="text"
              placeholder="e.g. Healthcare, Engineering"
              value={data.majorAnswers.interestArea}
              onChange={(e) => updateMajorAnswers('interestArea', e.target.value)}
              onBlur={saveMajorAnswers}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recommended Majors</h2>
        <div className={styles.chipRow}>
          {RECOMMENDED_MAJORS.map((major) => (
            <TagChip key={major} label={major} selected={false} onClick={() => {}} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>My College List</h2>
          <span className={styles.goalNote}>Aim for 2–3 reach, 3–4 target, 2–3 safety</span>
        </div>
        <div className={styles.collegeList}>
          {data.collegeList.map((college) => (
            <div key={college.name} className={styles.collegeCard}>
              <div className={styles.collegeName}>{college.name}</div>
              <div className={styles.collegeLocation}>{college.location}</div>
              <BadgeLabel variant={college.variant} label={college.variant.charAt(0).toUpperCase() + college.variant.slice(1)} />
            </div>
          ))}
          <div className={`${styles.collegeCard} ${styles.addCard}`}>
            <span className={styles.addLabel}>+ Add a school</span>
          </div>
        </div>
      </section>
    </div>
  );
}
