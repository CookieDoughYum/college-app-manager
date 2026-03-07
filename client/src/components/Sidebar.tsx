import { NavLink, useNavigate } from 'react-router-dom';
import { useStudent } from '../contexts/StudentContext';
import styles from './Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Activities & Courses', path: '/activities' },
  { label: 'Exam Prep', path: '/exams' },
  { label: 'College & Major', path: '/colleges' },
  { label: 'Essays', path: '/essays' },
  { label: 'Rec Letters', path: '/recs' },
  { label: 'App Portals', path: '/portals' },
  { label: 'Decide', path: '/decide' },
  { label: 'Financial Aid', path: '/aid' },
  { label: 'Deadlines', path: '/deadlines' },
];

export default function Sidebar() {
  const { setStudent } = useStudent();
  const navigate = useNavigate();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setStudent(null);
    navigate('/login');
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>CollegeNav</div>
      <nav className={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <button className={styles.logoutBtn} onClick={handleLogout}>
        Log Out
      </button>
    </aside>
  );
}
