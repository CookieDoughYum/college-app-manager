import request from 'supertest';

process.env.NODE_ENV = 'test';

// In-memory stores for all models
interface MockStudent {
  id: number; name: string; email: string; passwordHash: string; highSchool: string; grade: number; createdAt: Date; updatedAt: Date;
}
const studentStore = new Map<string, MockStudent>();
let nextStudentId = 1;

const screenStores: Record<string, Map<number, any>> = {
  studentActivities: new Map(), studentExams: new Map(), studentColleges: new Map(),
  studentEssays: new Map(), studentRecLetters: new Map(), studentPortals: new Map(),
  studentDecide: new Map(), studentFinancialAid: new Map(), studentDeadlines: new Map(),
};

const DEFAULTS: Record<string, any> = {
  studentActivities: { interests: [], coursePlan: {} },
  studentExams: { testPreference: null, apCourses: [] },
  studentColleges: { majorAnswers: {}, collegeList: [] },
  studentEssays: { driveLink: null, notes: null },
  studentRecLetters: { checklist: {}, teachers: [] },
  studentPortals: { portals: [] },
  studentDecide: { decisions: [] },
  studentFinancialAid: { fafsaChecklist: {}, scholarshipAnswers: {} },
  studentDeadlines: { manualDeadlines: [] },
};

function makeScreenMock(model: string) {
  return {
    upsert: async ({ where, create, update }: any) => {
      const sid = where.studentId as number;
      const store = screenStores[model];
      if (Object.keys(update).length === 0) {
        if (!store.has(sid)) store.set(sid, { id: sid, studentId: sid, ...DEFAULTS[model], updatedAt: new Date() });
      } else {
        store.set(sid, { id: sid, studentId: sid, ...update, updatedAt: new Date() });
      }
      return store.get(sid);
    },
    findUnique: async ({ where }: any) => {
      return screenStores[model].get(where.studentId) ?? null;
    },
  };
}

jest.mock('../../server/src/services/prisma', () => ({
  initPrisma: async () => {},
  prisma: {
    student: {
      findUnique: async ({ where }: any) => where.email ? (studentStore.get(where.email) ?? null) : ([...studentStore.values()].find(s => s.id === where.id) ?? null),
      create: async ({ data }: any) => {
        const bcrypt = require('bcryptjs');
        const student: MockStudent = { id: nextStudentId++, createdAt: new Date(), updatedAt: new Date(), ...data };
        studentStore.set(student.email, student);
        return student;
      },
      update: async ({ where, data }: any) => {
        const student = [...studentStore.values()].find(s => s.id === where.id);
        if (!student) throw new Error('Not found');
        Object.assign(student, data, { updatedAt: new Date() });
        return student;
      },
    },
    studentActivities: makeScreenMock('studentActivities'),
    studentExams: makeScreenMock('studentExams'),
    studentColleges: makeScreenMock('studentColleges'),
    studentEssays: makeScreenMock('studentEssays'),
    studentRecLetters: makeScreenMock('studentRecLetters'),
    studentPortals: makeScreenMock('studentPortals'),
    studentDecide: makeScreenMock('studentDecide'),
    studentFinancialAid: makeScreenMock('studentFinancialAid'),
    studentDeadlines: makeScreenMock('studentDeadlines'),
  },
}));

import app from '../../server/src/app';

const PASSWORD = 'password123';

async function signupAgent(suffix = '') {
  const email = `data-${Date.now()}-${suffix}@example.com`;
  const agent = request.agent(app);
  await agent.post('/api/auth/signup').send({ name: 'Test Student', email, password: PASSWORD, highSchool: 'Test High', grade: 11 });
  return agent;
}

afterAll(() => {
  studentStore.clear();
  Object.values(screenStores).forEach(m => m.clear());
});

// --- 401 without auth ---

const SCREEN_ENDPOINTS = [
  '/api/student/profile', '/api/student/activities', '/api/student/exams',
  '/api/student/colleges', '/api/student/essays', '/api/student/recletters',
  '/api/student/portals', '/api/student/decide', '/api/student/financialaid',
  '/api/student/deadlines', '/api/student/progress',
];

describe('Unauthenticated access — all student endpoints return 401', () => {
  it.each(SCREEN_ENDPOINTS)('GET %s → 401', async (path) => {
    const res = await request(app).get(path);
    expect(res.status).toBe(401);
  });

  it.each(SCREEN_ENDPOINTS.filter(p => p !== '/api/student/progress'))('PUT %s → 401', async (path) => {
    const res = await request(app).put(path).send({});
    expect(res.status).toBe(401);
  });
});

// --- Profile ---

describe('GET /api/student/profile', () => {
  it('returns student profile fields', async () => {
    const agent = await signupAgent('profile-get');
    const res = await agent.get('/api/student/profile');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Test Student', highSchool: 'Test High', grade: 11 });
  });
});

describe('PUT /api/student/profile', () => {
  it('updates name, highSchool, grade', async () => {
    const agent = await signupAgent('profile-put');
    const res = await agent.put('/api/student/profile').send({ name: 'Updated', highSchool: 'New High', grade: 12 });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ name: 'Updated', highSchool: 'New High', grade: 12 });
  });
});

