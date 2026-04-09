import { useState, useEffect } from 'react';
import styles from './Portals.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────

type PlatformStatus = 'Not Started' | 'In Progress' | 'Submitted';
type SchoolStatus = 'Not Accessed' | 'Checking' | 'Decision Pending' | 'Accepted' | 'Waitlisted' | 'Denied' | 'Enrolled';

interface Platform {
  key: string;      // 'commonapp' | 'uc' | 'csu' | 'coalition' | 'custom_N'
  name: string;
  url: string;
  status: PlatformStatus;
}

interface SchoolPortal {
  school: string;
  url: string;
  status: SchoolStatus;
}

interface PortalsData {
  platforms: Platform[];
  schoolPortals: SchoolPortal[];
}

// ── Presets ───────────────────────────────────────────────────────────────────

const PLATFORM_PRESETS: Omit<Platform, 'status'>[] = [
  { key: 'commonapp',  name: 'Common App',       url: 'https://www.commonapp.org/' },
  { key: 'uc',         name: 'UC Application',   url: 'https://apply.universityofcalifornia.edu/' },
  { key: 'csu',        name: 'CSU Apply',         url: 'https://www.calstate.edu/apply' },
  { key: 'coalition',  name: 'Coalition App',     url: 'https://www.mycoalition.org/' },
];

const PLATFORM_STATUSES: PlatformStatus[] = ['Not Started', 'In Progress', 'Submitted'];
const SCHOOL_STATUSES: SchoolStatus[] = ['Not Accessed', 'Checking', 'Decision Pending', 'Accepted', 'Waitlisted', 'Denied', 'Enrolled'];

const DEFAULT_DATA: PortalsData = { platforms: [], schoolPortals: [] };

const PLATFORM_STATUS_STYLE: Record<PlatformStatus, string> = {
  'Not Started': styles.statusNotStarted,
  'In Progress': styles.statusInProgress,
  'Submitted':   styles.statusSubmitted,
};

