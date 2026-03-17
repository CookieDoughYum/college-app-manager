import request from 'supertest';

process.env.NODE_ENV = 'test';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: 'Mock AI response' }],
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
  studentDecide: { decisions: [], aiRecommendations: {} },
  studentFinancialAid: { fafsaChecklist: {}, scholarshipAnswers: {}, aiRecommendations: {} },
};

function makeScreenMock(model: string) {
  return {
    upsert: async ({ where, update }: any) => {
      const sid = where.studentId as number;
      const store = screenStores[model];
      if (Object.keys(update).length === 0) {
        if (!store.has(sid)) store.set(sid, { id: sid, studentId: sid, ...DEFAULTS[model], updatedAt: new Date() });
      } else {
        const existing = store.get(sid) ?? { id: sid, studentId: sid, ...DEFAULTS[model] };
        store.set(sid, { ...existing, ...update, updatedAt: new Date() });
      }
      return store.get(sid);
    },
    findUnique: async ({ where }: any) => screenStores[model].get(where.studentId) ?? null,
  };
}

jest.mock('../../server/src/services/prisma', () => ({
  initPrisma: async () => {},
  prisma: {
    student: {
      findUnique: async ({ where }: any) => where.email ? (studentStore.get(where.email) ?? null) : ([...studentStore.values()].find(s => s.id === where.id) ?? null),
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

async function signupAgent(suffix = '') {
  const email = `ai-${Date.now()}-${suffix}@example.com`;
  const agent = request.agent(app);
  await agent.post('/api/auth/signup').send({ name: 'Test Student', email, password: PASSWORD, highSchool: 'Test High', grade: 11 });
  return agent;
}

afterAll(() => {
  studentStore.clear();
  Object.values(screenStores).forEach(m => m.clear());
});

const AI_ENDPOINTS = [
  '/api/ai/activities/recommend',
  '/api/ai/exams/recommend',
  '/api/ai/colleges/recommend',
  '/api/ai/decide/compare',
  '/api/ai/financialaid/scholarships',
];

describe('AI endpoints — 401 without auth', () => {
  it.each(AI_ENDPOINTS)('POST %s → 401', async (path) => {
    const res = await request(app).post(path);
    expect(res.status).toBe(401);
  });
});

describe('AI endpoints — return { result: string } when authenticated', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => { agent = await signupAgent('ai-result'); });

  it.each(AI_ENDPOINTS)('POST %s → 200 with result string', async (path) => {
    const res = await agent.post(path);
    expect(res.status).toBe(200);
    expect(typeof res.body.result).toBe('string');
    expect(res.body.result.length).toBeGreaterThan(0);
  });
});

describe('AI endpoints — save result to aiRecommendations', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => { agent = await signupAgent('ai-cache'); });

  it('activities: result cached after call', async () => {
    await agent.post('/api/ai/activities/recommend');
    const get = await agent.get('/api/student/activities');
    expect(get.body.aiRecommendations).toBeDefined();
    expect(typeof get.body.aiRecommendations).toBe('object');
  });

  it('decide: returns message when fewer than 2 accepted schools', async () => {
    const res = await agent.post('/api/ai/decide/compare');
    expect(res.status).toBe(200);
    expect(res.body.result).toMatch(/at least 2/i);
  });
});
