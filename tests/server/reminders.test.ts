import request from 'supertest';

process.env.NODE_ENV = 'test';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'Mock study schedule Week 1: ...' }],
      }),
    },
  }));
});

// Student in-memory store
interface MockStudent { id: number; name: string; email: string; passwordHash: string; highSchool: string; grade: number; createdAt: Date; updatedAt: Date; }
const studentStore = new Map<string, MockStudent>();
let nextId = 1;

const screenStores: Record<string, Map<number, any>> = {
  studentActivities: new Map(), studentExams: new Map(), studentColleges: new Map(),
  studentEssays: new Map(), studentRecLetters: new Map(), studentPortals: new Map(),
  studentDecide: new Map(), studentFinancialAid: new Map(), studentDeadlines: new Map(),
};

const DEFAULTS: Record<string, any> = {
  studentActivities: { interests: [], coursePlan: {}, aiRecommendations: {} },
  studentExams: { testPreference: null, apCourses: [], aiRecommendations: {} },
  studentColleges: { majorAnswers: {}, collegeList: [], aiRecommendations: {} },
  studentEssays: { driveLink: null, notes: null, whyUsResults: {} },
  studentRecLetters: { checklist: {}, teachers: [] },
  studentPortals: { portals: [] },
  studentDecide: { decisions: [], aiRecommendations: {} },
  studentFinancialAid: { fafsaChecklist: {}, scholarshipAnswers: {}, aiRecommendations: {} },
  studentDeadlines: { manualDeadlines: [] },
};

function makeScreenMock(model: string) {
  return {
    upsert: async ({ where, update, create }: any) => {
      const sid = where.studentId as number;
      const store = screenStores[model];
      const existing = store.get(sid) ?? { id: sid, studentId: sid, ...DEFAULTS[model] };
      const merged = Object.keys(update ?? {}).length > 0
        ? { ...existing, ...update, updatedAt: new Date() }
        : { ...existing, ...(create ?? {}), updatedAt: new Date() };
      store.set(sid, merged);
      return store.get(sid);
    },
    findUnique: async ({ where }: any) => screenStores[model].get(where.studentId) ?? null,
  };
}

jest.mock('../../server/src/services/prisma', () => ({
  initPrisma: async () => {},
  prisma: {
    student: {
      findUnique: async ({ where }: any) => where.email
        ? (studentStore.get(where.email) ?? null)
        : ([...studentStore.values()].find(s => s.id === where.id) ?? null),
      create: async ({ data }: any) => {
        const student: MockStudent = { id: nextId++, createdAt: new Date(), updatedAt: new Date(), ...data };
        studentStore.set(student.email, student);
        return student;
      },
      update: async ({ where, data }: any) => {
        const student = [...studentStore.values()].find(s => s.id === where.id);
        if (!student) throw new Error('Not found');
        Object.assign(student, data);
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

async function signupAgent(suffix = '', grade = 11) {
  const email = `rem-${Date.now()}-${suffix}@example.com`;
  const agent = request.agent(app);
  await agent.post('/api/auth/signup').send({ name: 'Test Student', email, password: PASSWORD, highSchool: 'Test High', grade });
  return agent;
}

afterAll(() => {
  studentStore.clear();
  Object.values(screenStores).forEach(m => m.clear());
});

describe('GET /api/student/reminders — 401 without auth', () => {
  it('returns 401', async () => {
    const res = await request(app).get('/api/student/reminders');
    expect(res.status).toBe(401);
  });
});

describe('GET /api/student/reminders — authenticated', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => { agent = await signupAgent('grade11', 11); });

  it('returns { reminders: array }', async () => {
    const res = await agent.get('/api/student/reminders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.reminders)).toBe(true);
  });

  it('includes a grade-based reminder', async () => {
    const res = await agent.get('/api/student/reminders');
    const gradeReminder = res.body.reminders.find((r: any) => r.type === 'grade');
    expect(gradeReminder).toBeDefined();
    expect(gradeReminder.urgency).toBe('green');
    expect(typeof gradeReminder.message).toBe('string');
  });

  it('includes a deadline reminder when deadline is within 30 days', async () => {
    // Add a deadline 10 days from now
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
    await agent.put('/api/student/deadlines').send({
      manualDeadlines: [{ school: 'Stanford', label: 'RD', date: future.toISOString().split('T')[0], variant: 'reach' }],
    });
    const res = await agent.get('/api/student/reminders');
    const deadlineReminder = res.body.reminders.find((r: any) => r.type === 'deadline');
    expect(deadlineReminder).toBeDefined();
    expect(['red', 'amber']).toContain(deadlineReminder.urgency);
    expect(deadlineReminder.message).toMatch(/Stanford/);
  });

  it('does not include deadline reminder for past dates', async () => {
    const past = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
    await agent.put('/api/student/deadlines').send({
      manualDeadlines: [{ school: 'PastSchool', label: 'RD', date: past.toISOString().split('T')[0], variant: 'reach' }],
    });
    const res = await agent.get('/api/student/reminders');
    const pastReminder = res.body.reminders.find((r: any) => r.message?.includes('PastSchool'));
    expect(pastReminder).toBeUndefined();
  });
});

describe('POST /api/ai/exams/schedule — 401 without auth', () => {
  it('returns 401', async () => {
    const res = await request(app).post('/api/ai/exams/schedule');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/ai/exams/schedule — authenticated', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => { agent = await signupAgent('schedule'); });

  it('returns { result: string }', async () => {
    const res = await agent.post('/api/ai/exams/schedule');
    expect(res.status).toBe(200);
    expect(typeof res.body.result).toBe('string');
    expect(res.body.result.length).toBeGreaterThan(0);
  });

  it('caches result in aiRecommendations.schedule', async () => {
    await agent.post('/api/ai/exams/schedule');
    const get = await agent.get('/api/student/exams');
    expect(get.body.aiRecommendations?.schedule).toBeDefined();
  });
});
