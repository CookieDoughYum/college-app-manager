import { NavLink, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', minGrade: 8 },
  { label: 'Activities & Courses', path: '/activities', minGrade: 8 },
  { label: 'Exam Prep', path: '/exams', minGrade: 8 },
  { label: 'College & Major', path: '/colleges', minGrade: 10 },
  { label: 'Essays', path: '/essays', minGrade: 11 },
  { label: 'Writing Activities', path: '/app-activities', minGrade: 11 },
  { label: 'Rec Letters', path: '/recs', minGrade: 11 },
  { label: 'Financial Aid', path: '/aid', minGrade: 11 },
  { label: 'Deadlines', path: '/deadlines', minGrade: 11 },
  { label: 'App Portals', path: '/portals', minGrade: 12 },
  { label: 'Decide', path: '/decide', minGrade: 12 },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const { student, setStudent } = useStudent();
  const navigate = useNavigate();
  const grade = student?.grade ?? 12;

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setStudent(null);
    navigate('/login');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        CollegeNav
        {onClose && (
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">✕</button>
        )}
      </div>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const locked = item.minGrade > grade;
          return locked ? (
            <span
              key={item.path}
              className={`${styles.navItem} ${styles.locked}`}
              title={`Unlocks in Grade ${item.minGrade}`}
            >
              {item.label}
            </span>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
              }
              onClick={onClose}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        Log Out
      </button>
    </aside>
  );
}
