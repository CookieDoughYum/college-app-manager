import { useState, useEffect } from 'react';
import ChecklistItem from '../../components/ChecklistItem';
import TagChip from '../../components/TagChip';
import styles from './FinancialAid.module.css';

const PROFILE_TAGS = ['First-gen', 'STEM', 'California resident', 'Community service'];

const SCHOLARSHIPS = [
  { name: 'Gates Scholarship', amount: 'Up to full cost', deadline: 'September 15', deadlineVariant: 'red' as const },
  { name: 'Dell Scholars Program', amount: '$20,000 total', deadline: 'December 1', deadlineVariant: 'amber' as const },
  { name: 'Local Community Foundation', amount: 'Varies', deadline: 'March 1', deadlineVariant: 'green' as const },
];

const BADGE_STYLES: Record<string, string> = {
  red: styles.badgeRed,
  amber: styles.badgeAmber,
  green: styles.badgeGreen,
};

const FAFSA_KEYS = ['fafsa', 'css'];
const FAFSA_ITEMS = [
  { key: 'fafsa', label: 'Parents/guardian completed FAFSA', subtext: 'studentaid.gov — opens October 1' },
  { key: 'css', label: 'Parents/guardian completed CSS Profile', subtext: 'cssprofile.collegeboard.org — required by many private colleges' },
];

interface FinancialAidData {
  fafsaChecklist: Record<string, boolean>;
  scholarshipAnswers: Record<string, boolean>;
}

const DEFAULT_DATA: FinancialAidData = { fafsaChecklist: {}, scholarshipAnswers: {} };

export default function FinancialAid() {
  const [data, setData] = useState<FinancialAidData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Financial Aid</h1>

      <div className={styles.warningBox}>
        ⚠ FAFSA opens October 1. File as early as possible — some aid is first-come, first-served.
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>FAFSA &amp; CSS Checklist</h2>
        {FAFSA_ITEMS.map((item) => (
          <ChecklistItem
            key={item.key}
            checked={data.fafsaChecklist[item.key] ?? false}
            label={item.label}
            subtext={item.subtext}
            onChange={(checked) => toggleFafsa(item.key, checked)}
          />
        ))}
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recommended Scholarships</h2>
        <p className={styles.profileNote}>Based on your profile:</p>
        <div className={styles.chipRow}>
          {PROFILE_TAGS.map((tag) => {
            const key = tag.toLowerCase().replace(/\s+/g, '_');
            return (
              <TagChip
                key={tag}
                label={tag}
                selected={data.scholarshipAnswers[key] ?? false}
                onClick={() => toggleScholarshipTag(tag)}
              />
            );
          })}
        </div>
        <div className={styles.scholarshipList}>
          {SCHOLARSHIPS.map((s) => (
            <div key={s.name} className={styles.scholarshipCard}>
              <div className={styles.scholarshipName}>{s.name}</div>
              <div className={styles.scholarshipAmount}>{s.amount}</div>
              <span className={`${styles.deadlineBadge} ${BADGE_STYLES[s.deadlineVariant]}`}>
                Deadline: {s.deadline}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
