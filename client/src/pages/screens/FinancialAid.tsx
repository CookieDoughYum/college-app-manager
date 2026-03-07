import { useState } from 'react';
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

export default function FinancialAid() {
  const [fafsaDone, setFafsaDone] = useState(false);
  const [cssDone, setCssDone] = useState(false);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Financial Aid</h1>

      <div className={styles.warningBox}>
        ⚠ FAFSA opens October 1. File as early as possible — some aid is first-come, first-served.
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>FAFSA &amp; CSS Checklist</h2>
        <ChecklistItem
          checked={fafsaDone}
          label="Parents/guardian completed FAFSA"
          subtext="studentaid.gov — opens October 1"
          onChange={setFafsaDone}
        />
        <ChecklistItem
          checked={cssDone}
          label="Parents/guardian completed CSS Profile"
          subtext="cssprofile.collegeboard.org — required by many private colleges"
          onChange={setCssDone}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recommended Scholarships</h2>
        <p className={styles.profileNote}>Based on your profile:</p>
        <div className={styles.chipRow}>
          {PROFILE_TAGS.map((tag) => (
            <TagChip key={tag} label={tag} selected={true} onClick={() => {}} />
          ))}
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
