import { useEffect, useState } from 'react';
import styles from './adminTable.module.css';

interface TableMeta {
  name: string;
  rowCount: number;
}

interface Column {
  name: string;
  type: string;
  nullable: boolean;
}

interface TableData {
  columns: Column[];
  rows: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

function CellValue({ value }: { value: unknown }) {
  if (value === null) return <span className={styles.null}>null</span>;
  if (typeof value === 'object') {
    return (
      <details>
        <summary style={{ cursor: 'pointer', color: '#4f46e5', fontSize: 12, fontWeight: 700 }}>JSON</summary>
        <pre style={{ fontSize: 11.5, maxWidth: 400, overflow: 'auto', margin: '6px 0 0', background: '#f7f9ff', borderRadius: 6, padding: '8px 10px', color: '#374151' }}>
          {JSON.stringify(value, null, 2)}
        </pre>
      </details>
    );
  }
  return <>{String(value)}</>;
}

export default function DatabaseViewer() {
  const [tables, setTables] = useState<TableMeta[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/db/tables')
      .then((r) => r.json())
      .then(setTables)
      .catch(() => setError('Failed to load tables'));
  }, []);

  useEffect(() => {
    if (!selected) { setTableData(null); return; }
    setLoading(true);
    fetch(`/api/admin/db/tables/${encodeURIComponent(selected)}?page=${page}&limit=50`)
      .then((r) => r.json())
      .then((d) => { setTableData(d); setLoading(false); })
      .catch(() => { setError('Failed to load table data'); setLoading(false); });
  }, [selected, page]);

  if (error) return <div style={{ color: '#dc2626', padding: 16 }}>{error}</div>;

  const totalPages = tableData ? Math.ceil(tableData.total / tableData.limit) : 0;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Database</h1>

      <div style={{ display: 'flex', gap: 28 }}>
        {/* Table list */}
        <div style={{ minWidth: 200, flexShrink: 0 }}>
          <h3 style={{ margin: '0 0 10px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b7280' }}>Tables</h3>
          {tables.map((t) => (
            <div
              key={t.name}
              onClick={() => { setSelected(t.name); setPage(1); }}
              style={{
                padding: '9px 13px',
                cursor: 'pointer',
                background: selected === t.name ? '#eef2ff' : 'transparent',
                borderRadius: 7,
                marginBottom: 3,
                borderLeft: selected === t.name ? '3px solid #4f46e5' : '3px solid transparent',
                transition: 'background 0.12s',
              }}
            >
              <strong style={{ fontSize: 13.5, color: selected === t.name ? '#3730a3' : '#1e293b' }}>{t.name}</strong>
              <span className={styles.countBadge}>{t.rowCount}</span>
              {t.name === '_prisma_migrations' && (
                <div style={{ color: '#9ca3af', fontSize: 11, marginTop: 1 }}>internal</div>
              )}
            </div>
          ))}
        </div>

        {/* Record viewer */}
        <div style={{ flex: 1, overflow: 'auto', minWidth: 0 }}>
          {!selected && <p className={styles.empty}>Select a table to view its records.</p>}
          {selected && loading && <p style={{ color: '#6b7280', fontStyle: 'italic' }}>Loading…</p>}
          {selected && tableData && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>{selected}</h3>
                <span className={styles.countBadge}>{tableData.total} row{tableData.total !== 1 ? 's' : ''}</span>
              </div>

              {tableData.rows.length === 0 ? (
                <p className={styles.empty}>No records in this table.</p>
              ) : (
                <div className={styles.wrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {tableData.columns.map((col) => (
                          <th key={col.name}>
                            {col.name}
                            <span className={styles.typeTag}>{col.type}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.rows.map((row, i) => (
                        <tr key={i}>
                          {tableData.columns.map((col) => (
                            <td key={col.name}>
                              <CellValue value={row[col.name]} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button className={styles.pageBtn} disabled={page <= 1} onClick={() => setPage(page - 1)}>← Prev</button>
                  <span>Page {page} of {totalPages}</span>
                  <button className={styles.pageBtn} disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