// --- Screen data GET defaults ---

const SCREEN_DATA: Array<{ path: string; key: string; defaultValue: any }> = [
  { path: '/api/student/activities', key: 'interests', defaultValue: [] },
  { path: '/api/student/exams', key: 'apCourses', defaultValue: [] },
  { path: '/api/student/colleges', key: 'collegeList', defaultValue: [] },
  { path: '/api/student/essays', key: 'driveLink', defaultValue: null },
  { path: '/api/student/recletters', key: 'checklist', defaultValue: {} },
  { path: '/api/student/portals', key: 'portals', defaultValue: [] },
  { path: '/api/student/decide', key: 'decisions', defaultValue: [] },
  { path: '/api/student/financialaid', key: 'fafsaChecklist', defaultValue: {} },
  { path: '/api/student/deadlines', key: 'manualDeadlines', defaultValue: [] },
];

describe('GET screen endpoints — defaults for fresh student', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => { agent = await signupAgent('defaults'); });

  it.each(SCREEN_DATA)('GET $path returns default $key', async ({ path, key, defaultValue }) => {
    const res = await agent.get(path);
    expect(res.status).toBe(200);
    expect(res.body[key]).toEqual(defaultValue);
  });
});

// --- PUT then GET roundtrip ---

describe('PUT then GET roundtrip — data persists', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => { agent = await signupAgent('roundtrip'); });

  it('activities: saves and restores interests', async () => {
    await agent.put('/api/student/activities').send({ interests: ['Science', 'Tech'], coursePlan: { '9': ['English'] } });
    const res = await agent.get('/api/student/activities');
    expect(res.body.interests).toEqual(['Science', 'Tech']);
    expect(res.body.coursePlan['9']).toEqual(['English']);
  });

  it('exams: saves and restores apCourses', async () => {
    await agent.put('/api/student/exams').send({ testPreference: 'SAT', apCourses: ['AP Calculus'] });
    const res = await agent.get('/api/student/exams');
    expect(res.body.apCourses).toEqual(['AP Calculus']);
    expect(res.body.testPreference).toBe('SAT');
  });

  it('colleges: saves and restores collegeList', async () => {
    const list = [{ name: 'MIT', location: 'Cambridge, MA', variant: 'reach' }];
    await agent.put('/api/student/colleges').send({ majorAnswers: { salaryGoal: '$100k', interestArea: 'CS' }, collegeList: list });
    const res = await agent.get('/api/student/colleges');
    expect(res.body.collegeList).toEqual(list);
  });

  it('essays: saves and restores driveLink and notes', async () => {
    await agent.put('/api/student/essays').send({ driveLink: 'https://drive.google.com/test', notes: 'My notes' });
    const res = await agent.get('/api/student/essays');
    expect(res.body.driveLink).toBe('https://drive.google.com/test');
    expect(res.body.notes).toBe('My notes');
  });

  it('recletters: saves and restores checklist', async () => {
    await agent.put('/api/student/recletters').send({ checklist: { build: true, request: false }, teachers: [] });
    const res = await agent.get('/api/student/recletters');
    expect(res.body.checklist.build).toBe(true);
    expect(res.body.checklist.request).toBe(false);
  });

  it('portals: saves and restores portals', async () => {
    const portals = [{ name: 'Common App', url: 'commonapp.org', status: 'In Progress' }];
    await agent.put('/api/student/portals').send({ portals });
    const res = await agent.get('/api/student/portals');
    expect(res.body.portals).toEqual(portals);
  });

  it('decide: saves and restores decisions', async () => {
    const decisions = [{ school: 'UCLA', result: 'Accepted' }];
    await agent.put('/api/student/decide').send({ decisions });
    const res = await agent.get('/api/student/decide');
    expect(res.body.decisions).toEqual(decisions);
  });

  it('financialaid: saves and restores fafsaChecklist', async () => {
    await agent.put('/api/student/financialaid').send({ fafsaChecklist: { fafsa: true }, scholarshipAnswers: {} });
    const res = await agent.get('/api/student/financialaid');
    expect(res.body.fafsaChecklist.fafsa).toBe(true);
  });

  it('deadlines: saves and restores manualDeadlines', async () => {
    const deadlines = [{ school: 'MIT', label: 'Early Action', date: '2025-11-01', variant: 'reach' }];
    await agent.put('/api/student/deadlines').send({ manualDeadlines: deadlines });
    const res = await agent.get('/api/student/deadlines');
    expect(res.body.manualDeadlines).toEqual(deadlines);
  });
});

// --- Progress ---

describe('GET /api/student/progress', () => {
  it('returns numeric percentages for all 9 screens', async () => {
    const agent = await signupAgent('progress');
    const res = await agent.get('/api/student/progress');
    expect(res.status).toBe(200);
    const keys = ['activities', 'exams', 'colleges', 'essays', 'recletters', 'portals', 'decide', 'financialaid', 'deadlines'];
    keys.forEach(k => {
      expect(typeof res.body[k]).toBe('number');
      expect(res.body[k]).toBeGreaterThanOrEqual(0);
      expect(res.body[k]).toBeLessThanOrEqual(100);
    });
  });
});
