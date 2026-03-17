import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './OnboardingOverlay.module.css';

const ONBOARDING_KEY = 'collegenav_onboarded';

export default function OnboardingOverlay({ grade }: { grade: number }) {
  const [visible, setVisible] = useState(!localStorage.getItem(ONBOARDING_KEY));

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <h2>Welcome to CollegeNav!</h2>
        <p>Here's where to start for Grade {grade}:</p>
        <ul>
          <li>Set up your <strong>Activities</strong> and interests</li>
          <li>Check out <strong>Exam Prep</strong> for SAT/ACT guidance</li>
          <li>Add schools to your <strong>College List</strong></li>
        </ul>
        <div className={styles.actions}>
          <Link to="/activities" className={styles.primaryBtn} onClick={dismiss}>
            Start with Activities →
          </Link>
          <button className={styles.secondaryBtn} onClick={dismiss}>Got it</button>
        </div>
      </div>
    </div>
  );
}
