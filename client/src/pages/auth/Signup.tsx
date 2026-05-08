import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStudent } from '../../contexts/StudentContext';
import type { Student } from '../../contexts/StudentContext';
import styles from './Auth.module.css';

export default function Signup() {
  const { setStudent } = useStudent();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', highSchool: '', grade: '9' });
  const [error, setError] = useState('');

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...form, grade: Number(form.grade) }),
    });
    if (res.status === 201) {
      const data: Student = await res.json();
      setStudent(data);
      navigate('/dashboard');
    } else {
      const data = await res.json();
      setError(data.error || 'Signup failed');
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.logo}>CollegeNav</div>
      <div className={styles.tagline}>Your personalized college application guide</div>
      <form onSubmit={handleSubmit}>
        <input className={styles.input} placeholder="Full Name" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        <input className={styles.input} type="email" placeholder="Email Address" value={form.email} onChange={(e) => set('email', e.target.value)} required />
        <input className={styles.input} placeholder="High School Name" value={form.highSchool} onChange={(e) => set('highSchool', e.target.value)} required />
        <select className={styles.input} value={form.grade} onChange={(e) => set('grade', e.target.value)}>
          {[8, 9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
        </select>
        <input className={styles.input} type="password" placeholder="Password (min 8 characters)" value={form.password} onChange={(e) => set('password', e.target.value)} required />
        <div className={styles.tip}>
          <strong>Tip:</strong> We recommend creating a <em>separate email</em> for college apps to keep things organized.
        </div>
        {error && <div className={styles.error}>{error}</div>}
        <button className={styles.btn} type="submit">Create My Account</button>
      </form>
      <div className={styles.footer}>
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </div>
  );
}