const SCHOOL_STATUS_STYLE: Record<SchoolStatus, string> = {
  'Not Accessed':      styles.statusNotStarted,
  'Checking':          styles.statusInProgress,
  'Decision Pending':  styles.statusPending,
  'Accepted':          styles.statusAccepted,
  'Waitlisted':        styles.statusWaitlisted,
  'Denied':            styles.statusDenied,
  'Enrolled':          styles.statusEnrolled,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function migrate(raw: unknown): PortalsData {
  if (!raw || typeof raw !== 'object') return DEFAULT_DATA;
  const d = raw as Record<string, unknown>;
  // Existing format had a flat `portals` array — migrate it to platforms
  if (Array.isArray(d.portals) && !d.platforms) {
    return {
      platforms: (d.portals as Platform[]).map((p, i) => ({ ...p, key: `custom_${i}` })),
      schoolPortals: [],
    };
  }
  return {
    platforms: Array.isArray(d.platforms) ? d.platforms : [],
    schoolPortals: Array.isArray(d.schoolPortals) ? d.schoolPortals : [],
  };
}

function nextCustomKey(platforms: Platform[]): string {
  const nums = platforms
    .map(p => p.key.match(/^custom_(\d+)$/)?.[1])
    .filter(Boolean)
    .map(Number);
  return `custom_${nums.length ? Math.max(...nums) + 1 : 0}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function Portals() {
  const [data, setData] = useState<PortalsData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);

  // Platform editing
  const [editPlatformKey, setEditPlatformKey] = useState<string | null>(null);
  const [platformDraft, setPlatformDraft] = useState<Platform | null>(null);

  // School portal editing
  const [editSchoolIndex, setEditSchoolIndex] = useState<number | null>(null);
  const [schoolDraft, setSchoolDraft] = useState<SchoolPortal | null>(null);
  const [addingSchool, setAddingSchool] = useState(false);
  const [newSchool, setNewSchool] = useState<SchoolPortal>({ school: '', url: '', status: 'Not Accessed' });

  useEffect(() => {
    fetch('/api/student/portals', { credentials: 'include' })
      .then(r => r.json())
      .then(d => { setData(migrate(d)); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function save(updated: PortalsData) {
    setData(updated);
    fetch('/api/student/portals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updated),
    });
  }

  // ── Platform actions ──

  function addPreset(preset: Omit<Platform, 'status'>) {
    if (data.platforms.find(p => p.key === preset.key)) return;
    save({ ...data, platforms: [...data.platforms, { ...preset, status: 'Not Started' }] });
  }

  function addCustomPlatform() {
    const key = nextCustomKey(data.platforms);
    const p: Platform = { key, name: '', url: '', status: 'Not Started' };
    const updated = { ...data, platforms: [...data.platforms, p] };
    save(updated);
    setEditPlatformKey(key);
    setPlatformDraft(p);
  }

  function startEditPlatform(p: Platform) {
    setEditPlatformKey(p.key);
    setPlatformDraft({ ...p });
    setAddingSchool(false);
    setEditSchoolIndex(null);
  }

  function savePlatformEdit() {
    if (!platformDraft) return;
    save({ ...data, platforms: data.platforms.map(p => p.key === platformDraft.key ? platformDraft : p) });
    setEditPlatformKey(null);
    setPlatformDraft(null);
  }

  function deletePlatform(key: string) {
    save({ ...data, platforms: data.platforms.filter(p => p.key !== key) });
    if (editPlatformKey === key) { setEditPlatformKey(null); setPlatformDraft(null); }
  }

  function cyclePlatformStatus(key: string) {
    save({
      ...data,
      platforms: data.platforms.map(p => {
        if (p.key !== key) return p;
        const next = PLATFORM_STATUSES[(PLATFORM_STATUSES.indexOf(p.status) + 1) % PLATFORM_STATUSES.length];
        return { ...p, status: next };
      }),
    });
  }

  // ── School portal actions ──

  function addSchoolPortal() {
    if (!newSchool.school.trim()) return;
    save({ ...data, schoolPortals: [...data.schoolPortals, { ...newSchool }] });
    setAddingSchool(false);
    setNewSchool({ school: '', url: '', status: 'Not Accessed' });
  }

  function startEditSchool(i: number) {
    setEditSchoolIndex(i);
    setSchoolDraft({ ...data.schoolPortals[i] });
    setAddingSchool(false);
    setEditPlatformKey(null);
    setPlatformDraft(null);
  }

  function saveSchoolEdit() {
    if (!schoolDraft || editSchoolIndex === null) return;
    save({ ...data, schoolPortals: data.schoolPortals.map((s, i) => i === editSchoolIndex ? schoolDraft : s) });
    setEditSchoolIndex(null);
    setSchoolDraft(null);
  }

  function deleteSchool(i: number) {
    save({ ...data, schoolPortals: data.schoolPortals.filter((_, idx) => idx !== i) });
    if (editSchoolIndex === i) { setEditSchoolIndex(null); setSchoolDraft(null); }
  }

  function cycleSchoolStatus(i: number) {
    save({
      ...data,
      schoolPortals: data.schoolPortals.map((s, idx) => {
        if (idx !== i) return s;
        const next = SCHOOL_STATUSES[(SCHOOL_STATUSES.indexOf(s.status) + 1) % SCHOOL_STATUSES.length];
        return { ...s, status: next };
      }),
    });
  }

  if (loading) return <div className={styles.page}><p>Loading…</p></div>;

  const addedKeys = new Set(data.platforms.map(p => p.key));

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>App Portals</h1>

      {/* ── Key Dates ── */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Key Dates</h2>
        <div className={styles.dateCards}>
          <div className={`${styles.dateCard} ${styles.dateCardRed}`}>
            <div className={styles.dateCardTitle}>Common App / UC App</div>
            <p className={styles.dateCardBody}>Opens August 1. Regular Decision deadline: January 1. Early Action/Early Decision: November 1–15.</p>
          </div>
          <div className={`${styles.dateCard} ${styles.dateCardAmber}`}>
            <div className={styles.dateCardTitle}>CSU Application</div>
            <p className={styles.dateCardBody}>Opens October 1. Priority filing period: October 1 – November 30.</p>
          </div>
        </div>
      </section>

      {/* ── Application Platforms ── */}
      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>Application Platforms</h2>
        </div>

        {/* Preset quick-add chips */}
        <div className={styles.presetRow}>
          {PLATFORM_PRESETS.map(preset => (
            <button
              key={preset.key}
              className={addedKeys.has(preset.key) ? styles.presetChipAdded : styles.presetChip}
              onClick={() => addPreset(preset)}
              disabled={addedKeys.has(preset.key)}
            >
              {addedKeys.has(preset.key) ? '✓ ' : '+ '}{preset.name}
            </button>
          ))}
          <button className={styles.presetChip} onClick={addCustomPlatform}>+ Custom</button>
        </div>

        {data.platforms.length === 0 ? (
          <p className={styles.emptyState}>Add the platforms you're using to apply.</p>
        ) : (
          <div className={styles.portalList}>
            {data.platforms.map(p =>
              editPlatformKey === p.key && platformDraft ? (
                <div key={p.key} className={styles.inlineForm}>
                  <input
                    className={styles.formInput}
                    placeholder="Platform name *"
                    value={platformDraft.name}
                    onChange={e => setPlatformDraft({ ...platformDraft, name: e.target.value })}
                    autoFocus
                  />
                  <input
                    className={styles.formInput}
                    placeholder="URL (optional)"
                    value={platformDraft.url}
                    onChange={e => setPlatformDraft({ ...platformDraft, url: e.target.value })}
                  />
                  <select
                    className={styles.formSelect}
                    value={platformDraft.status}
                    onChange={e => setPlatformDraft({ ...platformDraft, status: e.target.value as PlatformStatus })}
                  >
                    {PLATFORM_STATUSES.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <div className={styles.formActions}>
                    <button className={styles.saveBtn} onClick={savePlatformEdit}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => { setEditPlatformKey(null); setPlatformDraft(null); }}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={() => deletePlatform(p.key)}>Delete</button>
                  </div>
                </div>
              ) : (
                <div key={p.key} className={styles.portalCard}>
                  <div className={styles.portalInfo}>
                    <div className={styles.portalName}>{p.name || <span style={{ color: '#aaa' }}>Unnamed platform</span>}</div>
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.portalLink}>
                        {p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                      </a>
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    <span
                      className={`${styles.statusTag} ${PLATFORM_STATUS_STYLE[p.status]}`}
                      onClick={() => cyclePlatformStatus(p.key)}
                      title="Click to advance status"
                      style={{ cursor: 'pointer' }}
                    >
                      {p.status}
                    </span>
                    <button className={styles.editBtn} onClick={() => startEditPlatform(p)}>Edit</button>
                    <button className={styles.deleteIconBtn} onClick={() => deletePlatform(p.key)} title="Delete">×</button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>

      {/* ── School Admission Portals ── */}
      <section className={styles.section}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>School Admission Portals</h2>
          {!addingSchool && (
            <button className={styles.addBtn} onClick={() => { setAddingSchool(true); setEditSchoolIndex(null); setEditPlatformKey(null); setPlatformDraft(null); }}>
              + Add School
            </button>
          )}
        </div>
        <p className={styles.sectionNote}>After submitting, each school gives you a separate portal to check your application status and decisions.</p>

        {addingSchool && (
          <div className={styles.inlineForm}>
            <input
              className={styles.formInput}
              placeholder="School name *"
              value={newSchool.school}
              onChange={e => setNewSchool({ ...newSchool, school: e.target.value })}
              autoFocus
            />
            <input
              className={styles.formInput}
              placeholder="Admission portal URL (optional)"
              value={newSchool.url}
              onChange={e => setNewSchool({ ...newSchool, url: e.target.value })}
            />
            <select
              className={styles.formSelect}
              value={newSchool.status}
              onChange={e => setNewSchool({ ...newSchool, status: e.target.value as SchoolStatus })}
            >
              {SCHOOL_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
            <div className={styles.formActions}>
              <button className={styles.saveBtn} onClick={addSchoolPortal}>Add</button>
              <button className={styles.cancelBtn} onClick={() => { setAddingSchool(false); setNewSchool({ school: '', url: '', status: 'Not Accessed' }); }}>Cancel</button>
            </div>
          </div>
        )}

        {data.schoolPortals.length === 0 && !addingSchool ? (
          <p className={styles.emptyState}>No school portals added yet.</p>
        ) : (
          <div className={styles.portalList}>
            {data.schoolPortals.map((s, i) =>
              editSchoolIndex === i && schoolDraft ? (
                <div key={i} className={styles.inlineForm}>
                  <input
                    className={styles.formInput}
                    placeholder="School name *"
                    value={schoolDraft.school}
                    onChange={e => setSchoolDraft({ ...schoolDraft, school: e.target.value })}
                    autoFocus
                  />
                  <input
                    className={styles.formInput}
                    placeholder="Admission portal URL (optional)"
                    value={schoolDraft.url}
                    onChange={e => setSchoolDraft({ ...schoolDraft, url: e.target.value })}
                  />
                  <select
                    className={styles.formSelect}
                    value={schoolDraft.status}
                    onChange={e => setSchoolDraft({ ...schoolDraft, status: e.target.value as SchoolStatus })}
                  >
                    {SCHOOL_STATUSES.map(st => <option key={st}>{st}</option>)}
                  </select>
                  <div className={styles.formActions}>
                    <button className={styles.saveBtn} onClick={saveSchoolEdit}>Save</button>
                    <button className={styles.cancelBtn} onClick={() => { setEditSchoolIndex(null); setSchoolDraft(null); }}>Cancel</button>
                    <button className={styles.deleteBtn} onClick={() => deleteSchool(i)}>Delete</button>
                  </div>
                </div>
              ) : (
                <div key={i} className={styles.portalCard}>
                  <div className={styles.portalInfo}>
                    <div className={styles.portalName}>{s.school}</div>
                    {s.url && (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.portalLink}>
                        {s.url.replace(/^https?:\/\//, '').replace(/\/$/, '')} ↗
                      </a>
                    )}
                  </div>
                  <div className={styles.cardActions}>
                    <span
                      className={`${styles.statusTag} ${SCHOOL_STATUS_STYLE[s.status]}`}
                      onClick={() => cycleSchoolStatus(i)}
                      title="Click to advance status"
                      style={{ cursor: 'pointer' }}
                    >
                      {s.status}
                    </span>
                    <button className={styles.editBtn} onClick={() => startEditSchool(i)}>Edit</button>
                    <button className={styles.deleteIconBtn} onClick={() => deleteSchool(i)} title="Delete">×</button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
