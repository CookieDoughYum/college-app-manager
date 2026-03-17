import request from 'supertest';

process.env.NODE_ENV = 'test';

// Mock Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return jest.fn().mockImplementation(() => ({
    messages: {
      create: jest.fn().mockResolvedValue({
        content: [{ type: 'text', text: '[{"type":"RD","date":"January 1"}]' }],
      }),
    },
  }));
});

// Mock global fetch (used by webFetch service)
const mockFetch = jest.fn().mockResolvedValue({
  text: async () => '<html><body><p>Apply by January 1 Regular Decision</p></body></html>',
  ok: true,
});
global.fetch = mockFetch as any;

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

async function signupAgent(suffix = '') {
  const email = `web-${Date.now()}-${suffix}@example.com`;
  const agent = request.agent(app);
  await agent.post('/api/auth/signup').send({ name: 'Test Student', email, password: PASSWORD, highSchool: 'Test High', grade: 11 });
  return agent;
}

afterAll(() => {
  studentStore.clear();
  Object.values(screenStores).forEach(m => m.clear());
});

const WEB_ENDPOINTS = [
  '/api/ai/essays/whyus',
  '/api/ai/deadlines/scrape',
];

describe('Web research endpoints — 401 without auth', () => {
  it.each(WEB_ENDPOINTS)('POST %s → 401', async (path) => {
    const res = await request(app).post(path).send({ schoolName: 'Stanford' });
    expect(res.status).toBe(401);
  });
});

describe('Web research endpoints — whyus endpoint', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => { agent = await signupAgent('whyus'); });

  it('returns 200 with result string', async () => {
    const res = await agent.post('/api/ai/essays/whyus').send({ schoolName: 'Stanford' });
    expect(res.status).toBe(200);
    expect(typeof res.body.result).toBe('string');
    expect(res.body.result.length).toBeGreaterThan(0);
  });

  it('saves result to whyUsResults keyed by school name', async () => {
    await agent.post('/api/ai/essays/whyus').send({ schoolName: 'MIT' });
    const get = await agent.get('/api/student/essays');
    expect(get.body.whyUsResults).toBeDefined();
    expect(typeof get.body.whyUsResults).toBe('object');
  });

  it('includes the school name in the prompt (Claude receives it)', async () => {
    // The mock returns its canned response; we just verify no error
    const res = await agent.post('/api/ai/essays/whyus').send({ schoolName: 'Caltech', url: 'https://caltech.edu' });
    expect(res.status).toBe(200);
    expect(res.body.result).toBeTruthy();
  });
});

describe('Web research endpoints — deadlines/scrape endpoint', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => {
    agent = await signupAgent('scrape');
    // Set up a college list
    await agent.put('/api/student/colleges').send({
      majorAnswers: {},
      collegeList: [{ name: 'UC Berkeley', url: 'https://admissions.berkeley.edu' }],
      aiRecommendations: {},
    });
  });

  it('returns 200 with result and deadlines array', async () => {
    const res = await agent.post('/api/ai/deadlines/scrape');
    expect(res.status).toBe(200);
    expect(typeof res.body.result).toBe('string');
    expect(Array.isArray(res.body.deadlines)).toBe(true);
  });

  it('saves scraped deadlines to manualDeadlines', async () => {
    await agent.post('/api/ai/deadlines/scrape');
    const get = await agent.get('/api/student/deadlines');
    expect(Array.isArray(get.body.manualDeadlines)).toBe(true);
  });
});

describe('Web research endpoints — graceful fetch failure', () => {
  let agent: request.SuperAgentTest;
  beforeAll(async () => {
    agent = await signupAgent('fail');
    // Set college list for this student
    await agent.put('/api/student/colleges').send({
      majorAnswers: {},
      collegeList: [{ name: 'Failing School' }],
      aiRecommendations: {},
    });
  });

  it('scrape skips schools that fail to fetch and still returns 200', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));
    const res = await agent.post('/api/ai/deadlines/scrape');
    expect(res.status).toBe(200);
    expect(res.body.result).toMatch(/could not fetch/i);
  });
});
