import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudent } from '../../contexts/StudentContext';
import type { Student } from '../../contexts/StudentContext';
import styles from './Auth.module.css';

export default function Login() {
  const { setStudent } = useStudent();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    if (res.ok) {
      const data: Student = await res.json();
      setStudent(data);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.logo}>CollegeNav</div>
      <div className={styles.tagline}>Your personalized college application guide</div>
      <form onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.btn} type="submit">Log In</button>
      </form>
      <div className={styles.footer}>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
