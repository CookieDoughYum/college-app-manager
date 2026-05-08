import { useEffect, useState } from 'react';
import styles from './adminTable.module.css';

interface SessionInfo {
  sid: string;
  expire: string;
  isAdmin: boolean;
  hasUser: boolean;
  provider: string | null;
}

export default function SessionViewer() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadSessions = () => {
    setLoading(true);
    fetch('/api/admin/sessions')
      .then((r) => r.json())
      .then((data) => { setSessions(data); setLoading(false); })
      .catch(() => { setError('Failed to load sessions'); setLoading(false); });
  };

  useEffect(() => { loadSessions(); }, []);

  if (error) return <div style={{ color: '#dc2626', padding: 16 }}>{error}</div>;

  const isExpiringSoon = (expire: string) => {
    const diff = new Date(expire).getTime() - Date.now();
    return diff > 0 && diff < 60 * 60 * 1000;
  };

  const formatExpiry = (expire: string) => new Date(expire).toLocaleString();

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h1 style={{ margin: 0 }}>Sessions</h1>
          {sessions.length > 0 && (
            <span className={styles.countBadge}>{sessions.length} active</span>
          )}
        </div>
        <button className={styles.refreshBtn} onClick={loadSessions} disabled={loading}>
          {loading ? 'Loading…' : '↻ Refresh'}
        </button>
      </div>

      {sessions.length === 0 && !loading ? (
        <p className={styles.empty}>No active sessions.</p>
      ) : (
        <div className={styles.wrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Role</th>
                <th>User</th>
                <th>Expires</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.sid} className={isExpiringSoon(s.expire) ? styles.expiringRow : ''}>
                  <td className={styles.mono}>{s.sid.slice(0, 20)}…</td>
                  <td>
                    {s.isAdmin ? (
                      <span className={`${styles.badge} ${styles.badgeAdmin}`}>Admin</span>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td>
                    {s.hasUser ? (
                      <span>
                        {s.provider && (
                          <span className={`${styles.badge} ${styles.badgeProvider}`} style={{ marginRight: 6 }}>
                            {s.provider}
                          </span>
                        )}
                        Authenticated
                      </span>
                    ) : (
                      <span style={{ color: '#9ca3af' }}>Anonymous</span>
                    )}
                  </td>
                  <td style={{ color: isExpiringSoon(s.expire) ? '#c2410c' : 'inherit' }}>
                    {formatExpiry(s.expire)}
                    {isExpiringSoon(s.expire) && (
                      <span className={styles.expiring}>⚠ expiring soon</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
